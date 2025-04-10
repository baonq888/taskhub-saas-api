import { expect } from 'chai';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import setupChat from '../../src/modules/chat/chatGateway.js';
import { getEntityId } from './testState.js';
import { getToken } from './tokenStore.js';
import server from '../testServer.js';
import { CHAT_PORT as PORT, CHAT_URL as URL } from '../testConfig.js';


describe('Chat socket gateway', () => {
    let io;
    let sockets = [];

    const users = [
        'projectmember1@gmail.com',
        'projectmember2@gmail.com'
    ];

    const tokens = users.map(getToken);
    const userIds = users.map(email => getEntityId('users', email));
    const projectId = getEntityId('projects', 'QB Project');

    before((done) => {
        io = new Server(server, {
            cors: { origin: '*' }
        });

        setupChat(io);

        server.listen(PORT, done);
    });

    afterEach(() => {
        for (const socket of sockets) {
            if (socket?.connected) socket.disconnect();
        }
        sockets = [];
    });

    after((done) => {
        io.close();
        server.close(done);
    });

    it('should send and receive messages between project members', (done) => {
        const tempMessageId = 'temp-msg-1';
        const testMessage = 'Hello from member1';

        const member1 = Client(URL, {
            auth: { token: `Bearer ${tokens[0]}` },
            transports: ['websocket'],
        });

        const member2 = Client(URL, {
            auth: { token: `Bearer ${tokens[1]}` },
            transports: ['websocket'],
        });

        sockets.push(member1, member2);

        let receiveCount = 0;

        const finish = (err) => {
            member1.disconnect();
            member2.disconnect();
            done(err);
        };

        member2.on('receive_message', (msg) => {
            try {
                expect(msg.content).to.equal(testMessage);
                expect(msg.senderId).to.equal(userIds[0]);
                expect(msg.chatRoomId).to.exist;
                expect(msg.id).to.equal(tempMessageId);
                receiveCount++;

                if (receiveCount === 1) finish(); // only once needed for test
            } catch (err) {
                finish(err);
            }
        });

        member1.on('connect', () => {
            member1.emit('join_project', { projectId });
        });

        member2.on('connect', () => {
            member2.emit('join_project', { projectId });

            // Once both have joined, send message from member1
            setTimeout(() => {
                member1.emit('send_message', {
                    tempId: tempMessageId,
                    message: testMessage,
                });
            }, 100);
        });
    });
});