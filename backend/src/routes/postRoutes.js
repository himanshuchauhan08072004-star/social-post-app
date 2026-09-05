import express from "express";
import {
  createPost,
  getFeed,
  deletePost,
  toggleLike,
  addComment,
  getComments,
} from "../controllers/postController.js";
import { getStats, getTrending } from "../controllers/statsController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.get("/stats", protect, getStats);
router.get("/trending", protect, getTrending);
router.get("/", protect, getFeed);
router.post("/", protect, upload.single("image"), createPost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", protect, getComments);

export default router;
