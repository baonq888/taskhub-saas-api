import prisma from "../../../core/db/index.js";

class BoardRepository {
  async createBoard(data) {
    return prisma.board.create({ data });
  }

  async getBoardById(id) {
    return prisma.board.findUnique({ where: { id } });
  }

  async getAllBoards() {
    return prisma.board.findMany();
  }

  async updateBoard(id, data) {
    return prisma.board.update({ where: { id }, data });
  }

  async deleteBoard(id) {
    return prisma.board.delete({ where: { id } });
  }
}

export default new BoardRepository();