"use client";
import React from "react";

export default function Badge({ children, variant = "default" }) {
  const base = "badge";
  const classes = [base, `${base}--${variant}`].join(" ");
  return <span className={classes}>{children}</span>;
}
