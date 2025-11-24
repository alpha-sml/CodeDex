# CodeDex – Unified Competitive Programming Dashboard

> **A single platform to track your coding journey across LeetCode, Codeforces, HackerRank, and more — all in one dashboard.**

![Next.js](https://img.shields.io/badge/Frontend-Next.js-blue?logo=next.js)
![Express.js](https://img.shields.io/badge/Backend-Express.js-green?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-orange?logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 📘 Overview

Competitive programmers use multiple platforms to solve problems and join contests — but tracking progress on each one separately is tedious.  
**CodeDex** simplifies this by aggregating **user stats, ratings, and achievements** from platforms like **LeetCode, Codeforces, and HackerRank** into a unified, visually rich dashboard.

---

## 🧩 Features

| Category | Features |
|-----------|-----------|
| 🔐 **Authentication** | JWT-based login/signup with bcrypt password hashing |
| 👤 **User Profile** | Displays stats, ratings, solved problems, and streaks |
| 🌐 **Platform Integration** | Connects to APIs of LeetCode, Codeforces, HackerRank |
| 📊 **Dashboard** | Unified view of coding progress across platforms |
| 💾 **CRUD Operations** | Save preferences, platform handles, and bookmarks |
| 🔍 **Search & Filter** | Search problems by platform, difficulty, and tags |
| 🏆 **Contest Tracker** | View upcoming contests and register directly |

---

## 🏗️ System Architecture

Frontend → Backend (API) → Database → External Platform APIs

- **Frontend**: Next.js with TailwindCSS for responsive and dynamic UI  
- **Backend**: Node.js + Express.js REST API  
- **Database**: MongoDB for flexible schema management  
- **Authentication**: JWT + bcrypt for secure session handling  
- **Hosting**:  
  - Frontend → Vercel  
  - Backend → Render / Railway  
  - Database → MongoDB Atlas

---

## 📡 API Overview

| Endpoint | Method | Description | Access |
|-----------|---------|-------------|---------|
| `/api/auth/signup` | POST | Register new user (JWT + bcrypt) | Public |
| `/api/auth/login` | POST | Authenticate user and issue JWT token | Public |
| `/api/user/stats` | GET | Fetch aggregated platform stats | Authenticated |
| `/api/user/platforms` | POST | Add/remove connected platforms | Authenticated |
| `/api/user/bookmarks` | GET/POST/DELETE | Manage bookmarks | Authenticated |
| `/api/contest/upcoming` | GET | List upcoming contests | Authenticated |

---

## 💻 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | Next.js, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT, bcrypt |
| **External APIs** | LeetCode, Codeforces, HackerRank |

---

## 📈 Future Enhancements

- 📅 Add reminders for upcoming contests  
- 💬 Integrate chat/community features  
- 📱 Mobile app version (React Native)  
- 🎨 Dark/Light theme toggle  
- 🧠 AI-based performance analytics

---

## ⚙️ Setup & Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/codedex.git
cd codedex

# Install dependencies
npm install

# Run the development server
npm run dev
```


## 🌍 Deployment

| Component | Platform |
|------------|-----------|
| Frontend | Vercel |
| Backend | Render  |
| Database | Aiven |

---


## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## ❤️ Support

If you like this project, give it a ⭐ on GitHub!
