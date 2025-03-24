import express from "express";
import BoardController from "./boardController.js";
import authMiddleware from "../../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../../core/middleware/roleMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware,roleMiddleware(["TENANT_ADMIN"]),BoardController.createBoard);
router.get("/:id", authMiddleware,roleMiddleware(["TENANT_ADMIN"]),BoardController.getBoardById);
router.get("/", authMiddleware,roleMiddleware(["TENANT_ADMIN"]),BoardController.getAllBoards);
router.put("/:id", authMiddleware,roleMiddleware(["TENANT_ADMIN"]),BoardController.updateBoard);
router.delete("/:id", authMiddleware,roleMiddleware(["TENANT_ADMIN"]),BoardController.deleteBoard);

export default router;