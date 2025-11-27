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

CodeDex is a **retro pixel-themed coding tracker** that transforms your competitive programming journey into a Pokémon adventure! Track your solved problems across LeetCode and Codeforces, visualize your progress with an activity heatmap, and watch your Pokédex grow as you catch more problems.

### 🎨 Design Theme
- **Retro Pixel Art** - Inspired by classic Pokémon games with Press Start 2P font
- **Pokédex Interface** - Problems are "caught Pokémon" in your collection
- **Gym Battles** - Upcoming coding contests across platforms
- **Catch Calendar** - Heatmap showing your daily coding activity

---

## 🧩 Features

### ✅ Implemented

#### 🎨 Frontend
| Feature | Description |
|---------|-------------|
| 🏠 **Landing Page** | Retro pixel-themed landing with hero, features, timeline, and CTA sections |
| 🔐 **Auth Pages** | Pixel-styled login and signup forms with retro game aesthetics |
| 📊 **Dashboard** | Main overview with stats cards, activity heatmap, and recent catches |
| 🎮 **Platforms Page** | Connect/manage LeetCode and Codeforces accounts |
| 📝 **Problems Page** | Your Pokédex - view all caught problems |
| ⚔️ **Contests Page** | Gym Battles - upcoming contests across platforms |
| 🎯 **Components** | Reusable FeatureCard and Navbar components |
| 📱 **Responsive Design** | Mobile-optimized layouts with retro pixel styling |

#### 🔧 Backend
| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT refresh tokens (1h access, 30d refresh) with Argon2 hashing |
| 🏗️ **Architecture** | Service layer pattern for maintainable code |
| 👤 **User Management** | Signup, login, logout, profile endpoints |
| 💾 **Database Models** | User, Platform, Bookmark, ProgressSnapshot models |
| 🍪 **Security** | HTTP-only secure cookies, CORS configured |

### 🚧 In Progress
| Feature | Status |
|---------|---------|
| 🌐 **Platform Integration** | LeetCode & Codeforces API integration |
| 📈 **Activity Heatmap** | Interactive contribution-style calendar |
| 🔗 **Connect Platforms** | Modal/form for platform connection |
| 📊 **Real Data Display** | Fetch and display actual problems/contests |

### 📋 Roadmap
- 🎯 Problem filtering by difficulty, tags, platform
- 🏆 Contest notifications and reminders
- 📈 Rating graphs and progress visualization
- 🌟 Achievement badges and milestones
- ➕ Additional platforms (HackerRank, CodeChef, AtCoder)
- 🎨 More Pokémon-themed animations and effects

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

### 🎮 Platform Management (Protected)
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/platforms` | GET | Get all connected platforms for user |
| `/api/platforms` | POST | Add/update platform connection |
| `/api/platforms/:id` | DELETE | Remove platform connection |

### 📝 Bookmarks (Protected)
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/bookmarks` | GET | Get all bookmarked problems |
| `/api/bookmarks` | POST | Add problem bookmark |
| `/api/bookmarks/:id` | DELETE | Remove bookmark |

### ⚔️ Contests (Protected)
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/contests` | GET | Get upcoming contests from all platforms |

### 🚧 Coming Soon
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/user/stats` | GET | Get aggregated stats from all platforms |
| `/api/platforms/:platform/sync` | POST | Force refresh platform stats |
| `/api/problems` | GET | Get all solved problems |

---

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Styling**: Custom CSS with retro pixel theme
- **Font**: Press Start 2P (Google Fonts)
- **Components**: Reusable component architecture
- **Routing**: File-based routing with nested layouts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: Service layer pattern
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (access + refresh tokens)
- **Password Hashing**: Argon2id
- **Security**: CORS, HTTP-only cookies

### External APIs (Planned)
- LeetCode GraphQL API
- Codeforces REST API

---

## 🚀 Architecture Highlights

### Frontend
- **Retro Pixel Theme**: Press Start 2P font, pixel borders, retro shadows, translucent cards
- **Component Reusability**: Shared components for cards, navigation, layouts
- **Responsive Design**: Mobile-first approach with breakpoints
- **Client-Side Routing**: Fast navigation with Next.js App Router

### Backend
- **Service Layer Pattern**: Business logic separated from controllers
- **Refresh Token Flow**: Secure 1-hour access tokens with 30-day refresh tokens
- **Cookie-based Auth**: HTTP-only secure cookies prevent XSS attacks
- **Argon2id Hashing**: Industry-standard password security
- **Model Layer**: Clean Mongoose schemas with hooks and methods

---

## 🎯 Project Structure

```
CodeDex/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   │   ├── login/         # Login page with pixel theme
│   │   │   │   └── signup/        # Signup page with pixel theme
│   │   │   ├── dashboard/
│   │   │   │   ├── page.js        # Main dashboard (overview)
│   │   │   │   ├── platforms/     # Platform management page
│   │   │   │   ├── problems/      # Your Pokédex page
│   │   │   │   ├── contests/      # Gym Battles page
│   │   │   │   └── dashboard.css  # Shared dashboard styles
│   │   │   ├── page.js            # Landing page
│   │   │   ├── landing.css        # Landing page styles
│   │   │   └── globals.css        # Global styles
│   │   ├── components/
│   │   │   ├── FeatureCard.js     # Reusable feature card
│   │   │   ├── Navbar.js          # Navigation component
│   │   │   └── styles/            # Component-specific styles
│   │   └── lib/
│   │       └── api.js             # API utility functions
│   └── public/
│       └── images/                # Logos and assets
├── backend/
│   ├── src/
│   │   ├── controllers/           # Route controllers
│   │   ├── services/              # Business logic layer
│   │   ├── models/                # MongoDB schemas
│   │   ├── routes/                # API routes
│   │   ├── middleware/            # Auth middleware
│   │   ├── utils/                 # Helper functions
│   │   └── config/                # Database config
│   └── server.js                  # Express server
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

| Component | Platform | Status |
|------------|-----------|---------|
| Frontend | Vercel | Planned |
| Backend | Render | Planned |
| Database | MongoDB Atlas | Planned |

---

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
