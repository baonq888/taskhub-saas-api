import express from "express";
import TaskController from "./taskController.js";
import authMiddleware from "../../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../../core/middleware/roleMiddleware.js";

const router = express.Router({ mergeParams: true });
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task APIs
 */
/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     description: Creates a new task by providing the task details in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *                 example: "Implement new feature"
 *               description:
 *                 type: string
 *                 description: A detailed description of the task.
 *                 example: "Implement a new feature for the application."
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The due date for the task.
 *                 example: "2025-04-10T00:00:00Z"
 *     responses:
 *       201:
 *         description: Task successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    TaskController.createTask);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks/{id}:
 *   get:
 *     summary: Get a task by its ID
 *     tags: [Tasks]
 *     description: Retrieve a specific task by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(["PROJECT_MEMBER", "PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    TaskController.getTaskById);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     description: Retrieve a list of all tasks.
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal server error
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware(["PROJECT_MEMBER", "PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    TaskController.getAllTasks);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks/{id}:
 *   put:
 *     summary: Update a task by its ID
 *     tags: [Tasks]
 *     description: Update an existing task's details.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Task ID
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
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *                 example: "Implement new feature"
 *               description:
 *                 type: string
 *                 description: A detailed description of the task.
 *                 example: "Implement a new feature for the application."
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The due date for the task.
 *                 example: "2025-04-10T00:00:00Z"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put(
    "/:taskId",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    TaskController.updateTask);


/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks/{taskId}/status:
 *   patch:
 *     summary: Update the status of a task
 *     tags: [Tasks]
 *     description: Update the status of a task.
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID
 *         schema:
 *           type: string
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *       - name: boardId
 *         in: path
 *         required: true
 *         description: Board ID
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *                 example: IN_PROGRESS
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put(
    "/:taskId/status",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER", "PROJECT_MEMBER"], ["project"]),
    TaskController.updateTaskStatus
);


/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks/{id}:
 *   delete:
 *     summary: Delete a task by its ID
 *     tags: [Tasks]
 *     description: Delete a specific task by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task successfully deleted
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/:taskId",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    TaskController.deleteTask);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks/{id}/assign:
 *   patch:
 *     summary: Assign users to a task
 *     tags: [Tasks]
 *     description: Assign multiple users to a specific task by providing an array of user IDs.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: string
 *       - name: body
 *         in: body
 *         description: List of user IDs to assign to the task
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userIds:
 *               type: array
 *               items:
 *                 type: string
 *                 format: uuid
 *               description: List of user IDs to be assigned to the task.
 *               example: ["uuid1", "uuid2", "uuid3"]
 *     responses:
 *       200:
 *         description: Users successfully assigned to the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

router.post(
    "/:taskId/assign",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    TaskController.assignTask
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{boardId}/tasks/{id}/unassign:
 *   patch:
 *     summary: Unassign users to a task
 *     tags: [Tasks]
 *     description: Unassign multiple users to a specific task by providing an array of user IDs.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: string
 *       - name: body
 *         in: body
 *         description: List of user IDs to unassign to the task
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userIds:
 *               type: array
 *               items:
 *                 type: string
 *                 format: uuid
 *               description: List of user IDs to be unassigned to the task.
 *               example: ["uuid1", "uuid2", "uuid3"]
 *     responses:
 *       200:
 *         description: Users successfully unassigned to the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/:taskId/unassign",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], ["project"]),
    TaskController.unassignTask
);

export default router;