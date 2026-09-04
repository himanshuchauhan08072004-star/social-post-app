import mongoose from "mongoose";
import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    const trimmedText = (text || "").trim();

    if (!trimmedText && !req.file) {
      return res.status(400).json({ message: "A post needs text, an image, or both" });
    }

    const post = await Post.create({
      userId: req.user._id,
      username: req.user.name,
      text: trimmedText,
      imageUrl: req.file ? req.file.path : "",
      imagePublicId: req.file ? req.file.filename : "",
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};

export const getFeed = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);

    res.json({
      posts,
      page,
      limit,
      total,
      hasMore: skip + posts.length < total,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (String(post.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId).catch(() => {});
    }
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = String(req.user._id);
    const existingIndex = post.likes.findIndex((l) => String(l.userId) === userId);

    let liked;
    if (existingIndex >= 0) {
      post.likes.splice(existingIndex, 1);
      liked = false;
    } else {
      post.likes.push({ userId: req.user._id, username: req.user.name });
      liked = true;
    }

    await post.save();
    res.json({ liked, likesCount: post.likes.length, likes: post.likes });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      userId: req.user._id,
      username: req.user.name,
      text: text.trim(),
      createdAt: new Date(),
    };
    post.comments.push(comment);
    await post.save();

    const savedComment = post.comments[post.comments.length - 1];
    res.status(201).json({ comment: savedComment, commentsCount: post.comments.length });
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }
    const post = await Post.findById(id).select("comments");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ comments: post.comments });
  } catch (err) {
    next(err);
  }
};
