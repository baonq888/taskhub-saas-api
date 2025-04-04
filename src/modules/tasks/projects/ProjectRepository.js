import prisma from "../../../core/db/index.js";

class ProjectRepository {
  static async createProject(data) {
    return prisma.project.create({ data });
  }

  static async getProjectById(tenantId, projectId) {
    return prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tenant: {
          where: { id: tenantId },
        },
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

  static async inviteUserToProject(projectId, userId, role = "USER") {
    return prisma.projectUser.create({
      data: {
        projectId,
        userId,
        role,
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
}

export default ProjectRepository;