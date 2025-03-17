import express from "express";
import TenantController from "./tenantController.js";
import authMiddleware from "../../core/middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, TenantController.createTenant);
router.get("/:id", authMiddleware, TenantController.getTenant);
router.post("/:id/invite", authMiddleware, TenantController.inviteUser);
router.get("/", authMiddleware, TenantController.listTenants);

export default router;