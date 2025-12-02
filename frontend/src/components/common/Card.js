"use client";
import React from "react";

export default function Card({ children, className = "", hover = true }) {
  const base = "card";
  const classes = [base, hover ? `${base}--hover` : "", className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
