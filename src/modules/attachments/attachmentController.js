import AttachmentsService from './attachmentService.js';
import { successResponse, errorResponse } from '../../core/response/repsonse.js';

class AttachmentsController {
    static async uploadAttachment(req, res) {
        try {
            const { taskId } = req.body;
            const userId = req.user.id;
            const { originalname, mimetype, size, buffer } = req.file;

            const data = {
                taskId,
                userId,
                originalName: originalname,
                mimeType: mimetype,
                size,
            }

            const attachment = await AttachmentsService.uploadAttachment(buffer, data);

            return successResponse(res, 201, 'Attachment uploaded successfully', attachment);
        } catch (error) {
            console.error('Upload failed:', error.message);
            return errorResponse(res, 500, 'Failed to upload attachment', error.message);
        }
    }


    static async getAttachmentsByTask(req, res) {
        try {
            const { taskId } = req.params;
            const attachments = await AttachmentsService.getAttachmentsByTask(taskId);
            return successResponse(res, 200, 'Attachments fetched successfully', attachments);
        } catch (error) {
            return errorResponse(res, 500, 'Failed to fetch attachments', error.message);
        }
    }

    static async deleteAttachment(req, res) {
        try {
            const { attachmentId } = req.params;
            await AttachmentsService.deleteAttachment(attachmentId);
            return successResponse(res, 204, 'Attachment deleted successfully');
        } catch (error) {
            console.error('Upload failed:', error.message);
            return errorResponse(res, 500, 'Failed to delete attachment', error.message);
        }
    }
}

export default AttachmentsController;