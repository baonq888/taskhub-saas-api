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
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

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
}

export default TenantRepository;