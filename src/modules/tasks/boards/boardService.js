import BoardRepository from "./BoardRepository.js";

class BoardService {
  static async createProject(data) {
    return BoardRepository.createBoard(data);
  }

  static  async getBoardById(id) {
    return BoardRepository.getBoardById(id);
  }

  static async getAllBoards() {
    return BoardRepository.getAllBoards();
  }

  static async updateBoard(id, data) {
    return BoardRepository.updateBoard(id, data);
  }

  static async deleteBoard(id) {
    return BoardRepository.deleteBoard(id);
  }
}

export default BoardService;