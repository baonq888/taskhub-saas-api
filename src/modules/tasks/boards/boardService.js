import BoardRepository from "./BoardRepository.js";

import ProjectAccessHelper from "../../../core/helpers/ProjectAccessHelper.js";
class BoardService {
  static async createBoard(userId, data) {
    const { projectId } = data;
    await ProjectAccessHelper.verifyUserInProject(userId, projectId);
    return BoardRepository.createBoard(data);
  }

  static  async getBoardById(id) {
    return BoardRepository.getBoardById(id);
  }

  static async getAllBoards() {
    return BoardRepository.getAllBoards();
  }

  static async updateBoard(id, userId, data) {
    const { projectId } = data;
    await ProjectAccessHelper.verifyUserInProject(userId, projectId);
    // Proceed with board update
    return BoardRepository.updateBoard(id, data);
  }

  static async deleteBoard(id) {
    return BoardRepository.deleteBoard(id);
  }
}

export default BoardService;