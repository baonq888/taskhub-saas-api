import { expect } from 'chai';
import request from 'supertest';
import server from '../testServer.js';
import prisma from '../../src/core/db/index.js';
import { getToken } from './tokenStore.js';
import { TenantRole } from '@prisma/client';
import {
    setEntity,
    getEntity,
    getEntityId
} from './testState.js';
import {API_VERSION} from "../testConfig.js";

describe('Tenant Endpoints', () => {
    before(async () => {
        await prisma.tenant.deleteMany({});
    });

    const email = 'tenantowner@gmail.com'
    const tenantName = 'QB Corp';

    describe('Create Tenant', () => {
        it('should create a new tenant as tenant owner', async () => {
            const res = await request(server)
                .post(`${API_VERSION}/tenants`)
                .set('Authorization', `Bearer ${getToken(email)}`)
                .send({ name: tenantName });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('tenant');
            expect(res.body.tenant).to.have.property('name', tenantName);

            const tenantId = res.body.tenant.id;
            setEntity('tenants', tenantName, {id: tenantId});
        });
    });

    describe('Get Tenant by ID', () => {
        it('should fetch tenant details', async () => {
            const tenantId = getEntityId('tenants', tenantName);

            const res = await request(server)
                .get(`${API_VERSION}/tenants/${tenantId}`)
                .set('Authorization', `Bearer ${getToken(email)}`);

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

            const tenantId = getEntityId('tenants', tenantName);
            const res = await request(server)
                .post(`${API_VERSION}/tenants/${tenantId}/invite`)
                .set('Authorization', `Bearer ${getToken(email)}`)
                .send({ emails });

            expect(res.status).to.equal(200);
            expect(res.body.invited).to.be.an('array').with.lengthOf(emails.length);
        });


    });

    describe('Update Tenant User Role', () => {
        const emailToInvite = 'tenantadmin@gmail.com';

        it('should update user role in tenant', async () => {
            const tenantId = getEntityId('tenants', tenantName);
            const userId = getEntityId('users', emailToInvite);
            console.log('user', getEntity('users', emailToInvite));
            const res = await request(server)
                .patch(`${API_VERSION}/tenants/${tenantId}/users/${userId}/role`)
                .set('Authorization', `Bearer ${getToken(email)}`)
                .send({ newRole: TenantRole.TENANT_ADMIN.toString() });

            expect(res.status).to.equal(200);
        });
    });

    describe('List All Tenants', () => {
        it('should list all tenants', async () => {
            const res = await request(server)
                .get(`${API_VERSION}/tenants`)
                .set('Authorization', `Bearer ${getToken(email)}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });
    });
});