# CodeDex – Gotta Solve 'Em All! 🎮

> **Track your coding journey with a Pokédex-inspired interface. Catch problems, level up your skills, and become the ultimate coding trainer!**

![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-blue?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Express.js](https://img.shields.io/badge/Backend-Express.js-green?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20Argon2-orange?logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 📘 Overview

CodeDex is a **retro pixel-themed coding tracker** inspired by Pokémon that helps you track solved problems across LeetCode and Codeforces. Features a Pokédex interface for your problem collection, Gym Battles for upcoming contests, and comprehensive stats tracking.

🔗 **Live Demo**: [https://code-dex-ten.vercel.app](https://code-dex-ten.vercel.app)

---

## 🧩 Features

### ✅ Core Features

**Frontend**
- 🏠 Retro pixel-themed landing, auth, and dashboard pages
- 📊 Dashboard with stats cards and sync button
- 🎮 Platform management (LeetCode, Codeforces) with real-time stats
- 📝 Full CRUD Pokédex with URL-based bookmarking, search, filters, sorting, pagination
- ⚔️ Live upcoming contests from multiple platforms
- 🧩 7 reusable components with centralized styling

**Backend**
- 🔐 JWT auth (1h access, 30d refresh) with Argon2 hashing
- 🌐 LeetCode GraphQL + Codeforces REST API integration
- 📊 Real-time stats aggregation and sync
- 🔖 Advanced bookmark system with filters and pagination
- 🏗️ Service layer architecture with MongoDB

### 📋 Roadmap
- 📈 Activity heatmap and progress graphs
- 🏆 Achievement system and contest reminders
- ➕ Additional platforms (HackerRank, CodeChef, AtCoder)
- 👥 Friend system and leaderboards---

## 🏗️ Architecture

```
Next.js 16 (Frontend) → Express.js (Backend) → MongoDB → LeetCode/Codeforces APIs
```

**Stack**: Next.js 16 • React 19 • Express.js • MongoDB • JWT + Argon2 • LeetCode/Codeforces APIs

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

### 🎮 Platform Management (Protected)
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/platforms` | GET | Get all connected platforms with stats |
| `/api/platforms` | POST | Add/connect new platform (LeetCode, Codeforces) |
| `/api/platforms/:platform` | PUT | Update platform username |
| `/api/platforms/:platform` | DELETE | Disconnect platform |
| `/api/platforms/:platform/sync` | POST | Force sync platform stats from external API |
| `/api/platforms/stats` | GET | Get aggregated stats across all platforms |

### 📝 Bookmarks (Protected)
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/bookmarks` | GET | Get bookmarks with pagination, search, sort, filter |
| `/api/bookmarks` | POST | Add problem bookmark with URL extraction |
| `/api/bookmarks/:id` | PUT | Update bookmark notes and tags |
| `/api/bookmarks/:id` | DELETE | Remove bookmark |

### ⚔️ Contests (Protected)
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/contests` | GET | Get upcoming contests (all platforms or filtered) |

### Query Parameters (Bookmarks)
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number for pagination (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `search` | string | Search by problem name (regex) |
| `platform` | string | Filter by platform (leetcode, codeforces) |
| `difficulty` | string | Filter by difficulty (easy, medium, hard) |
| `sortBy` | string | Sort field (createdAt, problemName, difficulty, platform) |
| `sortOrder` | string | Sort direction (asc, desc) |

---

## 💻 Tech Stack

**Frontend**: Next.js 16 (Turbopack) • React 19 • Custom CSS with glass morphism • Press Start 2P font

**Backend**: Node.js • Express.js • MongoDB (Mongoose) • JWT + Argon2id

**APIs**: LeetCode GraphQL • Codeforces REST

**Key Features**: Service layer architecture • 7 reusable components • Advanced filtering & pagination • Real-time stats sync

---

## ✨ Key Highlights

- 🎨 **Retro Design**: Glass morphism cards, pixel borders, Press Start 2P font
- 🧩 **Component Library**: 7 reusable components with centralized styling
- 🔗 **Smart URL Parsing**: Automatic problem extraction from LeetCode/Codeforces URLs
- 🔐 **Secure Auth**: JWT refresh tokens + Argon2id hashing + HTTP-only cookies
- 🌐 **API Integration**: LeetCode GraphQL + Codeforces REST with real-time sync
- 🔍 **Advanced Filtering**: Search, sort, paginate bookmarks by platform/difficulty

---

## 🎯 Project Structure

```
CodeDex/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   │   ├── login/          # Login page with pixel theme
│   │   │   │   └── signup/         # Signup page with pixel theme
│   │   │   ├── dashboard/
│   │   │   │   ├── page.js         # Main dashboard with stats & sync
│   │   │   │   ├── platforms/      # Platform management with ConnectModal
│   │   │   │   ├── problems/       # Full CRUD Pokédex with filters
│   │   │   │   ├── contests/       # Gym Battles with live contest data
│   │   │   │   ├── dashboard.css   # Shared dashboard styles
│   │   │   │   └── problems.css    # Problems page styles
│   │   │   ├── page.js             # Landing page
│   │   │   ├── landing.css         # Landing page styles
│   │   │   ├── layout.js           # Root layout
│   │   │   └── globals.css         # Global styles
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.js       # Reusable button with variants
│   │   │   │   ├── Card.js         # Glass morphism card wrapper
│   │   │   │   ├── StatCard.js     # Dashboard stat display
│   │   │   │   ├── Badge.js        # Platform & difficulty badges
│   │   │   │   ├── Modal.js        # Reusable modal component
│   │   │   │   ├── FormField.js    # Labeled form field
│   │   │   │   └── Table.js        # Table with pagination
│   │   │   ├── styles/
│   │   │   │   └── common.css      # Centralized theme & utilities
│   │   │   ├── DashboardLayout.js  # Dashboard sidebar layout
│   │   │   ├── ConnectPlatformModal.js  # Platform connection modal
│   │   │   ├── FeatureCard.js      # Landing page feature card
│   │   │   └── Navbar.js           # Navigation component
│   │   └── lib/
│   │       └── api.js              # API client with auth
│   └── public/
│       └── images/                 # Logos and assets
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js   # Auth endpoints
│   │   │   ├── platformController.js  # Platform CRUD + sync
│   │   │   ├── bookmarkController.js  # Bookmark CRUD with filters
│   │   │   └── contestController.js   # Contest fetching
│   │   ├── services/
│   │   │   ├── authService.js      # Auth business logic
│   │   │   ├── platformService.js  # LeetCode & Codeforces API
│   │   │   └── contestService.js   # Contest aggregation
│   │   ├── models/
│   │   │   ├── User.js             # User schema with hooks
│   │   │   ├── Platform.js         # Platform connection schema
│   │   │   ├── Bookmark.js         # Problem bookmark schema
│   │   │   └── ProgressSnapshot.js # Historical progress data
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # /api/auth routes
│   │   │   ├── platformRoutes.js   # /api/platforms routes
│   │   │   ├── bookmarkRoutes.js   # /api/bookmarks routes
│   │   │   └── contestRoutes.js    # /api/contests routes
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   # JWT verification
│   │   ├── utils/
│   │   │   ├── generateToken.js    # JWT token generation
│   │   │   └── cookieOptions.js    # Secure cookie config
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   └── server.js               # Express app entry
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/alpha-sml/CodeDex.git
cd CodeDex
```

2. **Setup Backend**
```bash
cd backend
pnpm install
# Create .env file with:
# MONGODB_URI=your_mongodb_connection_string
# JWT_ACCESS_SECRET=your_access_secret
# JWT_REFRESH_SECRET=your_refresh_secret
pnpm dev
```

3. **Setup Frontend**
```bash
cd frontend
pnpm install
pnpm dev
```

4. **Access the app**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🌍 Deployment

| Component | Platform | Link |
|------------|-----------|------|
| Frontend | Vercel | [code-dex-ten.vercel.app](https://code-dex-ten.vercel.app) |
| Backend | Render | [codedex-mfrt.onrender.com](https://codedex-mfrt.onrender.com) |
| Database | MongoDB Atlas | Live |---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## 🙏 Acknowledgments

- Inspired by Pokémon and the classic Pokédex interface
- Press Start 2P font by CodeMan38
- Icons and imagery from Pokémon franchise

---

## ❤️ Support

If you like this project, give it a ⭐ on GitHub and catch 'em all!
