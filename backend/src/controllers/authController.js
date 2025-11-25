import User from '../models/User.js';
import { clearAuthCookieOptions, authCookieOptions } from '../utils/cookieOptions.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// SIGNUP
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json("All fields are require!");
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    const newUser = await User.create({ username, email, password });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);
    newUser.refreshToken = refreshToken;
    await newUser.save();
    res.cookie("accessToken", accessToken, { ...authCookieOptions, maxAge: 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...authCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Error signing up!", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username/email and password" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("accessToken", accessToken, { ...authCookieOptions, maxAge: 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...authCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 }); 

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshToken = null;
      await req.user.save();
    }
    
    res.clearCookie("accessToken", clearAuthCookieOptions);
    res.clearCookie("refreshToken", clearAuthCookieOptions);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROFILE (Protected Route)
const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REFRESH TOKEN
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const newAccessToken = generateAccessToken(user._id);
    res.cookie("accessToken", newAccessToken, { ...authCookieOptions, maxAge: 60 * 60 * 1000 }); // 1 hour

    res.status(200).json({ message: "Access token refreshed" });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export { signup, login, logout, getProfile, refreshAccessToken };
