import express from "express";
import AutomationController from "./authomationController.js";
import authMiddleware from "../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../core/middleware/roleMiddleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Automation
 *   description: Automation rules for boards and tenants
 */

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/automations:
 *   post:
 *     summary: Create a new automation rule for a project
 *     tags: [Automation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               trigger: "task_created"
 *               action: "notify_user"
 *     responses:
 *       201:
 *         description: Automation rule created successfully
 */
router.post(
    "/projects/:projectId/automations",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    AutomationController.createRuleByProject
);

/**
 * @swagger
 * /tenants/{tenantId}/automations:
 *   post:
 *     summary: Create a new automation rule for a tenant
 *     tags: [Automation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               trigger: "task_created"
 *               action: "notify_user"
 *     responses:
 *       201:
 *         description: Automation rule created successfully
 */
router.post(
    "/automations",
    authMiddleware,
    roleMiddleware(["TENANT_ADMIN"], ["tenant"]),
    AutomationController.createRuleByTenant
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/automations:
 *   get:
 *     summary: Get all automation rules for a project
 *     tags: [Automation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of automation rules for the project
 */
router.get(
    "/projects/:projectId/automations",
    authMiddleware,
    roleMiddleware(["PROJECT_OWNER", "PROJECT_ADMIN", "PROJECT_MEMBER"], ["project"]),
    AutomationController.getRulesByProject
);

/**
 * @swagger
 * /tenants/{tenantId}/automations:
 *   get:
 *     summary: Get all automation rules for a tenant
 *     tags: [Automation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of automation rules for the tenant
 */
router.get(
    "/automations",
    authMiddleware,
    roleMiddleware(["TENANT_ADMIN", "PROJECT_OWNER", "PROJECT_ADMIN"], ["tenant"]),
    AutomationController.getRulesByTenant
);

/**
 * @swagger
 * /tenants/{tenantId}/automations/{ruleId}:
 *   put:
 *     summary: Update a tenant-level automation rule
 *     tags: [Automation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: ruleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               actionType: "notify_user"
 *               actionPayload: { "userId": "123" }
 *     responses:
 *       200:
 *         description: Tenant automation rule updated successfully
 */
router.put(
    "/automations/:ruleId",
    authMiddleware,
    roleMiddleware(["TENANT_ADMIN"], ["tenant"]),
    AutomationController.updateTenantRule
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/automations/{ruleId}:
 *   put:
 *     summary: Update a project-level automation rule
 *     tags: [Automation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: ruleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               actionType: "move_task"
 *               actionPayload: { "toColumnId": "456" }
 *     responses:
 *       200:
 *         description: Project automation rule updated successfully
 */
router.put(
    "/projects/:projectId/automations/:ruleId",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    AutomationController.updateProjectRule
);

/**
 * @swagger
 * /tenants/{tenantId}/automations/{id}:
 *   delete:
 *     summary: Delete an automation rule
 *     tags: [Automation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Automation rule deleted successfully
 */
router.delete(
    "/automations/:ruleId",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    AutomationController.deleteRule
);

export default router;