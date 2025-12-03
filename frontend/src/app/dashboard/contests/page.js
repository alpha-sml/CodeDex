"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import "@/components/styles/common.css";
import "../dashboard.css";

export default function ContestsPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState("all");

  useEffect(() => {
    fetchContests();
  }, [platform]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await api.getContests(platform);
      if (response.success) {
        setContests(response.contests || []);
      }
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch contests");
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <DashboardLayout>
      <header className="dashboardHeader">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <img src="/images/gym-battles.png" alt="Gym Battles" style={{ width: "48px", height: "48px" }} />
          <h1 className="dashboardTitle" style={{ margin: 0 }}>Gym Battles</h1>
        </div>
        <p className="dashboardSubtitle">Upcoming coding contests across platforms</p>
      </header>

      <Card className="mb-4" style={{ padding: "1.5rem" }}>
        <label className="filter-group" style={{ marginBottom: 0 }}>
          <span style={{ fontFamily: "Press Start 2P, cursive", fontSize: "0.75rem", color: "#DC0A2D", marginRight: "1rem" }}>
            Filter Platform:
          </span>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="form-select"
            style={{ display: "inline-block", width: "auto" }}
          >
            <option value="all">All Platforms</option>
            <option value="leetcode">LeetCode</option>
            <option value="codeforces">Codeforces</option>
          </select>
        </label>
      </Card>

      {error && (
        <div className="notice notice--error mb-4">
          {error}
        </div>
      )}

      <section className="contestsSection">
        {loading ? (
          <div className="contestsCard">
            <p className="emptyState">Loading contests...</p>
          </div>
        ) : contests.length === 0 ? (
          <div className="contestsCard">
            <p className="emptyState">
              No upcoming contests at the moment. Check back later for new gym battles!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {contests.map((contest, index) => (
              <Card key={index} style={{ padding: "2rem" }}>
                <div className="space-between" style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "3px solid #000000", alignItems: "start" }}>
                  <h3 style={{
                    fontFamily: "Press Start 2P, cursive",
                    fontSize: "1rem",
                    color: "#DC0A2D",
                    margin: 0,
                    flex: 1,
                    lineHeight: "1.6"
                  }}>
                    {contest.name}
                  </h3>
                  <Badge variant="platform" style={{ marginLeft: "1rem", textTransform: "uppercase" }}>
                    {contest.platform}
                  </Badge>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <p style={{
                    fontFamily: "Press Start 2P, cursive",
                    fontSize: "0.7rem",
                    color: "#2B2B2B",
                    margin: "0.75rem 0",
                    letterSpacing: "0.5px"
                  }}>
                    📅 Starts: {formatDate(contest.startTime)}
                  </p>
                  <p style={{
                    fontFamily: "Press Start 2P, cursive",
                    fontSize: "0.7rem",
                    color: "#2B2B2B",
                    margin: "0.75rem 0",
                    letterSpacing: "0.5px"
                  }}>
                    ⏱️ Duration: {formatDuration(contest.duration)}
                  </p>
                </div>

                <Button
                  onClick={() => window.open(contest.url, "_blank")}
                  variant="primary"
                >
                  View Contest
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
