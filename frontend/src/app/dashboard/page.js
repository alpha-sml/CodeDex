"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import "./dashboard.css";
import Button from "@/components/common/Button";
import StatCard from "@/components/common/StatCard";
import "@/components/styles/common.css";

export default function DashboardPage() {
  const [platforms, setPlatforms] = useState([]);
  const [stats, setStats] = useState({
    totalProblems: 0,
    streak: 0,
    platformsConnected: 0
  });
  const [syncing, setSyncing] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch platforms
      const platformsResponse = await api.listPlatforms();
      const platformsData = Array.isArray(platformsResponse) ? platformsResponse : (platformsResponse?.platforms || []);
      setPlatforms(platformsData);
      
      const connectedPlatforms = platformsData.filter(p => p.username);
      
      // Fetch aggregated stats
      let totalProblems = 0;
      try {
        const statsResponse = await api.getStats();
        if (statsResponse?.stats) {
          totalProblems = statsResponse.stats.totalProblems || 0;
        }
      } catch (statsErr) {
        console.log("Stats not available yet, calculating from platforms");
        // Fallback: Calculate from individual platforms
        platformsData.forEach(platform => {
          if (platform.stats) {
            if (platform.stats.totalSolved) {
              totalProblems += platform.stats.totalSolved;
            } else if (platform.stats.breakdown) {
              const breakdown = platform.stats.breakdown;
              totalProblems += (breakdown.easy || 0) + (breakdown.medium || 0) + (breakdown.hard || 0);
            }
          }
        });
      }
      
      setStats({
        totalProblems: totalProblems,
        streak: 0, // Coming soon
        platformsConnected: connectedPlatforms.length
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleSyncStats = async () => {
    setSyncing(true);
    try {
      const platformsResponse = await api.listPlatforms();
      const platformsData = Array.isArray(platformsResponse) ? platformsResponse : (platformsResponse?.platforms || []);
      
      const connectedPlatforms = platformsData.filter(p => p.username);
      
      if (connectedPlatforms.length === 0) {
        showNotification("No platforms connected to sync!");
        setSyncing(false);
        return;
      }

      // Sync each connected platform
      const syncPromises = connectedPlatforms.map(platform => 
        api.syncPlatform(platform.platform)
      );
      
      await Promise.all(syncPromises);
      
      // Refresh dashboard data
      await fetchDashboardData();
      
      showNotification("All platforms synced successfully!");
    } catch (error) {
      showNotification("Failed to sync platforms");
      console.error("Sync error:", error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-between mb-4">
        <header className="dashboardHeader no-margin">
          <h1 className="dashboardTitle">Trainer Dashboard</h1>
          <p className="dashboardSubtitle">Welcome back, Trainer!</p>
        </header>
        
        <Button onClick={handleSyncStats} disabled={syncing} loading={syncing}>
          🔄 Sync Stats
        </Button>
      </div>

      {notification && (
        <div className="notice mb-4">{notification}</div>
      )}

        <section className="statsSection">
          <div className="statsGrid">
            <StatCard icon="🎯" label="Problems Caught" value={stats.totalProblems} />
            <StatCard icon="🔥" label="Day Streak" value="Coming Soon" />
            <StatCard icon="🎮" label="Platforms Connected" value={stats.platformsConnected} />
          </div>
        </section>

        <section className="overviewGrid">
          <div className="heatmapCard">
            <h2 className="cardTitle">Catch Calendar</h2>
            <div className="heatmapContainer">
              <p className="emptyState">
                Coming Soon! Track your daily coding activity here.
              </p>
            </div>
          </div>

          <div className="recentCatchesCard">
            <h2 className="cardTitle">Recent Catches</h2>
            <div className="catchesList">
              <p className="emptyState">
                Coming Soon! Your recently solved problems will appear here.
              </p>
            </div>
          </div>
        </section>
    </DashboardLayout>
  );
}
