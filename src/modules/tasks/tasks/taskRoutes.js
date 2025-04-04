import express from "express";
import TaskController from "./taskController.js";
import authMiddleware from "../../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../../core/middleware/roleMiddleware.js";

const router = express.Router({ mergeParams: true });

// Create a new task
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"), 
  TaskController.createTask
);

// Assign a user to a task
router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"), 
  TaskController.assignTask
);

// Unassign a user from a task
router.patch(
  "/:id/unassign",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"), 
  TaskController.unassignTask
);

// Get a specific task by ID
router.get("/:id", authMiddleware, TaskController.getTaskById);

// Get all tasks
router.get("/", authMiddleware, TaskController.getAllTasks);

// Update a task
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"), 
  TaskController.updateTask
);

// Delete a task (Only PROJECT_OWNER can delete)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["PROJECT_OWNER"], "project"),
  TaskController.deleteTask
);

export default router;