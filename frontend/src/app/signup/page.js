"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

import "./signup.css";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.signup(formData);
      if (result.message === "Signup successful") {
        router.push("/");
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">
          Sign Up
        </h1>

        {error && (
          <div className="errorMessage">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div>
            <label
              htmlFor="username"
              className="label"
            >
              Username (min 5 characters)
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              minLength={5}
              className="input"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="label"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="input"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="label"
            >
              Password (min 6 characters)
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submitButton"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="loginText">
          Already have an account?{" "}
          <Link href="/login" className="loginLink">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
