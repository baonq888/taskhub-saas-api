import prisma from "../../core/db/index.js";

class TenantRepository {
  static async getTenantByName(name) {
    return prisma.tenant.findUnique({
      where: {
        name,
      },
    });
  }
  static async createTenant(name, userId) {
    return prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {name},
      });

      await tx.tenantUser.create({
        data: {
          tenantId: tenant.id,
          userId,
          role: "TENANT_OWNER",
        },
      });

      return tenant;
    });
  }

  static async updateTenantUserRole(tenantId, userId, newRole) {

    // Update the role of the user in the tenant
    return prisma.tenantUser.update({
      where: {
        userId_tenantId: {userId, tenantId},
      },
      data: {
        role: newRole,
      },
    });
  }

  static async findTenantById(id) {
    return prisma.tenant.findUnique({
      where: {id},
      include: {
        users: {include: {user: true}},
      },
    });
  }

  static async inviteUser(tenantId, user, role = "TENANT_MEMBER") {

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
    return prisma.tenantUser.create({
      data: {
        tenantId,
        userId: user.id,
        role,
      },
    });
  }


  static async listTenants() {
    return prisma.tenant.findMany();
  }

  static async getUsersByTenant(tenantId) {
    return prisma.tenantUser.findMany({
      where: { tenantId },
      include: { user: true },
    });
  }

  static async getUserTenants(userId) {
    return prisma.tenantUser.findMany({
      where: { userId },
      include: { tenant: true },
    });
  }

  static async getTenantUser(tenantId, userId) {
    return prisma.tenantUser.findUnique({
      where: {
        userId_tenantId: { userId, tenantId },
      },
    });
  }

  static async isTenantAdmin(userId, tenantId) {
    const tenantUser = await prisma.tenantUser.findFirst({
      where: { userId, tenantId, role: "TENANT_ADMIN" },
    });
    return !!tenantUser; // Returns true if user is a Tenant Admin, else false
  }
}

export default TenantRepository;