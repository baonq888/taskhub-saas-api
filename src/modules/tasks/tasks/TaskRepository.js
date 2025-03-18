import prisma from "../../../core/db/index.js";

class TaskRepository {
  async createTask(data) {
    return prisma.task.create({ data });
  }

  async assignTask(taskId, userId) {
    return prisma.task.update({
      where: { id: taskId },
      data: { assignedTo: userId },
    });
  }

  async getTaskById(id) {
    return prisma.task.findUnique({ where: { id } });
  }

  async getAllTasks() {
    return prisma.task.findMany();
  }

  async updateTask(id, data) {
    return prisma.task.update({ where: { id }, data });
  }

  async deleteTask(id) {
    return prisma.task.delete({ where: { id } });
  }

}

export default new TaskRepository();