import express from "express";
import ProjectController from "./projectController.js";
import authMiddleware from "../../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../../core/middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware(["TENANT_ADMIN"]),ProjectController.createProject);
router.get("/:id", authMiddleware,ProjectController.getProjectById);
router.get("/", authMiddleware,ProjectController.getAllProjects);
router.put("/:id", authMiddleware,roleMiddleware(["TENANT_ADMIN"]),ProjectController.updateProject);
router.delete("/:id", authMiddleware,roleMiddleware(["TENANT_ADMIN"]),ProjectController.deleteProject);
router.post("/invite-user", authMiddleware,roleMiddleware(["TENANT_ADMIN"]),ProjectController.inviteUserToProject);

export default router;