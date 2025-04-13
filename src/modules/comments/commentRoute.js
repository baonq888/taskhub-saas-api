import express from "express";
import CommentController from "./commentController.js";
import authMiddleware from "../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../core/middleware/roleMiddleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management for tasks
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: 12345
 *               userId:
 *                 type: string
 *                 example: 67890
 *               content:
 *                 type: string
 *                 example: "This is a comment"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["PROJECT_MEMBER"], ["project"]),
    CommentController.createComment);

/**
 * @swagger
 * task/{taskId}/comments:
 *   get:
 *     summary: Get all comments for a task
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Task not found
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware(["PROJECT_OWNER","PROJECT_ADMIN","PROJECT_MEMBER"], ["project"]),
    CommentController.getCommentsByTask);

export default router;