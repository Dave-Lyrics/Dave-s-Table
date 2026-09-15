import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { initializePayment, verifyPayment } from "../controllers/paymentController.js";
const router = Router();
router.use(protect);
router.post("/initialize", initializePayment);
router.get("/verify/:reference", verifyPayment);
export default router;