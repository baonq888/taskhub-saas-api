import { Router } from "express";
import UserController from "./userController.js";
import authMiddleware from "../../core/middleware/authMiddleware.js";
import roleMiddleware from "../../core/middleware/roleMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, UserController.getUserDetails); 
router.get("/:id", authMiddleware, roleMiddleware(["ADMIN"]), UserController.getUserById); 

export default router;