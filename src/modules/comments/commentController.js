import CommentService from './CommentService.js';
import { successResponse, errorResponse } from '../../core/response/repsonse.js';

class CommentController {

    static async createComment(req, res) {
        try {
            const { taskId } = req.params;
            const userId = req.user.id;
            const { content } = req.body;
            const comment = await CommentService.createComment(userId, taskId, content);

            return successResponse(res, 201, 'Comment created successfully', {comment});

        } catch (error) {
            console.error('Error creating comment:', error);
            return errorResponse(res, 500, 'An error occurred while creating the comment', error.message);
        }
    }

    static async getCommentsByTask(req, res) {
        try {
            const { taskId } = req.params;
            const comments = await CommentService.getCommentsByTask(taskId);

            return successResponse(res, 200, 'Comments retrieved successfully', {comments});

        } catch (error) {
            console.error('Error fetching comments:', error);
            return errorResponse(res, 500, 'An error occurred while fetching the comments', error.message);
        }
    }
}

export default CommentController;