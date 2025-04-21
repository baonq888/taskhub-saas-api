import express from "express";
import AttachmentController from "./AttachmentController.js";
import authMiddleware from "../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../core/middleware/roleMiddleware.js";
import multer from "multer";
const router = express.Router({ mergeParams: true });

const storage = multer.memoryStorage();
const upload = multer({ storage });


/**
 * @swagger
 * tags:
 *   name: Attachments
 *   description: Attachment management for tasks
 */

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks/{taskId}/attachments:
 *   post:
 *     summary: Upload a new attachment to a task
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: "12345"
 *               file:
 *                 type: string
 *                 format: binary
 *               originalFileName:
 *                 type: string
 *                 example: "attachment.png"
 *               mimetype:
 *                 type: string
 *                 example: "image/png"
 *               size:
 *                 type: integer
 *                 example: 1024
 *     responses:
 *       201:
 *         description: Attachment uploaded successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["PROJECT_OWNER", "PROJECT_ADMIN", "PROJECT_MEMBER"], ["project"]),
    upload.single("file"),
    AttachmentController.uploadAttachment
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks/{taskId}/attachments:
 *   get:
 *     summary: Get all attachments for a task
 *     tags: [Attachments]
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
 *         description: List of attachments
 *       404:
 *         description: Task not found
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware(["PROJECT_OWNER", "PROJECT_ADMIN", "PROJECT_MEMBER"], ["project"]),
    AttachmentController.getAttachmentsByTask
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks/{taskId}/attachments/{attachmentId}:
 *   delete:
 *     summary: Delete an attachment by its ID
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attachment ID
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *       404:
 *         description: Attachment not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
    "/:attachmentId",
    authMiddleware,
    roleMiddleware(["PROJECT_OWNER", "PROJECT_ADMIN"], ["project"]),
    AttachmentController.deleteAttachment
);


export default router;