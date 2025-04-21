import prisma from '../../infrastructure/db/index.js';

class AttachmentRepository {

    static async createAttachment({ taskId, userId, fileName, filePath, mimeType, size }) {
        return prisma.attachment.create({
            data: {
                taskId,
                userId,
                fileName,
                filePath,
                mimeType,
                size,
            },
        });
    }

    static async findByTaskId(taskId) {
        return prisma.attachment.findMany({
            where: { taskId },
        });
    }

    static async findById(id) {
        return prisma.attachment.findUnique({
            where: { id },
        });
    }

    static async deleteById(id) {
        return prisma.attachment.delete({
            where: { id },
        });
    }
}

export default AttachmentRepository;