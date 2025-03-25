import express from "express";
import TaskController from "./taskController.js";
import authMiddleware from "../../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../../core/middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"), 
  TaskController.createTask
);
router.patch(
  "/assign",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"), 
  TaskController.assignTask
);
router.get("/:id", authMiddleware, TaskController.getTaskById);
router.get("/", authMiddleware, TaskController.getAllTasks);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"), 
  TaskController.updateTask
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["PROJECT_OWNER"], "project"),
  TaskController.deleteTask
);

export default router;