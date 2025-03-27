import express from "express";
import BoardController from "./boardController.js";
import authMiddleware from "../../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../../core/middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"),
  BoardController.createBoard
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["PROJECT_MEMBER", "PROJECT_ADMIN", "PROJECT_OWNER"], "project"), 
  BoardController.getBoardById
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["PROJECT_MEMBER", "PROJECT_ADMIN", "PROJECT_OWNER"], "project"), 
  BoardController.getAllBoards
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"), 
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["PROJECT_OWNER"], "project"), 
  BoardController.deleteBoard
);

export default router;