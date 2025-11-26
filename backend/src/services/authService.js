import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// SIGNUP
export const createUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new Error("USERNAME_OR_EMAIL_EXISTS");
  }

  const newUser = await User.create({ username, email, password });
  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  newUser.refreshToken = refreshToken;
  await newUser.save();

  return {
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
    accessToken,
    refreshToken,
  };
};

// LOGIN
export const authenticateUser = async ({ identifier, password }) => {
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

// REFRESH TOKEN
export const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("REFRESH_TOKEN_NOT_FOUND");
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const newAccessToken = generateAccessToken(user._id);
  return { accessToken: newAccessToken };
};

// LOGOUT
export const logoutUser = async (user) => {
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
};
