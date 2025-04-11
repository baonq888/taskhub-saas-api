// import { expect } from 'chai';
// import request from 'supertest';
// import server from '../testServer.js';
// import { getToken } from './tokenStore.js';
// import {
//     getEntityId,
//     setEntity
// } from './testState.js';
// import {API_VERSION} from "../testConfig.js";
//
// describe('Board Endpoints', () => {
//     const email = 'projectadmin@gmail.com';
//     const tenantName ='QB Corp';
//     const projectName = 'QB Project';
//     const boardName = `${projectName} Board`;
//     let tenantId, projectId, boardId;
//
//     before(async () => {
//         const token = getToken(email);
//         tenantId = getEntityId('tenants', tenantName);
//         projectId = getEntityId('projects', projectName);
//
//         if (!projectId) {
//             throw new Error('Missing tenantId. Make sure tenant test runs first and sets it.');
//         }
//
//         // Create project if not already exists
//         boardId = getEntityId('boards', boardName);
//         if (!boardId) {
//             const boardRes = await request(server)
//                 .post(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards`)
//                 .set('Authorization', `Bearer ${token}`)
//                 .send({ name: boardName });
//
//             expect(boardRes.status).to.equal(201);
//             boardId = boardRes.body.id;
//             setEntity('boards', boardName, { id: boardId });
//         }
//     });
//
//     it('should fetch the board by ID', async () => {
//         const res = await request(server)
//             .get(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}`)
//             .set('Authorization', `Bearer ${getToken(email)}`);
//
//         expect(res.status).to.equal(200);
//         expect(res.body).to.have.property('id', boardId);
//         expect(res.body).to.have.property('name', boardName);
//     });
//
//     it('should update the board', async () => {
//         const res = await request(server)
//             .patch(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}`)
//             .set('Authorization', `Bearer ${getToken(email)}`)
//             .send({ name: `${boardName} Updated` });
//
//         expect(res.status).to.equal(200);
//         expect(res.body).to.have.property('name', `${boardName} Updated`);
//     });
//
//     it('should get all boards in the project', async () => {
//         const res = await request(server)
//             .get(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards`)
//             .set('Authorization', `Bearer ${getToken(email)}`);
//
//         expect(res.status).to.equal(200);
//         expect(res.body).to.be.an('array');
//     });
//
//
// });