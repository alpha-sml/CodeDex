import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [5, "Username must be at least 5 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    platforms: {
      leetcode: { type: String, trim: true },
      codeforces: { type: String, trim: true },
    },
    preferences: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastSyncedAt: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await argon2.hash(this.password, { type: argon2.argon2id });
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await argon2.verify(this.password, enteredPassword);
};

const User = mongoose.model("User", userSchema);
export default User;
