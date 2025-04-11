import express from "express";
import TenantController from "./tenantController.js";
import authMiddleware from "../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../core/middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: Tenant management and user invitations
 */

/**
 * @swagger
 * /tenants:
 *   post:
 *     summary: Create a new tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Team
 *     responses:
 *       201:
 *         description: Tenant created successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden
 */
router.post(
    "/",
    authMiddleware,
    TenantController.createTenant
);

/**
 * @swagger
 * /tenants/{id}:
 *   get:
 *     summary: Get tenant details by ID
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *     responses:
 *       200:
 *         description: Tenant found
 *       404:
 *         description: Tenant not found
 */
router.get("/:tenantId", authMiddleware, TenantController.getTenant);

/**
 * @swagger
 * /tenants/{id}/invite:
 *   post:
 *     summary: Invite users to the tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1@example.com", "user2@example.com"]
 *     responses:
 *       200:
 *         description: Invitations sent
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
router.post(
    "/:tenantId/invite",
    authMiddleware,
    roleMiddleware(["TENANT_ADMIN", "TENANT_OWNER"], "tenant"),
    TenantController.inviteUsers
);

/**
 * @swagger
 * /tenants:
 *   get:
 *     summary: List all tenants for the current user
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tenants
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, TenantController.listTenants);

/**
 * @swagger
 * /tenants/{id}/users/{userId}/role:
 *   put:
 *     summary: Update a user's role in a tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [TENANT_MEMBER, TENANT_ADMIN, TENANT_OWNER]
 *                 example: TENANT_ADMIN
 *     responses:
 *       200:
 *         description: Role updated
 *       400:
 *         description: Invalid role
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch(
    "/:tenantId/users/:userId/role",
    authMiddleware,
    roleMiddleware(["TENANT_OWNER"], "tenant"),
    TenantController.updateTenantUserRole
);

export default router;