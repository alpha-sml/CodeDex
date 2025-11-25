import mongoose from "mongoose";

const platformSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ["leetcode", "codeforces"],
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    stats: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastFetched: {
      type: Date,
      default: Date.now,
    },
    error: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

platformSchema.index({ userId: 1, platform: 1 }, { unique: true });

platformSchema.index({ lastFetched: 1 });

const Platform = mongoose.model("Platform", platformSchema);
export default Platform;
