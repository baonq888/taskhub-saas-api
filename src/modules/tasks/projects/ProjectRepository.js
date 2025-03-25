import prisma from "../../../core/db/index.js";

class ProjectRepository {
  static async createProject(data) {
    return prisma.project.create({ data });
  }

  static async getProjectById(id) {
    return prisma.project.findUnique({ where: { id } });
  }

  static async getAllProjects() {
    return prisma.project.findMany();
  }

  static async updateProject(id, data) {
    return prisma.project.update({ where: { id }, data });
  }

  static async deleteProject(id) {
    return prisma.project.delete({ where: { id } });
  }

  static async inviteUserToProject(projectId, userId, role = "USER") {
    return prisma.projectUser.create({
      data: {
        projectId,
        userId,
        role,
      },
  })}

  static async promoteUserToProjectAdmin(projectId, userId) {
    
    // Update the user's role in the project
    await prisma.projectUser.update({
      where: {
        userId_projectId: { userId, projectId },
      },
      data: {
        role: "PROJECT_ADMIN",
      },
    }); 
      
  }

  static async updateProjectUserRole(projectId, userId, newRole) {
    return await prisma.projectUser.update({
      where: {
        userId_projectId: { userId, projectId },
      },
      data: {
        role: newRole,
      },
    });
  }

  static async getProjectUser(projectId, userId) {
    await prisma.projectUser.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
    });
  }
    
}

export default ProjectRepository;