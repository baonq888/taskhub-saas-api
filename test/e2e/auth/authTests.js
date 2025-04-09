import { expect } from 'chai';
import request from 'supertest';
import server from '../../testServer.js';
import prisma from '../../../src/core/db/index.js';

describe('Auth Endpoints', () => {
    const users = [
        { email: 'tenantowner@gmail.com', password: '123' },
        { email: 'tenantadmin@gmail.com', password: '123' },
        { email: 'tenantmember1@gmail.com', password: '123'},
        { email: 'tenantmember2@gmail.com', password: '123'},
        { email: 'projectowner@gmail.com', password: '123'},
        { email: 'projectadmin@gmail.com', password: '123'},
        { email: 'projectmember1@gmail.com', password: '123'},
        { email: 'projectmember2@gmail.com', password: '123'},
    ];


    // Clean database before each test
    beforeEach(async () => {
        for (const user of users) {
            await prisma.user.deleteMany({ where: { email: user.email } });
        }
    });

    describe('Register multiple users with roles', () => {
        it('should register owner, admin, and member', async () => {
            for (const user of users) {
                const res = await request(server)
                    .post('/auth/register')
                    .send({
                        email: user.email,
                        password: user.password,
                        role: user.role // this assumes your endpoint accepts a `role` field
                    });

                expect(res.status).to.equal(201);
                expect(res.body.user).to.have.property('email', user.email);
                expect(res.body.user).to.have.property('role', user.role);
            }
        });
    });

    describe('Login all users', () => {
        beforeEach(async () => {
            for (const user of users) {
                await request(server)
                    .post('/auth/register')
                    .send({
                        email: user.email,
                        password: user.password,
                        role: user.role
                    });
            }
        });

        it('should login all users and receive tokens', async () => {
            for (const user of users) {
                const res = await request(server)
                    .post('/auth/login')
                    .send({
                        email: user.email,
                        password: user.password
                    });

                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('accessToken');
                expect(res.body).to.have.property('refreshToken');
            }
        });
    });

    describe('Refresh token', () => {
        const user = users[0];

        let refreshToken;

        beforeEach(async () => {
            // Clean up the user if already exists
            await prisma.user.deleteMany({ where: { email: user.email } });

            // Register the user
            await request(server)
                .post('/auth/register')
                .send({ email: user.email, password: user.password });

            // Login to get refresh token
            const loginRes = await request(server)
                .post('/auth/login')
                .send({ email: user.email, password: user.password });

            refreshToken = loginRes.body.refreshToken;
        });

        it('should return a new access token', async () => {
            const res = await request(server)
                .post('/auth/refresh')
                .send({ refreshToken });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('accessToken');
        });

        it('should return 400 if refresh token is missing', async () => {
            const res = await request(server)
                .post('/auth/refresh')
                .send({});

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Refresh token is required');
        });
    });
});