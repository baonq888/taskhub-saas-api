import { expect } from 'chai';
import request from 'supertest';
import path from 'path';
import server from '../testServer.js';
import { getToken } from './tokenStore.js';
import { API_VERSION } from '../testConfig.js';
import { setEntity, getEntityId } from './testState.js';
import prisma from '../../src/infrastructure/db/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Attachment Endpoints', () => {
    const email = 'projectadmin@gmail.com';
    const tenantName = 'QB Corp';
    const projectName = 'QB Project';
    const boardName = `${projectName} Board`;
    const taskName = 'Initial Task';
    const fileName = 'image.jpg';
    let tenantId, projectId, boardId, taskId;

    before(async () => {
        taskId = getEntityId('tasks', taskName);
        tenantId = getEntityId('tenants', tenantName);
        projectId = getEntityId('projects', projectName);
        boardId = getEntityId('boards', boardName);

        if (!tenantId || !projectId || !boardId || !taskId) {
            throw new Error('Missing tenant, project, board ID, or task ID');
        }

        await prisma.attachment.deleteMany({});

    });

    describe('Upload Attachment', () => {
        it('should upload a file for a task', async () => {
            const testFilePath = path.join(__dirname, '..', 'files', fileName);
            console.log("testFilePath", testFilePath);
            const res = await request(server)
                .post(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/attachments`)
                .set('Authorization', `Bearer ${getToken(email)}`)
                .field('taskId', taskId)
                .attach('file', testFilePath);

            expect(res.status).to.equal(201)
            setEntity('attachments', 'Sample File', { id: res.body.id });
        });
    });

    describe('Get Attachments for Task', () => {
        it('should retrieve all attachments for the task', async () => {
            const res = await request(server)
                .get(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/attachments`)
                .set('Authorization', `Bearer ${getToken(email)}`);

            expect(res.status).to.equal(200);

        });
    });

    describe('Download Attachment', () => {
        it('should download an uploaded attachment', async () => {
            const attachmentId = getEntityId('attachments', 'Sample File').id;

            const res = await request(server)
                .get(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/attachments/${attachmentId}/download`)
                .set('Authorization', `Bearer ${getToken(email)}`)
                .buffer()
                .parse((res, callback) => {
                    res.setEncoding('binary');
                    res.data = '';
                    res.on('data', chunk => res.data += chunk);
                    res.on('end', () => callback(null, Buffer.from(res.data, 'binary')));
                });

            expect(res.status).to.equal(200);

        });
    });

    describe('Delete Attachment', () => {
        it('should delete an attachment by ID', async () => {
            const attachmentId = getEntityId('attachments', 'Sample File').id;
            const res = await request(server)
                .delete(`${API_VERSION}/tenants/${tenantId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/attachments/${attachmentId}`)
                .set('Authorization', `Bearer ${getToken(email)}`);
            expect(res.status).to.equal(204);
        });
    });
});