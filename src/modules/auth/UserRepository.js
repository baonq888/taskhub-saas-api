import prisma from "../../core/db/index";


class UserRepository {
  static async createUser(email, passwordHash) {
    return await prisma.user.create({
      data: { email, password: passwordHash },
    });
  }

  static async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}

export default UserRepository;