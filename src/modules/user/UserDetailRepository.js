import prisma from "../../infrastructure/db/index.js";

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

  static async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        userDetail: {
          select: {
            firstName: true,
            lastName: true,
            address: true,
          },
        },
      },
    });
  }

  
}

export default UserRepository;