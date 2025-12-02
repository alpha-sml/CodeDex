"use client";
import React from "react";

export default function Table({ headers = [], children }) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
