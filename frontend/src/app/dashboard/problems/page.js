"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import "../dashboard.css";

export default function ProblemsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await api.getProfile();
      if (result.user) {
        setUser(result.user);
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
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
          <Link href="/dashboard" className="navItem">
            <span className="navIcon">📊</span>
            <span>Overview</span>
          </Link>
          <Link href="/dashboard/platforms" className="navItem">
            <span className="navIcon">🎮</span>
            <span>Platforms</span>
          </Link>
          <Link href="/dashboard/problems" className="navItem active">
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
          <h1 className="dashboardTitle">Your Pokédex</h1>
          <p className="dashboardSubtitle">All your caught problems in one place</p>
        </header>

        <section className="problemsSection">
          <div className="problemsCard">
            <p className="emptyState">
              No problems caught yet. Connect your platforms and start solving to fill your Pokédex!
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
