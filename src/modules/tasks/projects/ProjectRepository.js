import prisma from "../../../core/db/index.js";

class ProjectRepository {
  async createProject(data) {
    return prisma.project.create({ data });
  }

  async getProjectById(id) {
    return prisma.project.findUnique({ where: { id } });
  }

  async getAllProjects() {
    return prisma.project.findMany();
  }

  async updateProject(id, data) {
    return prisma.project.update({ where: { id }, data });
  }

  async deleteProject(id) {
    return prisma.project.delete({ where: { id } });
  }
}

export default new ProjectRepository();