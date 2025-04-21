// import { expect } from 'chai';
// import request from 'supertest';
// import server from '../testServer.js';
// import prisma from '../../src/core/db/index.js';
// import { getToken } from './tokenStore.js';
// import { setEntity, getEntityId } from './testState.js';
// import { API_VERSION } from '../testConfig.js';
// import {ACTIONS, CONDITIONS, STRATEGIES, TRIGGERS} from "../../src/core/config/automation/automationConstants.js";
//
// describe('Automation Endpoints', () => {
//     const email = 'projectadmin@gmail.com';
//     const tenantName = 'QB Corp';
//     const projectName = 'QB Project';
//     const boardName = `${projectName} Board`;
//     const taskName = 'Automation Task';
//
//     const tenantId = getEntityId('tenants', tenantName);
//     const projectId = getEntityId('projects', projectName);
//     const boardId = getEntityId('boards', boardName);
//
//     let createdTaskId;
//
//     before(async () => {
//         // Cleanup existing automation rules
//         await prisma.automationRule.deleteMany({ where: { projectId } });
//
//         // Create automation rule via API (project-level)
//         const rulePayload = {
//             trigger: TRIGGERS.TASK_CREATED,
//             conditions: [
//                 {
//                     condition: CONDITIONS.BOARD_NAME_EQUALS,
//                     value: boardName
//                 }
//             ],
//             action: ACTIONS.ASSIGN_USER,
//             actionPayload: {
//                 strategy: STRATEGIES.ASSIGN_EVENLY
//             },
//             enabled: true
//         };
//
//         const ruleRes = await request(server)
//             .post(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/automations`)
//             .set('Authorization', `Bearer ${getToken(email)}`)
//             .send(rulePayload);
//
//         expect(ruleRes.status).to.equal(201);
//     });
//
//     describe('Trigger Automation by Creating Task', () => {
//         it('should trigger automation when a task is created', async () => {
//             const res = await request(server)
//                 .post(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks`)
//                 .set('Authorization', `Bearer ${getToken(email)}`)
//                 .send({
//                     title: taskName,
//                     description: 'Triggered automation test'
//                 });
//
//             expect(res.status).to.equal(201);
//
//             createdTaskId = res.body.task.id;
//             setEntity('tasks', taskName, { id: createdTaskId });
//         });
//
//         it('should assign the task as per automation rule', async () => {
//             const updatedTask = await prisma.task.findUnique({
//                 where: { id: createdTaskId },
//                 include: {
//                     TaskAssignee: {
//                         include: {
//                             user: true
//                         }
//                     }
//                 }
//             });
//
//             expect(updatedTask).to.not.be.null;
//             expect(updatedTask.TaskAssignee.length).to.be.greaterThan(0);
//         });
//     });
// });