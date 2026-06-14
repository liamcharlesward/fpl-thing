import React from 'react';
import type { ProcessedPlayer } from '../services/fplService';
import { LuShieldAlert, LuAward, LuStar, LuActivity, LuPoundSterling, LuClock1, LuShield, LuX } from 'react-icons/lu';
import { StatBox } from './StatBox';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './Badge';
import { GiGoalKeeper, GiSoccerField, GiSoccerKick } from 'react-icons/gi';

interface PlayerDetailPanelProps {
  player: ProcessedPlayer | null;
  onClose: () => void;
}

export const PlayerDetailPanel: React.FC<PlayerDetailPanelProps> = ({ player, onClose }) => {
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

  const getPositionBadge = (position: string) => {
    switch (position) {
      case 'FWD':
        return <Badge colour='accent' text='Forward' icon={GiSoccerKick} />
      case 'MID':
        return <Badge colour='primary' text='Midfielder' icon={GiSoccerField} />
      case 'DEF':
        return <Badge colour='success' text='Defender' icon={LuShield} />
      case 'GKP':
        return <Badge colour='secondary' text='Goalkeeper' icon={GiGoalKeeper} />
    }
  };

  const getPositionSpecificStats = (position: string) => {
    //  TODO: Implement position-specific statistics
    switch (position) {
      case 'FWD':
      case 'MID':
        // ATTACKING / MIDFIELD STATISTICS
        return <></>
      case 'DEF':
        // DEFENSIVE STATISTICS
        return <></>
      case 'GKP':
        // GOALKEEPING STATISTICS
        return <></>
    }
  };

  return (
    <AnimatePresence>
      {player && (
        <motion.div className="glass-card detail-sidebar"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.25 },
            opacity: { duration: 0.25 },
          }}>
          <div className="detail-header" id='detail-header'>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                color: '#fff',
              }}>
                <span style={{ fontWeight: 400 }}>{player.firstName}</span> <span style={{ fontWeight: 700 }}>{player.lastName}</span>
              </h3>
              <span style={{ cursor: 'pointer' }} onClick={onClose}><LuX /></span>
            </div>
            <div style={{
              marginTop: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {/* TODO: Add colours for team names */}
                <Badge colour='primary' text={player.teamName} />
                {getPositionBadge(player.positionShort)}
                {getStatusBadge(player.status)}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>FPL Asset ID: {player.id}</span>
            </div>
            {player.news && (
              <div className="notification-bar error" style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
                <LuShieldAlert size={14} style={{ flexShrink: 0 }} />
                <span>{player.news}</span>
              </div>
            )}
          </div>

          <div id="stats">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '1rem'
            }}>
              {/* Generic statistics relevant to all players */}
              <StatBox icon={LuPoundSterling} label="Cost" value={`£${player.cost.toFixed(1)}m`} />
              <StatBox icon={LuStar} label="Total Points" value={player.totalPoints.toString()} />
              <StatBox icon={LuActivity} label="Points / Match" value={player.pointsPerGame.toFixed(1)} />
              <StatBox icon={LuAward} label="Points / Million" value={player.value.toFixed(1)} />
              <StatBox icon={LuClock1} label="Minutes Played" value={player.minutes.toString()} />
              {/* Get statistics relevant to player position */}
              {getPositionSpecificStats(player.positionShort)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence >
  );
};
