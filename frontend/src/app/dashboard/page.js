"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import "./dashboard.css";

export default function DashboardPage() {
  const [platforms, setPlatforms] = useState([]);
  const [stats, setStats] = useState({
    totalProblems: 0,
    streak: 0,
    platformsConnected: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  return (
    <DashboardLayout>
      <header className="dashboardHeader">
        <h1 className="dashboardTitle">Trainer Dashboard</h1>
        <p className="dashboardSubtitle">Welcome back, Trainer!</p>
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
    </DashboardLayout>
  );
}
