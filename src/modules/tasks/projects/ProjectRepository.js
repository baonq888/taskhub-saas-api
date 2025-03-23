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
  static async inviteUserToProject(projectId, userId) {
    // Find project
    const project = await this.getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // Check if user is already in the tenant
    const tenantUser = await prisma.tenantUser.findUnique({
      where: { userId_tenantId: { userId, tenantId: project.tenantId } },
    });

    if (!tenantUser) {
      // Add user to the tenant
      await prisma.tenantUser.create({
        data: {
          userId,
          tenantId: project.tenantId,
          role: "USER", // Default role
        },
      });
    }

    return { message: "User invited to project successfully" };
  }
}

export default ProjectRepository;