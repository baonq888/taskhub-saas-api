import BoardService from "./boardService.js";

class BoardController {
  async createBoard(req, res) {
    try {
      const { projectId } = req.params;
      const data  = req.body;
      const userId = req.user.id;
      const board = await BoardService.createBoard(projectId, userId, data);
      res.status(201).json({message: "Board created", board});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async getBoardById(req, res) {
    try {
      const { boardId } = req.params;
      const board = await BoardService.getBoardById(boardId);
      res.status(200).json(board);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getAllBoards(req, res) {
    try {
      const boards = await BoardService.getAllBoards();
      res.status(200).json(boards);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateBoard(req, res) {
    try {
      const { projectId, boardId } = req.params;
      const data = req.body;
      const userId = req.user.id;
      const board = await BoardService.updateBoard(boardId, projectId, userId, data);
      res.status(200).json({message: "Board Updated", board});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteBoard(req, res) {
    try {
      await BoardService.deleteBoard(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new BoardController();