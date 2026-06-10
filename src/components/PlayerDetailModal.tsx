import React from 'react';
import type { ProcessedPlayer } from '../services/fplService';
import { User, ShieldAlert, Award, Star, Activity, DollarSign, Users } from 'lucide-react';

interface PlayerDetailModalProps {
  player: ProcessedPlayer | null;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player }) => {
  if (!player) {
    return (
      <div className="glass-card detail-sidebar" style={{ minHeight: '340px' }}>
        <div className="no-player-selected">
          <User size={48} strokeWidth={1} style={{ opacity: 0.4 }} />
          <div>
            <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>No Player Selected</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click on a player in the chart or leaderboard table to load their full statistical analysis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'a':
        return <span style={{ color: 'var(--color-success)', fontSize: '0.8rem', fontWeight: 600 }}>● Available</span>;
      case 'i':
        return <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', fontWeight: 600 }}>● Injured</span>;
      case 's':
        return <span style={{ color: 'var(--color-warning)', fontSize: '0.8rem', fontWeight: 600 }}>● Suspended</span>;
      default:
        return <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>● Unavailable</span>;
    }
  };

  // Safe division to prevent dividing by 0
  const getIctPercent = (ict: number) => Math.min(100, (ict / 360) * 100);
  const getSelectedPercent = (sel: number) => Math.min(100, sel);

  return (
    <div className="glass-card detail-sidebar" style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="detail-header">
        <span className="detail-team-badge">{player.teamName}</span>
        <span className="detail-pos-badge">{player.positionName}</span>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem', color: '#fff' }}>
          {player.firstName} {player.lastName}
        </h3>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {getStatusBadge(player.status)}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {player.id}</span>
        </div>
        {player.news && (
          <div className="notification-bar error" style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
            <ShieldAlert size={14} style={{ flexShrink: 0 }} />
            <span>{player.news}</span>
          </div>
        )}
      </div>

      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Value Stats</h4>
      <div className="detail-grid">
        <div className="detail-stat-box">
          <span className="label">
            <DollarSign size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
            Cost
          </span>
          <span className="value" style={{ color: 'var(--color-secondary)' }}>£{player.cost.toFixed(1)}m</span>
        </div>
        <div className="detail-stat-box">
          <span className="label">
            <Star size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
            Total Points
          </span>
          <span className="value">{player.totalPoints}</span>
        </div>
        <div className="detail-stat-box">
          <span className="label">
            <Activity size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
            Points / Game
          </span>
          <span className="value" style={{ color: 'var(--color-accent)' }}>{player.pointsPerGame.toFixed(1)}</span>
        </div>
        <div className="detail-stat-box">
          <span className="label">
            <Award size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
            Points / Million
          </span>
          <span className="value">{player.value.toFixed(1)}</span>
        </div>
      </div>

      {/* TODO: Show different statistics for goalkeepers & defenders */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '0.25rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Season Stats</h4>
        <div className="detail-grid">
          <div className="detail-stat-box">
            <span className="label">Minutes Played</span>
            <span className="value">{player.minutes}</span>
          </div>
          <div className="detail-stat-box">
            <span className="label">Goals Scored</span>
            <span className="value" style={{ color: 'var(--color-success)' }}>{player.goals}</span>
          </div>
          <div className="detail-stat-box">
            <span className="label">Assists</span>
            <span className="value" style={{ color: 'var(--color-secondary)' }}>{player.assists}</span>
          </div>
          <div className="detail-stat-box">
            <span className="label">Clean Sheets</span>
            <span className="value">{player.cleanSheets}</span>
          </div>
          <div className="detail-stat-box">
            <span className="label">Yellow / Red</span>
            <span className="value">
              <span style={{ color: 'var(--color-warning)' }}>{player.yellowCards}</span>
              {' / '}
              <span style={{ color: 'var(--color-danger)' }}>{player.redCards}</span>
            </span>
          </div>
          <div className="detail-stat-box">
            <span className="label">ICT Index</span>
            <span className="value" style={{ color: 'var(--color-primary)' }}>{player.ictIndex.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>Performance Metrics</h4>

        {/* Ownership */}
        <div className="detail-progress-section">
          <div className="progress-label-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users size={12} />
              Ownership (Selected by)
            </span>
            <span style={{ fontWeight: 600 }}>{player.selectedByPercent}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${getSelectedPercent(player.selectedByPercent)}%`, background: 'var(--color-secondary)' }}
            ></div>
          </div>
        </div>

        {/* ICT Index */}
        <div className="detail-progress-section">
          <div className="progress-label-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Activity size={12} />
              ICT Index Score
            </span>
            <span style={{ fontWeight: 600 }}>{player.ictIndex.toFixed(1)}</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${getIctPercent(player.ictIndex)}%`, background: 'var(--color-primary)' }}
            ></div>
          </div>
        </div>

        {/* Value */}
        {/* <div className="detail-progress-section">
          <div className="progress-label-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Award size={12} />
              Points Per Million Value
            </span>
            <span style={{ fontWeight: 600 }}>{player.value.toFixed(1)}</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${getValuePercent(player.value)}%`, background: 'var(--color-accent)' }}
            ></div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
