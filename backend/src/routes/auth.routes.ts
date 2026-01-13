import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);
router.get("/me", authenticateToken, authController.getMe);

export default router;
