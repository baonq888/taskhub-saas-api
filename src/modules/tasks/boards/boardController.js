import BoardService from "./boardService.js";

class BoardController {
  async createBoard(req, res) {
    try {
      const Board = await BoardService.createBoard(req.body);
      res.status(201).json(Board);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBoardById(req, res) {
    try {
      const board = await BoardService.getBoardById(req.params.id);
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
      const board = await BoardService.updateBoard(req.params.id, req.body);
      res.status(200).json(board);
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