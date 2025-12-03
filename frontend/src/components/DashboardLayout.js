"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
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

  const isActive = (path) => pathname === path;

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
          <Link href="/dashboard" className={`navItem ${isActive("/dashboard") ? "active" : ""}`}>
            <span className="navIcon">
              <img src="/images/overview.png" alt="Overview" style={{ width: "24px", height: "24px" }} />
            </span>
            <span>Overview</span>
          </Link>
          <Link href="/dashboard/platforms" className={`navItem ${isActive("/dashboard/platforms") ? "active" : ""}`}>
            <span className="navIcon">
              <img src="/images/platform.png" alt="Platforms" style={{ width: "24px", height: "24px" }} />
            </span>
            <span>Platforms</span>
          </Link>
          <Link href="/dashboard/problems" className={`navItem ${isActive("/dashboard/problems") ? "active" : ""}`}>
            <span className="navIcon">
              <img src="/images/problems.png" alt="Problems" style={{ width: "24px", height: "24px" }} />
            </span>
            <span>Problems</span>
          </Link>
          <Link href="/dashboard/contests" className={`navItem ${isActive("/dashboard/contests") ? "active" : ""}`}>
            <span className="navIcon">
              <img src="/images/gym-battles.png" alt="Contests" style={{ width: "24px", height: "24px" }} />
            </span>
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
        {children}
      </main>
    </div>
  );
}
