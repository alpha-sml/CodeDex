"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (!token) {
      router.push("/login");
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {username && <p>Welcome, {username}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
