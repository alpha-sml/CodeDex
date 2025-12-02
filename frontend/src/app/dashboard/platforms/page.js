"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import ConnectPlatformModal from "@/components/ConnectPlatformModal";
import "../dashboard.css";

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [notification, setNotification] = useState("");

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

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleConnectClick = (platformName) => {
    setSelectedPlatform(platformName.toLowerCase());
    setModalOpen(true);
  };

  const handleConnect = async (platform, username) => {
    try {
      await api.addPlatform({ platform, username });
      showNotification(`${platform} connected successfully!`);
      fetchPlatforms();
    } catch (error) {
      throw error;
    }
  };

  const handleDisconnect = async (platformName) => {
    if (!confirm(`Are you sure you want to disconnect ${platformName}?`)) return;
    
    try {
      await api.removePlatform(platformName.toLowerCase());
      showNotification(`${platformName} disconnected successfully!`);
      fetchPlatforms();
    } catch (error) {
      showNotification(`Failed to disconnect ${platformName}`);
    }
  };

  const getPlatform = (name) => {
    return platforms.find(p => p.platform?.toLowerCase() === name.toLowerCase());
  };

  return (
    <DashboardLayout>
      <header className="dashboardHeader">
        <h1 className="dashboardTitle">Your Platforms</h1>
        <p className="dashboardSubtitle">Connect your coding platforms to track progress</p>
      </header>

      {notification && (
        <div style={{
          background: 'linear-gradient(135deg, #00FF00 0%, #00CC00 100%)',
          color: '#000000',
          padding: '1rem',
          border: '3px solid #000000',
          borderRadius: '8px',
          fontFamily: 'Press Start 2P, cursive',
          fontSize: '0.6rem',
          marginBottom: '1rem',
          boxShadow: '3px 3px 0px #2B2B2B',
          textAlign: 'center'
        }}>
          {notification}
        </div>
      )}

      <section className="platformsSection">
        <div className="platformsGrid">
          <div className="platformCard">
            <div className="platformHeader">
              <img src="/images/leetcode-logo.png" alt="LeetCode" className="platformLogo" />
              <h3 className="platformName">LeetCode</h3>
            </div>
            <div className="platformBody">
              {getPlatform("leetcode")?.username ? (
                <>
                  <p className="platformStatus connected">✓ Connected</p>
                  <p className="platformUsername">
                    @{getPlatform("leetcode").username}
                  </p>
                  <button 
                    className="disconnectButton"
                    onClick={() => handleDisconnect("leetcode")}
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <>
                  <p className="platformStatus notConnected">Not Connected</p>
                  <button 
                    className="connectButton"
                    onClick={() => handleConnectClick("leetcode")}
                  >
                    Connect Account
                  </button>
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
              {getPlatform("codeforces")?.username ? (
                <>
                  <p className="platformStatus connected">✓ Connected</p>
                  <p className="platformUsername">
                    @{getPlatform("codeforces").username}
                  </p>
                  <button 
                    className="disconnectButton"
                    onClick={() => handleDisconnect("codeforces")}
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <>
                  <p className="platformStatus notConnected">Not Connected</p>
                  <button 
                    className="connectButton"
                    onClick={() => handleConnectClick("codeforces")}
                  >
                    Connect Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <ConnectPlatformModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        platform={selectedPlatform}
        onConnect={handleConnect}
      />
    </DashboardLayout>
  );
}
