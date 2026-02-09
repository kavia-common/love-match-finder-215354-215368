import React from "react";

/**
 * PRESENTATIONAL COMPONENT
 * A retro-styled card container used across the app.
 */
export default function RetroCard({ children, className = "" }) {
  return <section className={`retro-card ${className}`}>{children}</section>;
}
