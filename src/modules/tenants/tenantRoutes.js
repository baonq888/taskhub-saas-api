import express from "express";
import TenantController from "./tenantController.js";
import authMiddleware from "../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../core/middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["TENANT_ADMIN", "TENANT_OWNER"], "tenant"),
  TenantController.createTenant
);

router.get("/:id", authMiddleware, TenantController.getTenant);

router.post(
  "/:id/invite",
  authMiddleware,
  roleMiddleware(["TENANT_ADMIN", "TENANT_OWNER"], "tenant"),
  TenantController.inviteUser
);

router.get("/", authMiddleware, TenantController.listTenants);

router.put(
  "/:id/users/:userId/role",
  authMiddleware,
  roleMiddleware(["TENANT_OWNER"], "tenant"),
  TenantController.updateTenantUserRole
);

export default router;