import prisma from "../../core/db/index.js";

class TenantRepository {
  static async createTenant(name, userId) {
    return await prisma.tenant.create({
      data: {
        name,
        users: {
          create: {
            userId,
            role: "TENANT_ADMIN",
          },
        },
      },
      include: {
        users: { include: { user: true } }, 
      },
    });
  }

  static async findTenantById(id) {
    return await prisma.tenant.findUnique({
      where: { id },
      include: {
        users: { include: { user: true } }, 
      },
    });
  }

  static async inviteUser(tenantId, email, role = "USER") {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
  
    // Check if the user is already in the tenant
    const existingTenantUser = await prisma.tenantUser.findUnique({
      where: {
        userId_tenantId: { userId: user.id, tenantId }, // Composite primary key
      },
    });
  
    if (existingTenantUser) {
      throw new Error("User is already a member of this tenant");
    }
  
    // Add the user to the tenant
    return await prisma.tenantUser.create({
      data: {
        tenantId,
        userId: user.id,
        role,
      },
    });
  }

  static async listTenants() {
    return await prisma.tenant.findMany({
      include: {
        users: { include: { user: true } },
      },
    });
  }

  async getUsersByTenant(tenantId) {
    return prisma.tenantUser.findMany({
      where: { tenantId },
      include: { user: true },
    });
  }

  async getUserTenants(userId) {
    return prisma.tenantUser.findMany({
      where: { userId },
      include: { tenant: true },
    });
  }

  async isTenantAdmin(userId, tenantId) {
    const tenantUser = await prisma.tenantUser.findFirst({
      where: { userId, tenantId, role: "TENANT_ADMIN" },
    });
    return !!tenantUser; // Returns true if user is a Tenant Admin, else false
  }
}

export default TenantRepository;