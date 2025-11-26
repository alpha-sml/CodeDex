import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from './config/db.js'
import authRoutes from "./routes/authRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [`http://localhost:3000`, process.env.FRONTEND_URL],
  credentials: true,
})
);

app.get("/api/health", (req, res) => {
  res.send("CodeDex API is up and running!");
});
app.use("/api/auth", authRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
