import {downloadFile, uploadFile} from '../../infrastructure/storage/storage.js';
import AttachmentRepository from './AttachmentRepository.js';

class AttachmentsService {

    static async uploadAttachment(fileBuffer, data) {
        const { taskId, userId, originalName, mimeType, size } = data;

        const filePath = `${userId}/${taskId}/${Date.now()}-${originalName}`;

        const uploadedFile = await uploadFile(fileBuffer, filePath, mimeType);

        return AttachmentRepository.createAttachment({
            taskId,
            userId,
            fileName: originalName,
            filePath: uploadedFile.path,
            mimeType,
            size,
        });
    }

    static async downloadAttachment(attachmentId) {
        const attachment = await AttachmentRepository.findById(attachmentId);

        if (!attachment) {
            throw new Error('Attachment not found');
        }
        const { filePath } = attachment;
        // Download the file from storage
        return await downloadFile(filePath);
    }

    static async getAttachmentsByTask(taskId) {
        return AttachmentRepository.findByTaskId(taskId);
    }

    static async deleteAttachment(id) {
        return AttachmentRepository.deleteById(id);
    }
}

export default AttachmentsService;