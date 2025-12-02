"use client";
import React from "react";

export default function Button({
  children,
  onClick,
  disabled,
  loading,
  variant = "primary", // primary | secondary | danger | ghost
  size = "md",
  type = "button",
  className = "",
}) {
  const base = "btn";
  const classes = [
    base,
    `${base}--${variant}`,
    `${base}--${size}`,
    disabled ? `${base}--disabled` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {loading ? (
        <span className="btn__spinner" aria-hidden>⟳</span>
      ) : null}
      <span className="btn__label">{loading ? "" : children}</span>
    </button>
  );
}
