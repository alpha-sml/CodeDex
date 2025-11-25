import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
