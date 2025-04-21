import { uploadFile, deleteFile } from '../../infrastructure/storage/storage.js';
import AttachmentRepository from './AttachmentRepository.js';

class AttachmentsService {

    static async uploadAttachment(fileBuffer, data) {
        const { taskId, userId, originalName, mimeType, size } = data;
        const fileName = originalName;
        const filePath = `${userId}/${taskId}/${Date.now()}-${originalName}`;

        const uploadedFile = await uploadFile(fileBuffer, filePath, mimeType);

        return AttachmentRepository.createAttachment({
            taskId,
            userId,
            fileName,
            filePath: uploadedFile.path,
            mimeType,
            size,
        });
    }


    static async getAttachmentsByTask(taskId) {
        return AttachmentRepository.findByTaskId(taskId);
    }

    static async deleteAttachment(id) {
        console.log('Deleting attachment with ID:', id);
        const attachment = await AttachmentRepository.findById(id);
        if (!attachment) {
            throw new Error('Attachment not found');
        }
        await deleteFile(attachment?.filePath);

        return AttachmentRepository.deleteById(id);
    }
}

export default AttachmentsService;