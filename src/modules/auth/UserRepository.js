import prisma from "../../core/db/index.js";

class UserRepository {
  static async createUser(email, passwordHash) {
    return await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.create({
        data: { email, password: passwordHash },
      });

      // Ensure userDetail exists before creating
      const userDetail = await transaction.userDetail.findUnique({
        where: { userId: user.id },
      });

      if (!userDetail) {
        await transaction.userDetail.create({
          data: { userId: user.id },
        });
      }

      return user;
    });
  }

  static async findAllUsers() {
    return await prisma.user.findMany({
      include: { userDetail: true }, // Include related details if needed
    });
  }

  static async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async findUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  static async storeRefreshToken(userId, refreshToken) {
    return await prisma.refreshToken.create({
      data: { userId, token: refreshToken.token, expiresAt: refreshToken.expiresAt},
    });
  }

  static async findRefreshToken(userId, refreshToken) {
    return await prisma.refreshToken.findFirst({
      where: { userId, token: refreshToken },
    });
  }

  static async deleteRefreshToken(userId, refreshToken) {
    return await prisma.refreshToken.deleteMany({
      where: { userId, token: refreshToken },
    });
  }
}

export default UserRepository;