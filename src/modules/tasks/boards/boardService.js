import BoardRepository from "./BoardRepository.js";

import ProjectAccessHelper from "../../../core/helpers/ProjectAccessHelper.js";
class BoardService {
  static async createBoard(projectId, userId, data) {
    await ProjectAccessHelper.verifyUserInProject(userId, projectId);
    const boardData = { ...data, projectId };
    return BoardRepository.createBoard(boardData);
  }

  static  async getBoardById(id) {
    return BoardRepository.getBoardById(id);
  }

  static async getBoardByName(projectId, name) {
    return BoardRepository.getBoardByName(projectId, name);
  }

  static async getAllBoards() {
    return BoardRepository.getAllBoards();
  }

  static async updateBoard(boardId, projectId, userId, data) {
    await ProjectAccessHelper.verifyUserInProject(userId, projectId);
    // Proceed with board update
    return BoardRepository.updateBoard(boardId, data);
  }

  static async deleteBoard(boardId) {
    return BoardRepository.deleteBoard(boardId);
  }
}

export default BoardService;