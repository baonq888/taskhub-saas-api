import express from "express";
import TaskController from "./taskController.js";
import authMiddleware from "../../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../../core/middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", TaskController.createTask);
router.patch("/assign", authMiddleware, roleMiddleware["TENANT_ADMIN"], TaskController.assignTask);
router.get("/:id", TaskController.getTaskById);
router.get("/", TaskController.getAllTasks);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

export default router;