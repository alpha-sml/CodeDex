# CodeDex – Unified Competitive Programming Dashboard

> **A single platform to track your coding journey across LeetCode, Codeforces, and more — all in one dashboard.**

![Next.js](https://img.shields.io/badge/Frontend-Next.js-blue?logo=next.js)
![Express.js](https://img.shields.io/badge/Backend-Express.js-green?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20Argon2-orange?logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 📘 Overview

Competitive programmers use multiple platforms to solve problems and join contests — but tracking progress on each one separately is tedious.  
**CodeDex** simplifies this by aggregating **user stats, ratings, and achievements** from platforms like **LeetCode and Codeforces** into a unified, visually rich dashboard.

---

## 🧩 Features

### ✅ Implemented
| Category | Features |
|-----------|-----------|
| 🔐 **Authentication** | JWT refresh tokens (1h access, 30d refresh) with Argon2 hashing |
| 🏗️ **Separation of Concerns** | Service layer architecture for maintainable code |
| 👤 **User Management** | Signup, login, logout, profile endpoints |
| 💾 **Database Models** | User model with platform handles & Platform model for cached stats |
| 🍪 **Cookie Management** | HTTP-only secure cookies for token storage |

### 🚧 In Progress
| Category | Features |
|-----------|-----------|
| 🌐 **Platform Integration** | LeetCode & Codeforces API integration (coming soon) |
| 📊 **Dashboard** | Unified stats view across platforms |
| 🔍 **Search & Filter** | Problem search by platform, difficulty, tags |

### 📋 Roadmap
- 🏆 Contest tracker with upcoming contests
- 💾 Bookmarks system for favorite problems
- 📈 Rating graphs and progress visualization
- ➕ Additional platforms (HackerRank, CodeChef, AtCoder)

---

## 🏗️ System Architecture

```
Frontend (Next.js) → Backend (Express.js) → Database (MongoDB) → External APIs
                          ↓
                    Service Layer
                    (Business Logic)
```

- **Frontend**: Next.js with custom CSS for responsive UI  
- **Backend**: Node.js + Express.js with service-oriented architecture
- **Database**: MongoDB with Mongoose ODM  
- **Authentication**: JWT (access + refresh tokens) + Argon2id password hashing  
- **Hosting**:  
  - Frontend → Vercel  
  - Backend → Render  
  - Database → MongoDB Atlas

---

## 📡 API Endpoints

### 🔓 Authentication (Public)
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/auth/signup` | POST | Register new user with username, email, password |
| `/api/auth/login` | POST | Login with username/email and password |

### 🔒 Authentication (Protected)
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/auth/logout` | POST | Logout and clear refresh token |
| `/api/auth/refresh` | POST | Refresh access token using refresh token |
| `/api/auth/me` | GET | Get current user profile |

### 🚧 Coming Soon
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/platforms` | POST | Add/update platform handle |
| `/api/platforms/:platform` | DELETE | Remove platform connection |
| `/api/platforms` | GET | List connected platforms |
| `/api/user/stats` | GET | Get aggregated stats from all platforms |
| `/api/platforms/:platform/sync` | POST | Force refresh platform stats |

---

## 💻 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | Next.js 16, React 19, Custom CSS |
| **Backend** | Node.js, Express.js, Service Layer Architecture |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (access + refresh tokens), Argon2id hashing |
| **External APIs** | LeetCode, Codeforces (integration in progress) |

---

## 🚀 Current Architecture Highlights

- **Service Layer Pattern**: Business logic separated from controllers
- **Refresh Token Flow**: Secure 1-hour access tokens with 30-day refresh tokens
- **Cookie-based Auth**: HTTP-only secure cookies prevent XSS attacks
- **Argon2id Hashing**: Industry-standard password security
- **Model Layer**: Clean Mongoose schemas with hooks and methods

---

## 🌍 Deployment

| Component | Platform | Status |
|------------|-----------|---------|
| Frontend | Vercel | Planned |
| Backend | Render | Planned |
| Database | MongoDB Atlas | Planned |

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## ❤️ Support

If you like this project, give it a ⭐ on GitHub!
