import prisma from "../../../infrastructure/db/index.js";

class BoardRepository {
  static async createBoard(data) {
    return prisma.board.create({ data });
  }

  static async getBoardById(id) {
    return prisma.board.findUnique({
      where: { id } ,
      select: { projectId: true },
    });
  }

  static async getBoardByName(projectId, name) {
    return prisma.board.findFirst({
      where: {
        projectId,
        name,
      },
    });
  }


  static async getAllBoards() {
    return prisma.board.findMany();
  }

  static async updateBoard(id, data) {
    return prisma.board.update({ where: { id }, data });
  }

  static async deleteBoard(id) {
    return prisma.board.delete({ where: { id } });
  }
}

export default BoardRepository;