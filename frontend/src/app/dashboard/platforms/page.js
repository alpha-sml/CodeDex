"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import "../dashboard.css";

export default function PlatformsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await api.getProfile();
      if (result.user) {
        setUser(result.user);
        await fetchPlatforms();
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await api.listPlatforms();
      const platformsData = Array.isArray(response) ? response : (response?.platforms || []);
      setPlatforms(platformsData);
    } catch (err) {
      console.error("Error fetching platforms:", err);
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
          <Link href="/dashboard/platforms" className="navItem active">
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
          <h1 className="dashboardTitle">Your Platforms</h1>
          <p className="dashboardSubtitle">Connect your coding platforms to track progress</p>
        </header>

        <section className="platformsSection">
          <div className="platformsGrid">
            <div className="platformCard">
              <div className="platformHeader">
                <img src="/images/leetcode-logo.png" alt="LeetCode" className="platformLogo" />
                <h3 className="platformName">LeetCode</h3>
              </div>
              <div className="platformBody">
                {platforms.find(p => p.platformName === "LeetCode")?.username ? (
                  <>
                    <p className="platformStatus connected">✓ Connected</p>
                    <p className="platformUsername">
                      @{platforms.find(p => p.platformName === "LeetCode").username}
                    </p>
                    <button className="disconnectButton">Disconnect</button>
                  </>
                ) : (
                  <>
                    <p className="platformStatus notConnected">Not Connected</p>
                    <button className="connectButton">Connect Account</button>
                  </>
                )}
              </div>
            </div>

            <div className="platformCard">
              <div className="platformHeader">
                <img src="/images/codeforces-logo.png" alt="Codeforces" className="platformLogo" />
                <h3 className="platformName">Codeforces</h3>
              </div>
              <div className="platformBody">
                {platforms.find(p => p.platformName === "Codeforces")?.username ? (
                  <>
                    <p className="platformStatus connected">✓ Connected</p>
                    <p className="platformUsername">
                      @{platforms.find(p => p.platformName === "Codeforces").username}
                    </p>
                    <button className="disconnectButton">Disconnect</button>
                  </>
                ) : (
                  <>
                    <p className="platformStatus notConnected">Not Connected</p>
                    <button className="connectButton">Connect Account</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
