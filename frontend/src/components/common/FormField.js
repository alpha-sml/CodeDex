"use client";
import React from "react";

export default function FormField({ label, hint, children }) {
  return (
    <div className="form-group">
      {label ? <label>{label}</label> : null}
      {children}
      {hint ? (
        <small className="field-hint">{hint}</small>
      ) : null}
    </div>
  );
}
