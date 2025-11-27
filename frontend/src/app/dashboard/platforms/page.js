"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import "../dashboard.css";

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const response = await api.listPlatforms();
      const platformsData = Array.isArray(response) ? response : (response?.platforms || []);
      setPlatforms(platformsData);
    } catch (err) {
      console.error("Error fetching platforms:", err);
    }
  };

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
}
