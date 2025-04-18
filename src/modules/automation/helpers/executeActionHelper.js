import {ACTIONS, STRATEGIES} from "../../../core/config/automation/automationConstants.js";
import TaskService from '../../tasks/tasks/taskService.js';
import NotificationService from '../../notifications/notificationService.js';
import ProjectService from "../../tasks/projects/projectService.js";
import BoardService from "../../tasks/boards/boardService.js";
import NotificationRepository from "../../notifications/NotificationRepository.js";
import {ProjectRole} from "@prisma/client";
import {validateActionPayload} from "./validateActionPayload.js";
const notificationService = new NotificationService(NotificationRepository);

export const executeAssignUser = async (task, ruleActionPayload, user) => {
    validateActionPayload(ACTIONS.ASSIGN_USER, ruleActionPayload);

    const { strategy, userId } = ruleActionPayload;
    switch (strategy) {
        case STRATEGIES.ASSIGN_SPECIFIC_USER:
            if (userId) {
                await TaskService.assignTask(task.id, [userId], user.id);
            }
            break;

        case STRATEGIES.ASSIGN_EVENLY:
            const candidates = await ProjectService.getProjectUsersByRole(task.projectId, ProjectRole.PROJECT_MEMBER);
            if (candidates && candidates.length > 0) {
                const index = Math.floor(Math.random() * candidates.length);
                const selectedUser = candidates[index];
                await TaskService.assignTask(task.id, [selectedUser?.id], user.id);
            }
            break;

        default:
            console.warn("Unknown assign strategy:", strategy);
    }
};

export const executeNotifyUser = async (task, ruleActionPayload) => {
    validateActionPayload(ACTIONS.NOTIFY_USER, ruleActionPayload);

    const { message, recipients } = ruleActionPayload;
    if (Array.isArray(recipients)) {
        for (const recipientId of recipients) {
            await notificationService.sendNotification(recipientId, {
                message,
                taskId: task.id,
                projectId: task.projectId,
            });
        }
    }
};

export const executeMoveToBoard = async (task, ruleActionPayload) => {
    validateActionPayload(ACTIONS.MOVE_TO_BOARD, ruleActionPayload);
    const { boardId, boardName } = ruleActionPayload;
    let targetBoardId = boardId;

    if (!targetBoardId && boardName) {
        const board = await BoardService.getBoardByName(task.projectId, boardName);
        targetBoardId = board?.id;
    }

    if (targetBoardId) {
        await TaskService.updateTask(task.id, { boardId: targetBoardId });
    }
};