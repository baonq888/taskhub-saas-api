import prisma from "../../../infrastructure/db/index.js";

class TaskRepository {
  static async createTask(data) {
    return prisma.task.create({ data: data });
  }

  static async assignTask(taskId, userId) {
    return prisma.taskAssignee.create({
      data: {
        userId,
        taskId,
      },
    });
  }

  static async getTaskById(id) {
    return prisma.task.findFirst({
      where: { id },
      include: {
        board: {
          select: {
            id: true,
            projectId: true,
            name: true
          }
        }
      }
    });
  }

  static async getTaskByTitle(boardId, title) {
    return prisma.task.findUnique({
      where: {
        boardId_title: { boardId, title },
      }
    });
  }

  static async getAllTasks(boardId) {
    return prisma.task.findMany({
      where: {
        boardId,
      },
    });
  }

  static async updateTask(id, data) {
    return prisma.task.update({ where: { id }, data });
  }

  static async updateTaskStatus(id, status) {
    return prisma.task.update({
      where: {id},
      data: {
        status: status,
      }
    });
  }

  static async unassignTask(taskId, userIds) {
    return prisma.taskAssignee.deleteMany({
      where: {
        taskId,
        userId: { in: userIds }
      }
    });
  }

  static async getTaskAssignees(taskId) {
    return prisma.taskAssignee.findMany({
      where: {
        taskId,
      },

    });
  }

  static async getTaskAssignee(taskId, userId) {
    return prisma.taskAssignee.findFirst({
      where: {
        taskId,
        userId,
      },

    });
  }

  static async deleteTask(id) {
    return prisma.task.delete({ where: { id } });
  }
}

export default TaskRepository;