import prisma from "../../core/db/index.js";

class UserRepository {
  static async getUserWithDetails(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        userDetail: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            address: true,
          },
        },
      },
    });
  }

  static async getUsersByRole(role) {
    return await prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        createdAt: true,
        userDetail: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            address: true,
          },
        },
      },
    });
  }
}

export default UserRepository;