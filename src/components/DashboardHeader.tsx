import React from "react";
import { LuTrendingUp, LuUsers, LuActivity } from "react-icons/lu";

interface DashboardHeaderProps {
  isMock: boolean;
  totalCount: number;
  highestPpgName: string;
  highestPpgValue: number;
  avgPpg: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalCount,
  highestPpgName,
  highestPpgValue,
  avgPpg,
}) => {
  return (
    <div className="glass-card flex flex-col gap-6">
      <div className="header-wrapper">
        <div className="brand-section">
          <div className="brand-logo">
            <LuActivity size={24} color="#fff" />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: "1.75rem", fontWeight: 800 }}>
              FPL StatViewer
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Points Per Match & Value Tracker</p>
          </div>
        </div>

        <div className="stats-grid" style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem" }}>
          <div className="stat-item">
            <div className="stat-icon">
              <LuUsers size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Players Displayed</span>
              <span className="stat-value">{totalCount}</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon" style={{ color: "var(--color-accent)", background: "rgba(236, 72, 153, 0.15)" }}>
              <LuTrendingUp size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Highest Points/Match</span>
              <span className="stat-value" style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                {highestPpgName}{" "}
                <span style={{ color: "var(--color-accent)", fontWeight: 800 }}>({highestPpgValue.toFixed(1)})</span>
              </span>
            </div>
          </div>

          <div className="stat-item">
            <div
              className="stat-icon"
              style={{ color: "var(--color-secondary)", background: "rgba(6, 182, 212, 0.15)" }}
            >
              <LuActivity size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Average Points/Match</span>
              <span className="stat-value">{avgPpg.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
