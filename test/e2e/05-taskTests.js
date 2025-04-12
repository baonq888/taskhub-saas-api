import { expect } from 'chai';
import request from 'supertest';
import server from '../testServer.js';
import { getToken } from './tokenStore.js';
import {
    getEntityId,
    setEntity
} from './testState.js';
import {TaskStatus} from "@prisma/client";
import {API_VERSION} from "../testConfig.js";

describe('Task Endpoints', () => {
    const email = 'projectadmin@gmail.com';
    const tenantName = 'QB Corp';
    const projectName = 'QB Project';
    const boardName = `${projectName} Board`;
    const taskName = 'Initial Task';
    const projectMember1Email = 'projectmember1@gmail.com';
    const projectMember2Email = 'projectmember2@gmail.com';

    let tenantId, projectId, boardId, taskId;

    before(() => {
        tenantId = getEntityId('tenants', tenantName);
        projectId = getEntityId('projects', projectName);
        boardId = getEntityId('boards', boardName);

        if (!tenantId || !projectId || !boardId) {
            throw new Error('Missing tenant, project, or board ID');
        }
    });

    describe('Create Task', () => {
        it('should create a new task', async () => {
            const token = getToken(email);
            const taskData = {
                title: taskName,
                description: 'Test task creation',
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Adds 2 days
            };

            const res = await request(server)
                .post(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks`)
                .set('Authorization', `Bearer ${token}`)
                .send({ data: taskData });

            expect(res.status).to.equal(201);

            taskId = res.body.task.id;
            setEntity('tasks', taskName, { id: taskId });
        });
    })

    describe('Get Task by ID', () => {
        it('should get the task by ID', async () => {
            const res = await request(server)
                .get(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`)
                .set('Authorization', `Bearer ${getToken(email)}`);

            expect(res.status).to.equal(200);
        });
    })

    describe('Update Task status', () => {
        it('should update the task status by Project Member 1', async () => {
            const statusUpdate = { status: TaskStatus.DONE };

            const res = await request(server)
                .put(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/status`)
                .set('Authorization', `Bearer ${getToken(projectMember1Email)}`)
                .send(statusUpdate);

            expect(res.status).to.equal(200);
        });
    })

    describe('Update Task data', () => {
        it('should update the task', async () => {
            const updatedTitle = `${taskName} Updated`;

            const res = await request(server)
                .put(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`)
                .set('Authorization', `Bearer ${getToken(email)}`)
                .send({ data: { title: updatedTitle } });

            expect(res.status).to.equal(200);
        });
    })

    describe('Get all tasks in the board', () => {
        it('should get all tasks in the board', async () => {
            const res = await request(server)
                .get(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks`)
                .set('Authorization', `Bearer ${getToken(email)}`);

            expect(res.status).to.equal(200);

        });
    })

   describe('Assign users to the task', () => {
       it('should assign users to the task', async () => {
           const userIds = [
               getEntityId('users', projectMember1Email),
               getEntityId('users', projectMember2Email)
           ];

           const res = await request(server)
               .post(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/assign`)
               .set('Authorization', `Bearer ${getToken(email)}`)
               .send({ userIds });

           expect(res.status).to.equal(200);
       });

   })

    describe('Unassign users to the task', () => {
        it('should unassign users from the task', async () => {
            const userIds = [
                getEntityId('users', projectMember1Email)
            ];

            const res = await request(server)
                .delete(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/unassign`)
                .set('Authorization', `Bearer ${getToken(email)}`)
                .send({ userIds });

            expect(res.status).to.equal(200);
        });
    })



});