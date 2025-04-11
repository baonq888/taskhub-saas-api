import express from "express";
import ProjectController from "./projectController.js";
import authMiddleware from "../../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../../core/middleware/roleMiddleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management and user invitations
 */

/**
 * @swagger
 * /tenants/{tenantId}/projects:
 *   post:
 *     summary: Create a new project under a tenant
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
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
 *               name:
 *                 type: string
 *                 example: Project Alpha
 *               description:
 *                 type: string
 *                 example: Description of Project Alpha
 *     responses:
 *       201:
 *         description: Project created
 *       403:
 *         description: Forbidden
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["TENANT_ADMIN"], ["tenant"]),
    ProjectController.createProject
);

/**
 * @swagger
 * /tenants/{tenantId}/projects:
 *   get:
 *     summary: Get all projects under a tenant
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get("/", authMiddleware, ProjectController.getAllProjects);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
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
 *         description: Project found
 *       404:
 *         description: Project not found
 */
router.get("/:projectId", authMiddleware, ProjectController.getProjectById);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}:
 *   put:
 *     summary: Update project details
 *     tags: [Projects]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Project Name
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Project updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
 */
router.put(
    "/:projectId",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    ProjectController.updateProject
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
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
 *         description: Project deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
 */
router.delete(
    "/:projectId",
    authMiddleware,
    roleMiddleware(["PROJECT_OWNER"], ["project"]),
    ProjectController.deleteProject
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/invite:
 *   post:
 *     summary: Invite a user to the project
 *     tags: [Projects]
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
 *                 example: ["dev@example.com"]
 *     responses:
 *       200:
 *         description: Invitation sent
 *       403:
 *         description: Forbidden
 */
router.post(
    "/:projectId/invite",
    authMiddleware,
    roleMiddleware(["TENANT_ADMIN", "PROJECT_OWNER", "PROJECT_ADMIN"], ["tenant", "project"]),
    ProjectController.inviteUserToProject
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/users/{userId}/role:
 *   patch:
 *     summary: Update a user's role in a project
 *     tags: [Projects]
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
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newRole:
 *                 type: string
 *                 example: "PROJECT_ADMIN"
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.put(
    "/:projectId/users/:userId/role",
    authMiddleware,
    roleMiddleware(["TENANT_ADMIN", "PROJECT_OWNER", "PROJECT_ADMIN"], ["tenant", "project"]),
    ProjectController.updateProjectUserRole
);

export default router;