import express from "express";
import BoardController from "./boardController.js";
import authMiddleware from "../../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../../core/middleware/roleMiddleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: Boards APIs
 */

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards:
 *   post:
 *     tags: [Boards]
 *     summary: Create a new board
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "To Do"
 *               description:
 *                 type: string
 *                 example: "Board for to-do tasks"
 *     responses:
 *       201:
 *         description: Board created successfully
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"),
    BoardController.createBoard
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{id}:
 *   get:
 *     tags: [Boards]
 *     summary: Get a specific board by ID
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The board
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "board-uuid"
 *                 name:
 *                   type: string
 *                   example: "To Do"
 *                 description:
 *                   type: string
 *                   example: "Board for to-do tasks"
 */
router.get(
    "/:boardId",
    authMiddleware,
    roleMiddleware(["PROJECT_MEMBER", "PROJECT_ADMIN", "PROJECT_OWNER"], "project"),
    BoardController.getBoardById
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards:
 *   get:
 *     tags: [Boards]
 *     summary: Get all boards for a project
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of boards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "board-uuid"
 *                   name:
 *                     type: string
 *                     example: "To Do"
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware(["PROJECT_MEMBER", "PROJECT_ADMIN", "PROJECT_OWNER"], "project"),
    BoardController.getAllBoards
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{id}:
 *   put:
 *     tags: [Boards]
 *     summary: Update a board by ID
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "In Progress"
 *               description:
 *                 type: string
 *                 example: "Board for in-progress tasks"
 *     responses:
 *       200:
 *         description: Board updated successfully
 *       404:
 *         description: Board not found
 */
router.put(
    "/:boardId",
    authMiddleware,
    roleMiddleware(["PROJECT_ADMIN", "PROJECT_OWNER"], "project"),
    BoardController.updateBoard
);

/**
 * @swagger
 * /tenants/{tenantId}/projects/{projectId}/boards/{id}:
 *   delete:
 *     tags: [Boards]
 *     summary: Delete a board by ID
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Board deleted successfully
 *       404:
 *         description: Board not found
 */
router.delete(
    "/:boardId",
    authMiddleware,
    roleMiddleware(["PROJECT_OWNER"], "project"),
    BoardController.deleteBoard
);

export default router;