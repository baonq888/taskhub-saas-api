import express from "express";
import BoardController from "./boardController.js";

const router = express.Router();

router.post("/", BoardController.createBoard);
router.get("/:id", BoardController.getBoardById);
router.get("/", BoardController.getAllBoards);
router.put("/:id", BoardController.updateBoard);
router.delete("/:id", BoardController.deleteBoard);

export default router;