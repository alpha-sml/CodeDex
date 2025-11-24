"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import "./home.css";

export default function Home() {
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
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <p className="loadingText">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="main">
        <div className="contentWrapper">
          <h1 className="title">
            CodeDex
          </h1>

          {user ? (
            <div className="userProfile">
              <div className="profileCard">
                <h2 className="welcomeText">
                  Welcome, {user.username}!
                </h2>
                <div className="userDetails">
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>

                </div>
              </div>
              <button
                onClick={handleLogout}
                className="logoutButton"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="guestContainer">
              <p className="guestText">
                Please login or sign up to continue.
              </p>
              <div className="authButtons">
                <Link
                  href="/login"
                  className="loginLink"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="signupLink"
                >
                  signup
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
