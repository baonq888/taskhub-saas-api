import BoardRepository from "./BoardRepository.js";

class BoardService {
  async createProject(data) {
    return BoardRepository.createBoard(data);
  }

  async getBoardById(id) {
    return BoardRepository.getBoardById(id);
  }

  async getAllBoards() {
    return BoardRepository.getAllBoards();
  }

  async updateBoard(id, data) {
    return BoardRepository.updateBoard(id, data);
  }

  async deleteBoard(id) {
    return BoardRepository.deleteBoard(id);
  }
}

export default new BoardService();