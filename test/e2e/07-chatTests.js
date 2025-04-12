import { expect } from 'chai';
import http from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import setupChat from '../../src/modules/chat/chatGateway.js';
import { getEntityId } from './testState.js';
import { getToken } from './tokenStore.js';
import { CHAT_URL as URL, setChatPort } from '../testConfig.js';

describe('Chat socket gateway', () => {
    let httpServer;
    let io;
    const sockets = [];

    const users = ['projectmember1@gmail.com', 'projectmember2@gmail.com'];

    let tokens;
    let userIds;

    before(async () => {
        httpServer = http.createServer();
        io = new Server(httpServer, {
            cors: { origin: '*' },
        });

        setupChat(io);

        await new Promise((resolve) => {
            httpServer.listen(0, () => {
                const port = httpServer.address().port;
                setChatPort(port);
                resolve();
            });
        });

        tokens = await Promise.all(users.map(getToken));
        userIds = users.map(email => getEntityId('users', email));
    });

    after((done) => {
        sockets.forEach((s) => s.disconnect());
        io.close();
        httpServer.close(done);
    });

    it('should send and receive messages between project members', function (done) {

        const projectName = 'QB Project';
        const projectId = getEntityId('projects', projectName);
        const receivedFrom = new Set();

        users.forEach((email, i) => {
            const client = Client(URL, {
                auth: { token: `Bearer ${tokens[i]}` },
                transports: ['websocket'],
            });

            sockets.push(client);

            client.on('connect', () => {
                console.log(`[client ${email}] connected`);
                setTimeout(() => {
                    client.emit('join_project', { projectId });
                }, i * 100);
            });

            client.on('receive_message', (msg) => {
                console.log(`[client ${email}] received message:`, msg);
                receivedFrom.add(email);

                if (receivedFrom.size === users.length) {
                    setTimeout(() => {
                        try {
                            expect(msg.senderId).to.equal(userIds[0]);
                            expect(msg.content).to.equal('Hello from member1');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }, 300);
                }
            });

            client.on('connect_error', (err) => {
                console.error(`[client ${email}] connection error:`, err.message);
                done(err);
            });
        });

        const sender = Client(URL, {
            auth: { token: `Bearer ${tokens[0]}` },
            transports: ['websocket'],
        });

        sockets.push(sender);

        sender.on('connect', () => {
            sender.emit('join_project', { projectId });

            setTimeout(() => {
                console.log(`[client ${users[0]}] sending message...`);
                sender.emit('send_message', {
                    tempId: 'temp-msg-1',
                    message: 'Hello from member1',
                });
            }, 100);
        });

        sender.on('connect_error', done);
    });
});