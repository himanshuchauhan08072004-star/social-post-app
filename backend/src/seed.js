import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

const DEMO_PASSWORD = "Demo@12345";

const DEMO_USERS = [
  "Sarah Johnson", "Alex Rodriguez", "Priya Sharma", "Rohan Mehta",
  "Neha Verma", "Arjun Patel", "Aisha Khan", "Daniel Wilson",
  "Emily Carter", "Rahul Singh", "Sofia Martin", "Michael Chen",
  "Ananya Gupta", "David Kim", "Olivia Brown", "Karan Malhotra",
];

const emailFor = (name) => `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@loopdemo.com`;
const imageFor = (seed) => `https://picsum.photos/seed/${seed}/900/600`;

const POSTS = [
  { text: "Sunset views never get old! 🌅 Grateful for these beautiful moments. #sunset #nature", image: "sunset-1" },
  { text: "Coffee + Code = Perfect morning ☕💻 What's your productivity fuel? #coding #coffee", image: "workspace-1" },
  { text: "Finally reached the top. The view was worth every step. #travel #mountains", image: "mountains-1" },
  { text: "Small progress is still progress. 🚀 #fitness", image: null },
  { text: "Weekend photography walk through the city. #photography #city", image: "city-1" },
  { text: "Old books, new stories. Spent the afternoon at the library. #books", image: "books-1" },
  { text: "Clean desk, clear mind. Setting up the new workstation. #workspace #technology", image: "workspace-2" },
  { text: "Nothing beats a home-cooked meal after a long week. #food", image: "food-1" },
  { text: "Rescued this little guy last month — he owns the house now. #pets", image: "pets-1" },
  { text: "Morning run through the park before the city wakes up. #fitness #lifestyle", image: "fitness-1" },
  { text: "Architecture like this makes me want to pick up a camera every day. #architecture #photography", image: "architecture-1" },
  { text: "Some days the code just doesn't want to cooperate. 😅 #coding", image: null },
  { text: "Road trip through the mountains — best decision this month. #travel #mountains", image: "mountains-2" },
  { text: "Golden hour hits different by the coast. #sunset #photography", image: "sunset-2" },
  { text: "New plant, new corner of the apartment. Slowly becoming a plant person. #lifestyle", image: "workspace-3" },
  { text: "Late night debugging session, but we shipped it. #coding #technology", image: "workspace-4" },
  { text: "Street food tour of the old city — highly recommend the corner stall. #food #travel", image: "food-2" },
  { text: "Quiet mornings with a book and bad coffee are underrated. #books #coffee", image: "books-2" },
  { text: "Trail day. Legs are tired, mind is clear. #fitness #nature", image: "nature-1" },
  { text: "City lights from the rooftop tonight. #city #photography", image: "city-2" },
];

const COMMENT_TEXTS = [
  "Absolutely beautiful! 🔥",
  "This looks amazing.",
  "Where is this?",
  "Great shot!",
  "Love this perspective.",
  "Need to visit this place someday.",
  "That setup looks clean!",
  "Okay this is goals.",
  "Saving this for later.",
  "So good 👏",
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandomDistinct = (arr, count) => {
  const pool = [...arr];
  const picked = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const idx = randomInt(0, pool.length - 1);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
};

const run = async () => {
  await connectDB();

  const existingUsers = await User.countDocuments();
  const existingPosts = await Post.countDocuments();
  if (existingUsers > 0 || existingPosts > 0) {
    console.log(`Skipping seed: database already has ${existingUsers} users and ${existingPosts} posts.`);
    console.log("Run with --force to wipe and reseed (drops only users/posts collections).");
    if (!process.argv.includes("--force")) {
      await mongoose.disconnect();
      return;
    }
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("Existing users/posts cleared.");
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const users = await User.insertMany(
    DEMO_USERS.map((name) => ({ name, email: emailFor(name), passwordHash }))
  );
  console.log(`Seeded ${users.length} demo users (password: ${DEMO_PASSWORD})`);

  const posts = [];
  for (let i = 0; i < POSTS.length; i++) {
    const spec = POSTS[i];
    const author = users[i % users.length];
    const likeCount = randomInt(3, 45);
    const commentCount = randomInt(0, 8);

    const likers = pickRandomDistinct(
      users.filter((u) => String(u._id) !== String(author._id)),
      likeCount
    );
    const commenters = pickRandomDistinct(users, commentCount);

    posts.push({
      userId: author._id,
      username: author.name,
      text: spec.text,
      imageUrl: spec.image ? imageFor(spec.image) : "",
      likes: likers.map((u) => ({ userId: u._id, username: u.name })),
      comments: commenters.map((u) => ({
        userId: u._id,
        username: u.name,
        text: COMMENT_TEXTS[randomInt(0, COMMENT_TEXTS.length - 1)],
        createdAt: new Date(Date.now() - randomInt(1, 5000) * 60 * 1000),
      })),
      createdAt: new Date(Date.now() - (POSTS.length - i) * 45 * 60 * 1000),
    });
  }

  await Post.insertMany(posts);
  console.log(`Seeded ${posts.length} demo posts with embedded likes/comments.`);

  await mongoose.disconnect();
  console.log("Done.");
};

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
