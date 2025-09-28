import React from 'react';
import { Difficulty, LEVEL_CONFIGS, canSelectLevel } from '../types/levels';
import { useLanguage } from '../contexts/LanguageContext';
import './LevelSelector.css';

interface LevelSelectorProps {
  isOpen: boolean;
  currentLevel: Difficulty;
  highScore: number;
  onLevelSelect: (level: Difficulty) => void;
  onClose: () => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  isOpen,
  currentLevel,
  highScore,
  onLevelSelect,
  onClose
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const getDifficultyIcon = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY: return '🌱';
      case Difficulty.MEDIUM: return '🔥';
      case Difficulty.HARD: return '⚡';
      case Difficulty.SUPER: return '💎';
      case Difficulty.GOD: return '👑';
      default: return '🎮';
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY: return '#4ade80';
      case Difficulty.MEDIUM: return '#f97316';
      case Difficulty.HARD: return '#3b82f6';
      case Difficulty.SUPER: return '#8b5cf6';
      case Difficulty.GOD: return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="level-selector-overlay" onClick={onClose}>
      <div className="level-selector-panel" onClick={(e) => e.stopPropagation()}>
        <div className="level-selector-header">
          <h2 className="level-selector-title">選擇難度等級</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="level-grid">
          {Object.values(LEVEL_CONFIGS).map((level) => {
            const unlocked = canSelectLevel(level.id, highScore, currentLevel);
            const isCurrent = level.id === currentLevel;

            return (
              <div
                key={level.id}
                className={`level-card ${unlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
                onClick={() => {
                  console.log('Level card clicked:', { level: level.id, unlocked, highScore });
                  if (unlocked) {
                    onLevelSelect(level.id);
                  }
                }}
                style={{
                  '--level-color': getDifficultyColor(level.id),
                  background: unlocked ? level.background.gradient : 'var(--color-surface)',
                } as React.CSSProperties}
              >
                <div className="level-icon">
                  {unlocked ? getDifficultyIcon(level.id) : '🔒'}
                </div>
                
                <div className="level-info">
                  <h3 className="level-name">
                    {language === 'zh' ? level.name : level.nameEn}
                  </h3>
                  <p className="level-description">
                    {language === 'zh' ? level.description : level.descriptionEn}
                  </p>
                  
                  {unlocked ? (
                    <div className="level-stats">
                      <div className="stat">
                        <span className="stat-label">目標分數:</span>
                        <span className="stat-value">{level.targetScore.toLocaleString()}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">掉落速度:</span>
                        <span className="stat-value">{(level.dropInterval / 1000).toFixed(1)}s</span>
                      </div>
                    </div>
                  ) : (
                    <div className="unlock-requirement">
                      <span>需要 {level.unlockScore.toLocaleString()} 分解鎖</span>
                    </div>
                  )}
                </div>

                {isCurrent && (
                  <div className="current-indicator">
                    <span>當前等級</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="level-selector-footer">
          <div className="high-score-display">
            <span>最高分: {highScore.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;
