import TaskRepository from "./TaskRepository.js";
import ProjectAccessHelper from "../../../core/helpers/ProjectAccessHelper.js";
import {checkBoardExist, checkTaskExist} from "../../../core/helpers/EntityExistenceHelper.js";
import {TaskStatus} from "@prisma/client";

class TaskService {
  static async createTask(boardId, userId, data) {
    const board = await checkBoardExist(boardId);
    await ProjectAccessHelper.verifyUserInProject(userId, board.projectId);
    const taskData = {...data, boardId}
    return await TaskRepository.createTask(taskData);
  }

  static async assignTask(taskId, assignedUserIds, projectAdminUserId) {
    if (!Array.isArray(assignedUserIds) || assignedUserIds.length === 0) {
      throw new Error("assignedUserIds must be a non-empty array.");
    }
    const task = await checkTaskExist(taskId);
    const board = await checkBoardExist(task.boardId);
    const projectId = board.projectId;
    // Ensure admin belongs to the project and unassigned users are in the same tenant as the admin
    await ProjectAccessHelper.verifyAdminAndUsersInProjectAndTenant(
        projectAdminUserId,
        assignedUserIds,
        projectId
    );
    await TaskRepository.updateTaskStatus(task.id, TaskStatus.IN_PROGRESS)

    return Promise.all(
        assignedUserIds.map(userId =>
            TaskRepository.assignTask(taskId, userId)
        )
    );
  }

  static async unassignTask(taskId, userToUnassignedIds, projectAdminUserId) {
    if (!Array.isArray(userToUnassignedIds) || userToUnassignedIds.length === 0) {
      throw new Error("userIds must be a non-empty array.");
    }
    const task = await checkTaskExist(taskId);
    const board = await checkBoardExist(task.boardId);
    const projectId = board.projectId;
    // Ensure admin belongs to the project and unassigned users are in the same tenant as the admin
    await ProjectAccessHelper.verifyAdminAndUsersInProjectAndTenant(
        projectAdminUserId,
        userToUnassignedIds,
        projectId
    );
    return TaskRepository.unassignTask(taskId, userToUnassignedIds);
  }

  static async getTaskById(taskId) {
    return TaskRepository.getTaskById(taskId);
  }

  static async getAllTasks(boardId) {
    return TaskRepository.getAllTasks(boardId);
  }

  static async updateTask(taskId, data) {
    return TaskRepository.updateTask(taskId, data);
  }

  static async updateTaskStatus(taskId, status) {
    return TaskRepository.updateTaskStatus(taskId, status);
  }

  static async deleteTask(id) {
    return TaskRepository.deleteTask(id);
  }
}

export default TaskService;