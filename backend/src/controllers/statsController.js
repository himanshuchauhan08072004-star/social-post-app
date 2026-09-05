import User from "../models/User.js";
import Post from "../models/Post.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalPosts, totalUsers, commentAgg] = await Promise.all([
      Post.countDocuments(),
      User.countDocuments(),
      Post.aggregate([
        { $project: { count: { $size: "$comments" } } },
        { $group: { _id: null, total: { $sum: "$count" } } },
      ]),
    ]);

    res.json({
      totalPosts,
      totalUsers,
      totalComments: commentAgg[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};

export const getTrending = async (req, res, next) => {
  try {
    const posts = await Post.find({}, "text").lean();
    const counts = {};

    posts.forEach((p) => {
      const tags = (p.text || "").match(/#[a-zA-Z0-9_]+/g) || [];
      const seen = new Set();
      tags.forEach((raw) => {
        const tag = raw.toLowerCase();
        if (seen.has(tag)) return;
        seen.add(tag);
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    const trending = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    res.json({ trending });
  } catch (err) {
    next(err);
  }
};
