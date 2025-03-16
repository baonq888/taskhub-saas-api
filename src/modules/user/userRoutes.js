import { Router } from "express";
import UserController from "./userController";
import authMiddleware from "../../core/middleware/authMiddleware";
import roleMiddleware from "../../core/middleware/roleMiddleware";

const router = Router();

router.get("/me", authMiddleware, UserController.getUserDetails); 
router.get("/:id", authMiddleware, roleMiddleware(["ADMIN"]), UserController.getUserById); 

export default router;