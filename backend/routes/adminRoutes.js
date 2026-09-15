import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { dashboardStats } from "../controllers/adminController.js";
const router = Router();
router.get("/stats", protect, adminOnly, dashboardStats);
export default router;