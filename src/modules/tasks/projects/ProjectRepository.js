import prisma from "../../../core/db/index.js";

class ProjectRepository {
  static async createProject(data) {
    return prisma.project.create({ data });
  }

  static async getProjectById(projectId) {
    return prisma.project.findUnique({
      where: { id: projectId },
      select: { tenantId: true },
    });
  }

  static async getProjectByName(tenantId, name) {
    return prisma.project.findUnique({
      where: {
        tenantId_name: { tenantId, name }
      },
    });
  }

  static async getAllProjects(tenantId) {
    return prisma.project.findMany({
      where: { tenantId },
    });
  }

  static async updateProject(projectId, data) {
    return prisma.project.update({
      where: { id: projectId },
      data,
    });
  }


  static async deleteProject(projectId) {
    return prisma.project.delete({
      where: { id: projectId },
    });
  }

  static async inviteUserToProject(projectId, userId) {
    return prisma.projectUser.create({
      data: {
        projectId,
        userId,
      },
    });
  }

  static async updateProjectUserRole(projectId, userId, newRole) {
    return prisma.projectUser.update({
      where: {
        userId_projectId: { userId, projectId },
      },
      data: {
        role: newRole,
      },
    });
  }

  static async getProjectUser(projectId, userId) {
    return prisma.projectUser.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
    });
  }

  static async getProjectUsersByRole(projectId, role) {
    return prisma.projectUser.findMany({
      where: {
        projectId,
        role
      }
    });
  }

}

export default ProjectRepository;