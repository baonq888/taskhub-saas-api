import * as chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { consumeNotificationEvent } from '../../src/modules/notifications/NotificationConsumer.js';
import { RABBITMQ_URL } from '../testConfig.js';
import CronJobs from '../../src/scheduler/index.js';
import DeadlineScheduler from '../../src/scheduler/task/deadlineScheduler.js';

chai.use(sinonChai);

describe('Notification Consumer and Cron Job', () => {
    let channelMock;
    let sendNotificationStub;
    let notifyDeadlineStub;

    beforeEach(() => {
        channelMock = {
            assertQueue: sinon.stub().resolves(),
            consume: sinon.stub(),
            ack: sinon.stub()
        };

        sendNotificationStub = sinon.stub().resolves();

        // Stub the notifyDeadline method to track when it's called
        notifyDeadlineStub = sinon.stub(DeadlineScheduler, 'notifyDeadline').resolves();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should process and acknowledge messages from RabbitMQ after cron job runs', async () => {
        const fakeMsg = {
            content: Buffer.from(JSON.stringify({
                userId: 'user-123',
                message: 'Your task is due soon!',
                type: 'TASK_DEADLINE'
            }))
        };

        // Simulate immediate message handling
        channelMock.consume.callsFake((_queue, callback) => {
            callback(fakeMsg);
        });

        // Start the cron job
        CronJobs.start();

        // Wait for the cron job to finish by checking the spy on notifyDeadline
        const cronJobPromise = new Promise((resolve, reject) => {
            const cronJobInterval = setInterval(() => {
                if (notifyDeadlineStub.calledOnce) {
                    clearInterval(cronJobInterval);
                    resolve(); // Cron job finished
                }
            }, 100); // Check every 100ms
        });

        // Wait until the cron job completes before proceeding
        await cronJobPromise;

        // After waiting for the cron job to complete, process the notification
        await consumeNotificationEvent({
            connectRabbitMQ: async () => channelMock, // Use your mocked connectRabbitMQ
            sendNotification: sendNotificationStub,
            RABBITMQ_URL // Pass RABBITMQ_URL from config
        });

        // Assert that the cron job's side effect (sending the notification) was triggered
        sinon.assert.calledOnceWithExactly(sendNotificationStub,
            'user-123',
            'Your task is due soon!',
            'TASK_DEADLINE'
        );
        sinon.assert.calledOnceWithExactly(channelMock.ack, fakeMsg);

        // Also assert that the notifyDeadline method was called once
        sinon.assert.calledOnce(notifyDeadlineStub);
    });
});