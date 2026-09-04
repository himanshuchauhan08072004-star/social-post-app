import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, trim: true, maxlength: 2000, default: "" },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    likes: { type: [likeSchema], default: [] },
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true }
);

postSchema.pre("validate", function (next) {
  if ((!this.text || this.text.trim().length === 0) && !this.imageUrl) {
    return next(new Error("A post requires text, an image, or both."));
  }
  next();
});

postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);
