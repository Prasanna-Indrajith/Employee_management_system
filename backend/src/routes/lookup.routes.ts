import { Router } from "express";
import { LookupController } from "../controllers/lookup.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const controller = new LookupController();

// Only logged-in users can fetch the lists
router.get("/", authenticateToken, controller.getAllOptions.bind(controller));

export default router;
