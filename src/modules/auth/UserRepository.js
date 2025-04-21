import prisma from "../../infrastructure/db/index.js";

class UserRepository {
  static async createUser(email, passwordHash) {
    return prisma.$transaction(async (transaction) => {
      return transaction.user.create({
        data: {email, password: passwordHash},
      });
    });
  }

  static async findAllUsers() {
    return prisma.user.findMany({
      include: { userDetail: true }, // Include related details if needed
    });
  }

  static async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findUserById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async storeRefreshToken(userId, refreshToken) {
    return prisma.refreshToken.create({
      data: { userId, token: refreshToken.token, expiresAt: refreshToken.expiresAt},
    });
  }

  static async findRefreshToken(userId, refreshToken) {
    return prisma.refreshToken.findFirst({
      where: { userId, token: refreshToken },
    });
  }

  static async deleteRefreshToken(userId, refreshToken) {
    return prisma.refreshToken.deleteMany({
      where: { userId, token: refreshToken },
    });
  }
}

export default UserRepository;