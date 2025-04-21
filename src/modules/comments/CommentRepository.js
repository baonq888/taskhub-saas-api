import prisma from '../../infrastructure/db/index.js';

class CommentRepository {
    async createComment({ taskId, userId, content }) {
        return prisma.comment.create({
            data: {
                taskId,
                userId,
                content,
            },
            include: {
                user: true, // optional, include user info
            },
        });
    }

    async getCommentsByTask(taskId) {
        return prisma.comment.findMany({
            where: { taskId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: true,
            },
        });
    }

    async isUserAssignedToTask(userId, taskId) {
        return prisma.taskAssignee.findUnique({
            where: {
                userId_taskId: { userId, taskId },
            },
        });
    }
}

export default CommentRepository;