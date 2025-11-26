import { clearAuthCookieOptions, authCookieOptions } from '../utils/cookieOptions.js';
import { createUser, authenticateUser, refreshUserToken, logoutUser } from '../services/authService.js';

// SIGNUP
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await createUser({ username, email, password });

    res.cookie("accessToken", result.accessToken, { ...authCookieOptions, maxAge: 60 * 60 * 1000 });
    res.cookie("refreshToken", result.refreshToken, { ...authCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.status(201).json({
      message: "Signup successful",
      user: result.user,
    });
  } catch (err) {
    console.error("Error signing up!", err);
    if (err.message === "USERNAME_OR_EMAIL_EXISTS") {
      return res.status(400).json({ message: "Username or email already in use" });
    }
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Please provide username/email and password" });
    }

    const result = await authenticateUser({ identifier, password });

    res.cookie("accessToken", result.accessToken, { ...authCookieOptions, maxAge: 60 * 60 * 1000 });
    res.cookie("refreshToken", result.refreshToken, { ...authCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      message: "Login successful",
      user: result.user,
    });
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    await logoutUser(req.user);
    
    res.clearCookie("accessToken", clearAuthCookieOptions);
    res.clearCookie("refreshToken", clearAuthCookieOptions);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROFILE
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
    const result = await refreshUserToken(refreshToken);

    res.cookie("accessToken", result.accessToken, { ...authCookieOptions, maxAge: 60 * 60 * 1000 });
    res.status(200).json({ message: "Access token refreshed" });
  } catch (error) {
    if (error.message === "REFRESH_TOKEN_NOT_FOUND") {
      return res.status(401).json({ message: "Refresh token not found" });
    }
    if (error.message === "INVALID_REFRESH_TOKEN") {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export { signup, login, logout, getProfile, refreshAccessToken };
