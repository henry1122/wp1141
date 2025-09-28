import React from 'react';
import { GameStats as GameStatsType } from '../types/game';
import { useLanguage } from '../contexts/LanguageContext';
import './GameStats.css';

interface GameStatsProps {
  stats: GameStatsType;
}

const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  const { t } = useLanguage();
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-stats">
      <div className="stats-grid">
        <div className="stat-item score">
          <div className="stat-label">{t.score}</div>
          <div className="stat-value">{stats.score.toLocaleString()}</div>
        </div>
        
        <div className="stat-item level">
          <div className="stat-label">{t.level}</div>
          <div className="stat-value">{stats.level}</div>
        </div>
        
        <div className="stat-item combo">
          <div className="stat-label">{t.combo}</div>
          <div className={`stat-value ${stats.combo > 1 ? 'combo-active' : ''}`}>
            {stats.combo > 1 ? `${stats.combo}x` : '-'}
          </div>
        </div>
        
        <div className="stat-item lines">
          <div className="stat-label">{t.linesCleared}</div>
          <div className="stat-value">{stats.linesCleared}</div>
        </div>
        
        <div className="stat-item time">
          <div className="stat-label">Time</div>
          <div className="stat-value">{formatTime(stats.timeElapsed)}</div>
        </div>
      </div>
      
      {stats.combo > 1 && (
        <div className="combo-indicator">
          <span className="combo-text">COMBO x{stats.combo}!</span>
        </div>
      )}
    </div>
  );
};

export default GameStats;
