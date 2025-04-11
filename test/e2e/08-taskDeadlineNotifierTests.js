// import chai from 'chai';
// import sinonChai from 'sinon-chai';
// import sinon from 'sinon';
// import * as rabbitMQModule from '../../src/infrastructure/messaging/rabbitmq.js';
// import * as consumer from '../../src/modules/notifications/NotificationConsumer.js';
// import notificationService from '../../src/modules/notifications/notificationService.js';
//
// // Setup chai to use sinon-chai
// chai.use(sinonChai);
//
// describe('Notification Consumer', () => {
//     let connectStub;
//     let channelMock;
//     let sendNotificationStub;
//
//     beforeEach(() => {
//         channelMock = {
//             assertQueue: sinon.stub().resolves(),
//             consume: sinon.stub(),
//             ack: sinon.stub()
//         };
//
//         connectStub = sinon.stub(rabbitMQModule, 'connectRabbitMQ').resolves(channelMock);
//
//         sendNotificationStub = sinon.stub(notificationService, 'sendNotification').resolves();
//     });
//
//     afterEach(() => {
//         sinon.restore();
//     });
//
//     it('should process and acknowledge messages from RabbitMQ', async () => {
//         const fakeMsg = {
//             content: Buffer.from(JSON.stringify({
//                 userId: 'user-123',
//                 message: 'Your task is due soon!',
//                 type: 'TASK_DEADLINE'
//             }))
//         };
//
//         // Trigger the callback immediately after consumer setup
//         channelMock.consume.callsFake((_queue, callback) => {
//             callback(fakeMsg);
//         });
//
//         await consumer.consumeNotificationEvent();
//
//         sinon.assert.calledOnceWithExactly(sendNotificationStub,
//             'user-123',
//             'Your task is due soon!',
//             'TASK_DEADLINE'
//         );
//         sinon.assert.calledOnceWithExactly(channelMock.ack, fakeMsg);
//     });
// });