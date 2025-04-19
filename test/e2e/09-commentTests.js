import { expect } from 'chai';
import request from 'supertest';
import server from '../testServer.js';
import prisma from '../../src/core/db/index.js';
import { getToken } from './tokenStore.js';
import {
    setEntity,
    getEntityId
} from './testState.js';
import { API_VERSION } from '../testConfig.js';

describe('Comment Endpoints', () => {
    const email = 'projectmember1@gmail.com';
    const tenantName = 'QB Corp';
    const projectName = 'QB Project';
    const boardName = `${projectName} Board`;
    const taskName = 'Initial Task';
    const taskId = getEntityId('tasks', taskName);
    const tenantId = getEntityId('tenants', tenantName);
    const projectId = getEntityId('projects', projectName);
    const boardId = getEntityId('boards', boardName);

    before(async () => {
        // Clean up existing comments
        await prisma.comment.deleteMany({});
    });

    describe('Create Comment', () => {
        const newComment = 'This is a test comment.'
        it('should create a new comment on a task', async () => {
            const res = await request(server)
                .post(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/comments`)
                .set('Authorization', `Bearer ${getToken(email)}`)
                .send({ content: newComment });

            expect(res.status).to.equal(201);

            const commentId = res.body.comment.id;
            setEntity('comments', newComment, { id: commentId });
        });
    });

    describe('Get Comments for Task', () => {
        it('should fetch comments for the task', async () => {
            const res = await request(server)
                .get(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/comments`)
                .set('Authorization', `Bearer ${getToken(email)}`);

            expect(res.status).to.equal(200);

        });
    });
});