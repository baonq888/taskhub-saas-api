import { Router } from "express";
import UserController from "./userController.js";
import authMiddleware from "../../core/middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, UserController.getAllUsers); 
router.get("/me", authMiddleware, UserController.getUserDetails); 
router.get("/:id", authMiddleware, UserController.getUserById); 

export default router;