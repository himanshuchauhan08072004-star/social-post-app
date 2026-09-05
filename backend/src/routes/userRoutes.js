import express from "express";
import { getRecentUsers } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/recent", protect, getRecentUsers);

export default router;
