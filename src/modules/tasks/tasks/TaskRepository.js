import prisma from "../../../core/db/index.js";

class TaskRepository {
  static async createTask(data) {
    return prisma.task.create({ data });
  }

  static async assignTask(taskId, userId) {
    return prisma.taskAssignee.create({
      data: {
        taskId,
        userId,
      },
    });
  }

  static async getTaskById(id) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        assignees: { include: { user: true } }, // Include assigned users
      },
    });
  }

  static async getAllTasks() {
    return prisma.task.findMany({
      include: {
        assignees: { include: { user: true } }, // Include assigned users
      },
    });
  }

  static async updateTask(id, data) {
    return prisma.task.update({ where: { id }, data });
  }

  static async unassignTask(taskId, userId) {
    return prisma.taskAssignee.delete({
      where: {
        userId_taskId: { userId, taskId }, // Composite key
      },
    });
  }

  static async deleteTask(id) {
    return prisma.task.delete({ where: { id } });
  }
}

export default TaskRepository;