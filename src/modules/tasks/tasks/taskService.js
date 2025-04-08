import TaskRepository from "./TaskRepository.js";
import BoardRepository from "../boards/BoardRepository.js";
import ProjectAccessHelper from "../../../core/helpers/ProjectAccessHelper.js";

class TaskService {
  static async createTask(userId, data) {
    const board = await BoardRepository.getBoardById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    await ProjectAccessHelper.verifyUserInProject(userId, board.projectId);


    const existingTask = await TaskRepository.getTaskByTitle(data.boardId, data.title);

    if (existingTask) {
      throw new Error("A task with this title already exists in the project");
    }
    return TaskRepository.createTask(data);
  }

  static async assignTask(taskId, assignedUserIds, projectAdminUserId) {
    if (!Array.isArray(assignedUserIds) || assignedUserIds.length === 0) {
      throw new Error("assignedUserIds must be a non-empty array.");
    }

    const task = await TaskRepository.getTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const board = await BoardRepository.getBoardById(task.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const projectId = board.projectId;

    // Ensure admin belongs to the project
    await ProjectAccessHelper.verifyUserInProject(projectAdminUserId, projectId);

    // Ensure assigned users are in the same tenant as the admin
    await Promise.all(
        assignedUserIds.map(userId =>
            ProjectAccessHelper.verifyUsersInSameTenant(projectAdminUserId, userId)
        )
    );

    // Ensure assigned users are in the same project
    await Promise.all(
        assignedUserIds.map(userId =>
            ProjectAccessHelper.verifyUserInProject(userId, projectId)
        )
    );

    return Promise.all(
        assignedUserIds.map(userId =>
            TaskRepository.assignTask(taskId, userId)
        )
    );
  }

  static async unassignTask(taskId, userIds) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new Error("userIds must be a non-empty array.");
    }

    return Promise.all(
      userIds.map(userId => TaskRepository.unassignTask(taskId, userId))
    );
  }
  static async getTaskById(taskId) {
    return TaskRepository.getTaskById(taskId);
  }

  static async getAllTasks(boardId) {
    console.log(boardId)
    return TaskRepository.getAllTasks();
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