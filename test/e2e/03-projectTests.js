import { expect } from 'chai';
import request from 'supertest';
import server from '../testServer.js';
import { getToken } from './tokenStore.js';
import {
    getEntityId,
    setEntity
} from './testState.js';

describe('Project Endpoints', () => {
    const email = 'tenantowner@gmail.com';
    let tenantId, projectId;

    before(async () => {
        const token = getToken(email);
        tenantId = getEntityId('tenants', 'QB Corp');

        if (!tenantId) {
            throw new Error('Missing tenantId. Make sure tenant test runs first and sets it.');
        }

        // Create project if not already exists
        projectId = getEntityId('projects', 'QB Project');
        if (!projectId) {
            const projectRes = await request(server)
                .post(`/api/v1/tenants/${tenantId}/projects`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'QB Project' });

            expect(projectRes.status).to.equal(201);
            projectId = projectRes.body.id;
            setEntity('projects', 'QB Project', { id: projectId });
        }
    });

    it('should fetch the project by ID', async () => {
        const res = await request(server)
            .get(`/api/v1/tenants/${tenantId}/projects/${projectId}`)
            .set('Authorization', `Bearer ${getToken(email)}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', projectId);
        expect(res.body).to.have.property('name', 'QB Project');
    });

    it('should update the project', async () => {
        const res = await request(server)
            .patch(`/api/v1/tenants/${tenantId}/projects/${projectId}`)
            .set('Authorization', `Bearer ${getToken(email)}`)
            .send({ name: 'QB Project Updated' });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('name', 'QB Project Updated');
    });

    it('should get all projects in the tenant', async () => {
        const res = await request(server)
            .get(`/api/v1/tenants/${tenantId}/projects`)
            .set('Authorization', `Bearer ${getToken(email)}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.some(p => p.id === projectId)).to.be.true;
    });

    it('should invite multiple users to the project', async () => {
        const res = await request(server)
            .post(`/api/v1/tenants/${tenantId}/projects/${projectId}/invite`)
            .set('Authorization', `Bearer ${getToken(email)}`)
            .send({
                emails: [
                    'projectadmin@gmail.com',
                    'projectmember1@gmail.com',
                    'projectmember2@gmail.com'
                ]
            });

        expect(res.status).to.equal(200);
        // expect(res.body).to.have.property('invited').that.is.an('array');
        // expect(res.body.invited).to.include.members([
        //     'projectadmin@gmail.com',
        //     'projectmember1@gmail.com',
        //     'projectmember2@gmail.com'
        // ]);
    });

    it('should delete the project', async () => {
        const res = await request(server)
            .delete(`/api/v1/tenants/${tenantId}/projects/${projectId}`)
            .set('Authorization', `Bearer ${getToken(email)}`);

        expect(res.status).to.equal(204);
    });
});