import { expect } from 'chai';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import setupOnlineStatus from '../../src/modules/online-status/onlineStatusGateway.js';
import { getEntityId } from './testState.js';
import { getToken } from './tokenStore.js';
import server from '../testServer.js';
import { redis, PRESENCE_PORT as PORT, PRESENCE_URL as URL } from '../testConfig.js';


describe('User online status socket gateway', () => {
    let io;
    let sockets = [];
    let onlineUsersKey;

    before((done) => {
        io = new Server(server, {
            cors: { origin: '*' },
        });

        setupOnlineStatus(io);
        server.listen(PORT, done);
    });

    after((done) => {
        io.close();
        server.close(done);
    });

    afterEach(async () => {
        for (const socket of sockets) {
            if (socket?.connected) socket.disconnect();
        }
        sockets = [];

        if (onlineUsersKey) {
            await redis.del(onlineUsersKey);
        }
    });

    it('should allow multiple users to join the same project room', (done) => {
        const users = [
            'projectadmin@gmail.com',
            'projectmember1@gmail.com',
            'projectmember2@gmail.com',
        ];

        const projectName = 'QB Project';
        const projectId = getEntityId('projects', projectName);
        const userIds = users.map(email => getEntityId('users', email));
        onlineUsersKey = `onlineUsers:${projectId}`;

        const tokens = users.map(getToken);
        let onlineEventsReceived = 0;

        users.forEach((email, i) => {
            const client = Client(URL, {
                auth: { token: `Bearer ${tokens[i]}` },
                transports: ['websocket'],
            });

            sockets.push(client);

            client.on('connect', () => {
                client.emit('join_project', { projectId });
            });

            client.on('user_online', async (userList) => {
                onlineEventsReceived++;

                if (onlineEventsReceived === users.length) {
                    try {
                        for (const userId of userIds) {
                            expect(userList).to.include(userId.toString());
                        }

                        const redisUsers = await redis.smembers(onlineUsersKey);
                        for (const userId of userIds) {
                            expect(redisUsers).to.include(userId.toString());
                        }

                        done();
                    } catch (err) {
                        done(err);
                    }
                }
            });
        });
    });

    it('should remove user from Redis on disconnect', (done) => {
        const email = 'projectadmin@gmail.com';
        const token = getToken(email);
        const userId = getEntityId('users', email);
        const projectId = getEntityId('projects', 'QB Project');
        onlineUsersKey = `onlineUsers:${projectId}`;

        const client = Client(URL, {
            auth: { token: `Bearer ${token}` },
            transports: ['websocket'],
        });

        sockets.push(client);

        client.on('connect', () => {
            client.emit('join_project', { projectId });

            setTimeout(() => {
                client.disconnect();
            }, 100);
        });

        client.on('user_online', () => {
            setTimeout(async () => {
                try {
                    const redisUsers = await redis.smembers(onlineUsersKey);
                    expect(redisUsers).to.not.include(userId.toString());
                    done();
                } catch (err) {
                    done(err);
                }
            }, 200); // small wait to let Redis update
        });
    });
});