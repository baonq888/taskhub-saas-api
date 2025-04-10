import { expect } from 'chai';
import request from 'supertest';
import server from '../testServer.js';
import prisma from '../../src/core/db/index.js';
import { getToken } from './tokenStore.js';
import { TenantRole } from '@prisma/client';
import {
    setEntity,
    getEntity,
    clearTestState
} from './testState.js';

describe('Tenant Endpoints', () => {
    before(async () => {
        await prisma.tenant.deleteMany({});
        clearTestState();
    });

    describe('Create Tenant', () => {
        it('should create a new tenant as tenant owner', async () => {
            const res = await request(server)
                .post('/tenants')
                .set('Authorization', `Bearer ${getToken('tenantowner@gmail.com')}`)
                .send({ name: 'QB Corp' });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('tenant');
            expect(res.body.tenant).to.have.property('name', 'QB Corp');

            const tenantId = res.body.tenant.id;
            setEntity('tenants', 'QB Corp', tenantId);
        });
    });

    describe('Get Tenant by ID', () => {
        it('should fetch tenant details', async () => {
            const tenantId = getEntity('tenants', 'QB Corp');

            const res = await request(server)
                .get(`/tenants/${tenantId}`)
                .set('Authorization', `Bearer ${getToken('tenantowner@gmail.com')}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('id', tenantId);
        });
    });

    describe('Invite Users to Tenant', () => {
        it('should invite users by email', async () => {
            const emails = [
                'tenantadmin@gmail.com',
                'tenantmember1@gmail.com',
                'tenantmember2@gmail.com'
            ];

            const tenantId = getEntity('tenants', 'QB Corp');

            const res = await request(server)
                .post(`/tenants/${tenantId}/invite`)
                .set('Authorization', `Bearer ${getToken('tenantowner@gmail.com')}`)
                .send({ emails });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('invited');
            expect(res.body.invited).to.be.an('array').with.lengthOf(emails.length);
        });

        it('should return 400 for invalid emails array', async () => {
            const tenantId = getEntity('tenants', 'QB Corp');

            const res = await request(server)
                .post(`/tenants/${tenantId}/invite`)
                .set('Authorization', `Bearer ${getToken('tenantowner@gmail.com')}`)
                .send({ emails: [] });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
        });
    });

    describe('Update Tenant User Role', () => {
        before(async () => {
            const user = await prisma.user.findUnique({ where: { email: 'tenantadmin@gmail.com' } });
            if (user) setEntity('users', 'tenantadmin@gmail.com', user.id);
        });

        it('should update user role in tenant', async () => {
            const tenantId = getEntity('tenants', 'QB Corp');
            const memberId = getEntity('users', 'tenantadmin@gmail.com');

            const res = await request(server)
                .patch(`/tenants/${tenantId}/users/${memberId}/role`)
                .set('Authorization', `Bearer ${getToken('tenantowner@gmail.com')}`)
                .send({ newRole: TenantRole.TENANT_ADMIN });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'User role updated successfully');
        });
    });

    describe('List All Tenants', () => {
        it('should list all tenants', async () => {
            const res = await request(server)
                .get('/tenants')
                .set('Authorization', `Bearer ${getToken('tenantowner@gmail.com')}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });
    });
});