import { Router } from "express";
import UserController from "./userController.js";
import authMiddleware from "../../core/middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Details APIs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     description: This endpoint retrieves a list of all users in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, UserController.getAllUsers);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retrieve current user's details
 *     tags: [Users]
 *     description: This endpoint retrieves the details of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The details of the current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get("/me", authMiddleware, UserController.getUserDetails);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a specific user by ID
 *     tags: [Users]
 *     description: This endpoint retrieves the details of a user by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The details of the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authMiddleware, UserController.getUserById);

export default router;