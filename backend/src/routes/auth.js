const express = require('express');
const prisma = require('../config/db');
const app = express();

app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password || !username.trim() || !email.trim() || !password.trim())
      return res.status(400).json({ error: "All fields are required" });

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername)
      return res.status(400).json({ error: "Username already exists" });

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail)
      return res.status(400).json({ error: "Email already exists" });

    await prisma.user.create({ data: { username, email, password } });
    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || !username.trim() || !password.trim())
      return res.status(400).json({ error: "All fields are required" });

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.password !== password)
      return res.status(401).json({ error: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful!",
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
