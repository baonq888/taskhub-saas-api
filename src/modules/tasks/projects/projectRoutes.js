import express from "express";
import ProjectController from "./projectController.js";
import authMiddleware from "../../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../../core/middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["TENANT_ADMIN"], "tenant"), 
  ProjectController.createProject
);
router.get("/:id", authMiddleware, ProjectController.getProjectById);
router.get("/", authMiddleware, ProjectController.getAllProjects);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"),
  ProjectController.updateProject
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["PROJECT_OWNER"], "project"), 
  ProjectController.deleteProject
);
router.post(
  "/invite-user",
  authMiddleware,
  roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"),
  ProjectController.inviteUserToProject
);

export default router;