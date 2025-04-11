import prisma from "../../core/db/index.js";
import {TenantRole} from "@prisma/client";

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
          userId,
          tenantId: tenant.id,
          role: TenantRole.TENANT_OWNER,
        },
      });

      return tenant;
    });
  }

  static async updateTenantUserRole(tenantId, userId, newRole) {

    return prisma.tenantUser.update({
      where: {
        userId_tenantId: {userId, tenantId},
      },
      data: {
        role: newRole,
      },
    });


  }

  static async getTenantById(id) {
    return prisma.tenant.findUnique({
      where: {id},

    });
  }

  static async inviteUser(tenantId, user) {
  
    // Add the user to the tenant
    return prisma.tenantUser.create({
      data: {
        tenantId,
        userId: user.id,
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
      where: { userId, tenantId, role: TenantRole.TENANT_ADMIN },
    });
    return !!tenantUser; // Returns true if user is a Tenant Admin, else false
  }
}

export default TenantRepository;