import { expect } from 'chai';
import request from 'supertest';
import server from '../testServer.js';
import { getToken } from './tokenStore.js';
import {
    setEntity,
    getEntityId
} from './testState.js';
import { API_VERSION } from '../testConfig.js';

describe('Comment Endpoints', () => {
    const email = 'projectmember2@gmail.com';
    const tenantName = 'QB Corp';
    const projectName = 'QB Project';
    const boardName = `${projectName} Board`;
    const taskName = 'Initial Task';

    let tenantId, projectId, boardId, taskId;

    before(() => {
        tenantId = getEntityId('tenants', tenantName);
        projectId = getEntityId('projects', projectName);
        boardId = getEntityId('boards', boardName);
        taskId = getEntityId('tasks', taskName);

        if (!tenantId || !projectId || !boardId) {
            throw new Error('Missing tenant, project, or board ID');
        }
    });


    describe('Create Comment', () => {
        const newComment = 'This is a test comment.'

        it('should create a new comment on a task', async () => {
            const res = await request(server)
                .post(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/comments`)
                .set('Authorization', `Bearer ${getToken(email)}`)
                .send({ content: newComment });

            expect(res.status).to.equal(201);

            const commentId = res.body.data.comment.id;
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