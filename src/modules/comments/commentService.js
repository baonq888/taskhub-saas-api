import CommentRepository from './CommentRepository.js';
import { checkUserInTask } from '../../core/helpers/EntityExistenceHelper.js';

const commentRepository = new CommentRepository();

class CommentsService {
    static async createComment(userId, taskId, content) {
        // Check if the user is assigned to the task
        const isAssigned = await checkUserInTask(userId, taskId);
        if (!isAssigned) {
            throw new Error('Only task assignees can add comments.');
        }

        // Proceed to create the comment
        return commentRepository.createComment({ taskId, userId, content });
    }

    // Get comments by task
    static async getCommentsByTask(taskId) {
        return commentRepository.getCommentsByTask(taskId);
    }
}

export default CommentsService;