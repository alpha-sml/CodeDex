"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import "./dashboard.css";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProblems: 0,
    streak: 0,
    platformsConnected: 0
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await api.getProfile();
      if (result.user) {
        setUser(result.user);
        await fetchDashboardData();
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await api.listPlatforms();
      const platformsData = Array.isArray(response) ? response : (response?.platforms || []);
      setPlatforms(platformsData);
      
      const connectedPlatforms = platformsData.filter(p => p.username);
      setStats({
        totalProblems: 0,
        streak: 0,
        platformsConnected: connectedPlatforms.length
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="dashboardLoading">
        <div className="loadingSpinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebarHeader">
          <img src="/images/codedex.png" alt="CodeDex" className="sidebarLogo" />
        </div>
        <nav className="sidebarNav">
          <Link href="/dashboard" className="navItem active">
            <span className="navIcon">📊</span>
            <span>Overview</span>
          </Link>
          <Link href="/dashboard/platforms" className="navItem">
            <span className="navIcon">🎮</span>
            <span>Platforms</span>
          </Link>
          <Link href="/dashboard/problems" className="navItem">
            <span className="navIcon">📝</span>
            <span>Problems</span>
          </Link>
          <Link href="/dashboard/contests" className="navItem">
            <span className="navIcon">⚔️</span>
            <span>Contests</span>
          </Link>
        </nav>
        <div className="sidebarFooter">
          <div className="userInfo">
            <div className="userName">{user?.username}</div>
            <button onClick={handleLogout} className="logoutButton">
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="mainContent">
        <header className="dashboardHeader">
          <h1 className="dashboardTitle">Trainer Dashboard</h1>
          <p className="dashboardSubtitle">Welcome back, {user?.username}!</p>
        </header>

        <section className="statsSection">
          <div className="statsGrid">
            <div className="statCard">
              <div className="statIcon">🎯</div>
              <div className="statValue">{stats.totalProblems}</div>
              <div className="statLabel">Problems Caught</div>
            </div>
            <div className="statCard">
              <div className="statIcon">🔥</div>
              <div className="statValue">{stats.streak}</div>
              <div className="statLabel">Day Streak</div>
            </div>
            <div className="statCard">
              <div className="statIcon">🎮</div>
              <div className="statValue">{stats.platformsConnected}</div>
              <div className="statLabel">Platforms Connected</div>
            </div>
          </div>
        </section>

        <section className="overviewGrid">
          <div className="heatmapCard">
            <h2 className="cardTitle">Catch Calendar</h2>
            <div className="heatmapContainer">
              <p className="emptyState">
                Your activity heatmap will appear here once you start solving problems!
              </p>
            </div>
          </div>

          <div className="recentCatchesCard">
            <h2 className="cardTitle">Recent Catches</h2>
            <div className="catchesList">
              <p className="emptyState">
                No problems caught yet. Start solving to fill your Pokédex!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
