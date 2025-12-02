"use client";
import React from "react";
import Card from "./Card";

export default function StatCard({ label, value, icon, accent = "red" }) {
  return (
    <Card className={`stat stat--${accent}`}>
      {icon ? <div className="stat__icon">{icon}</div> : null}
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </Card>
  );
}
