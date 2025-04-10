import { expect } from 'chai';
import request from 'supertest';
import server from '../testServer.js';
import { getToken } from './tokenStore.js';
import {
    getEntityId,
    setEntity
} from './testState.js';
import {TaskStatus} from "@prisma/client";

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

    it('should create a new task', async () => {
        const token = getToken(email);
        const taskData = {
            title: taskName,
            description: 'Test task creation',
            deadline: new Date().toISOString()
        };

        const res = await request(server)
            .post(`/api/v1/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks`)
            .set('Authorization', `Bearer ${token}`)
            .send({ data: taskData });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', taskName);

        taskId = res.body.id;
        setEntity('tasks', taskName, { id: taskId });
    });

    it('should get the task by ID', async () => {
        const res = await request(server)
            .get(`/api/v1/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`)
            .set('Authorization', `Bearer ${getToken(email)}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', taskId);
    });

    it('should update the task status by Project Member 1', async () => {
        const statusUpdate = { status: TaskStatus.DONE };

        const res = await request(server)
            .patch(`/api/v1/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/status`)
            .set('Authorization', `Bearer ${getToken(projectMember1Email)}`)
            .send(statusUpdate);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', statusUpdate.status);
    });

    it('should update the task', async () => {
        const updatedTitle = `${taskName} Updated`;

        const res = await request(server)
            .patch(`/api/v1/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`)
            .set('Authorization', `Bearer ${getToken(email)}`)
            .send({ data: { title: updatedTitle } });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('title', updatedTitle);
    });

    it('should get all tasks in the board', async () => {
        const res = await request(server)
            .get(`/api/v1/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks`)
            .set('Authorization', `Bearer ${getToken(email)}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.some(t => t.id === taskId)).to.be.true;
    });

    it('should assign users to the task', async () => {
        const userIds = [
            getEntityId('users', projectMember1Email),
            getEntityId('users', projectMember2Email)
        ];

        const res = await request(server)
            .post(`/api/v1/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/assign`)
            .set('Authorization', `Bearer ${getToken(email)}`)
            .send({ userIds });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Task assigned successfully');
    });

    it('should unassign users from the task', async () => {
        const userIds = [
            getEntityId('users', projectMember1Email)
        ];

        const res = await request(server)
            .post(`/api/v1/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/unassign`)
            .set('Authorization', `Bearer ${getToken(email)}`)
            .send({ userIds });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'User unassigned from task successfully');
    });

    it('should delete the task', async () => {
        const res = await request(server)
            .delete(`/api/v1/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`)
            .set('Authorization', `Bearer ${getToken(email)}`);

        expect(res.status).to.equal(204);
    });
});