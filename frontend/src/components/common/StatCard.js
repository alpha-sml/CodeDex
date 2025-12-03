"use client";
import React from "react";
import Card from "./Card";

export default function StatCard({ label, value, icon, iconSrc, accent = "red" }) {
  return (
    <Card className={`stat stat--${accent}`}>
      {iconSrc ? (
        <div className="stat__icon">
          <img src={iconSrc} alt={label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      ) : icon ? (
        <div className="stat__icon">{icon}</div>
      ) : null}
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </Card>
  );
}
