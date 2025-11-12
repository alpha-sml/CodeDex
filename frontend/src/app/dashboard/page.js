"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/dashboard`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        setData(result);
      })
      .catch(() => setData({ message: "Network error" }));
  }, [router]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
