import { expect } from 'chai';
import request from 'supertest';
import server from '../testServer.js';
import { getToken } from './tokenStore.js';
import {
    getEntityId,
    setEntity
} from './testState.js';
import {ProjectRole} from "@prisma/client";
import {API_VERSION} from "../testConfig.js";

describe('Project Endpoints', () => {
    const email = 'tenantadmin@gmail.com';
    const tenantName = 'QB Corp';
    const projectName = 'QB Project';
    const projectOwnerEmail = 'projectowner@gmail.com';

    let tenantId, projectId;

    describe('Create Project', () => {
        it('should create a new project', async () => {
            const token = getToken(email);
            tenantId = getEntityId('tenants', tenantName);

            if (!tenantId) {
                throw new Error('Missing tenantId. Make sure tenant test runs first and sets it.');
            }

            // Create project if not already exists
            projectId = getEntityId('projects', projectName);
            if (!projectId) {
                const projectRes = await request(server)
                    .post(`${API_VERSION}/tenants/${tenantId}/projects`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: projectName });

                expect(projectRes.status).to.equal(201);
                projectId = projectRes.body.project.id;
                setEntity('projects', projectName, { id: projectId });
            }
        })

    });

    describe('Get Project', () => {
        it('should fetch the project by ID', async () => {
            tenantId = getEntityId('tenants', tenantName);
            projectId = getEntityId('projects', projectName);
            const res = await request(server)
                .get(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}`)
                .set('Authorization', `Bearer ${getToken(email)}`);

            expect(res.status).to.equal(200);
        });
    })



    describe('Get all projects in the tenant', () => {
        tenantId = getEntityId('tenants', tenantName);
        projectId = getEntityId('projects', projectName);
        it('should get all projects in the tenant', async () => {
            const res = await request(server)
                .get(`${API_VERSION}/tenants/${tenantId}/projects`)
                .set('Authorization', `Bearer ${getToken(email)}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });
    })


   describe('Invite project members', () => {
       tenantId = getEntityId('tenants', tenantName);
       projectId = getEntityId('projects', projectName);


       it('should invite the project owner', async () => {
           const res = await request(server)
               .post(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/invite`)
               .set('Authorization', `Bearer ${getToken(email)}`)
               .send({ emails: [projectOwnerEmail] });

           expect(res.status).to.equal(200);
       });


       it('should update project owner to PROJECT_OWNER', async () => {

           const userId = getEntityId('users', projectOwnerEmail);
           const res = await request(server)
               .put(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/users/${userId}/role`)
               .set('Authorization', `Bearer ${getToken(email)}`) // tenant admin
               .send({ newRole: ProjectRole.PROJECT_OWNER.toString() });
           expect(res.status).to.equal(200);
       });

       it('project owner should invite other members', async () => {
           const res = await request(server)
               .post(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/invite`)
               .set('Authorization', `Bearer ${getToken(projectOwnerEmail)}`)
               .send({
                   emails: [
                       'projectadmin@gmail.com',
                       'projectmember1@gmail.com',
                       'projectmember2@gmail.com'
                   ]
               });

           expect(res.status).to.equal(200);
       });



       it('project owner should update project admin to PROJECT_ADMIN', async () => {
           const userId = getEntityId('users', 'projectadmin@gmail.com');

           const res = await request(server)
               .put(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/users/${userId}/role`)
               .set('Authorization', `Bearer ${getToken(projectOwnerEmail)}`)
               .send({ newRole: ProjectRole.PROJECT_ADMIN.toString() });

           expect(res.status).to.equal(200);
       });
   })

    describe('Update Project', () => {
        tenantId = getEntityId('tenants', tenantName);
        projectId = getEntityId('projects', projectName);
        it('should update the project', async () => {
            const res = await request(server)
                .put(`/api/v1/tenants/${tenantId}/projects/${projectId}`)
                .set('Authorization', `Bearer ${getToken(projectOwnerEmail)}`)
                .send({ name: `${projectName} Updated` });

            expect(res.status).to.equal(200);
            projectId = res.body.project.id;
            setEntity('projects', projectName, { id: projectId });
        });
    })


});