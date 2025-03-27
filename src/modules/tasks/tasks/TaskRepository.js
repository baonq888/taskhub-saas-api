import prisma from "../../../core/db/index.js";

class TaskRepository {
  static async createTask(data) {
    return prisma.task.create({ data });
  }

  static async assignTask(taskId, userId) {
    return prisma.task.update({
      where: { id: taskId },
      data: { assignedTo: userId },
    });
  }

  static async getTaskById(id) {
    return prisma.task.findUnique({ where: { id } });
  }

  static async getAllTasks() {
    return prisma.task.findMany();
  }

  static async updateTask(id, data) {
    return prisma.task.update({ where: { id }, data });
  }

  static async deleteTask(id) {
    return prisma.task.delete({ where: { id } });
  }

  

}

export default TaskRepository;