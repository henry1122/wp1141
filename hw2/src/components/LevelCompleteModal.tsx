import React from 'react';
import { LevelConfig } from '../types/levels';
import { useLanguage } from '../contexts/LanguageContext';
import './LevelCompleteModal.css';

interface LevelCompleteModalProps {
  isOpen: boolean;
  currentLevel: LevelConfig;
  nextLevel: LevelConfig | null;
  score: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onMenu: () => void;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  currentLevel,
  nextLevel,
  score,
  onNextLevel,
  onReplay,
  onMenu
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  console.log('LevelCompleteModal rendered', { isOpen, currentLevel, nextLevel, score });

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🌱';
      case 'medium': return '🔥';
      case 'hard': return '⚡';
      case 'super': return '💎';
      case 'god': return '👑';
      default: return '🎮';
    }
  };

  return (
    <div className="level-complete-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="level-complete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="celebration-header">
          <div className="celebration-icon">🎉</div>
          <h2 className="celebration-title">
            {language === 'zh' ? '關卡完成！' : 'Level Complete!'}
          </h2>
          <div className="level-badge">
            <span className="level-icon">{getDifficultyIcon(currentLevel.id)}</span>
            <span className="level-name">
              {language === 'zh' ? currentLevel.name : currentLevel.nameEn}
            </span>
          </div>
          
        </div>

        <div className="completion-stats">
          <div className="stat-item">
            <span className="stat-label">
              {language === 'zh' ? '最終分數' : 'Final Score'}
            </span>
            <span className="stat-value score">{score.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">
              {language === 'zh' ? '目標分數' : 'Target Score'}
            </span>
            <span className="stat-value target">{currentLevel.targetScore.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">
              {language === 'zh' ? '超越目標' : 'Exceeded By'}
            </span>
            <span className="stat-value bonus">
              +{(score - currentLevel.targetScore).toLocaleString()}
            </span>
          </div>
        </div>

        {nextLevel && (
          <div className="next-level-preview">
            <h3 className="next-level-title">
              {language === 'zh' ? '下一個挑戰' : 'Next Challenge'}
            </h3>
            <div className="next-level-card">
              <div className="next-level-icon">
                {getDifficultyIcon(nextLevel.id)}
              </div>
              <div className="next-level-info">
                <h4 className="next-level-name">
                  {language === 'zh' ? nextLevel.name : nextLevel.nameEn}
                </h4>
                <p className="next-level-desc">
                  {language === 'zh' ? nextLevel.description : nextLevel.descriptionEn}
                </p>
                <div className="next-level-target">
                  {language === 'zh' ? '目標' : 'Target'}: {nextLevel.targetScore.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="completion-actions">
          {nextLevel && (
            <button className="action-button primary" onClick={onNextLevel}>
              <span className="button-icon">🚀</span>
              <span>{language === 'zh' ? '挑戰下一關' : 'Next Level'}</span>
            </button>
          )}
          
          <button className="action-button secondary" onClick={onReplay}>
            <span className="button-icon">🔄</span>
            <span>{language === 'zh' ? '重新挑戰' : 'Replay'}</span>
          </button>
          
          <button className="action-button tertiary" onClick={onMenu}>
            <span className="button-icon">🏠</span>
            <span>{language === 'zh' ? '回到主選單' : 'Main Menu'}</span>
          </button>
        </div>

        {!nextLevel && (
          <div className="all-complete-message">
            <div className="master-badge">
              <span className="master-icon">🏆</span>
              <span className="master-text">
                {language === 'zh' ? '恭喜！你已完成所有挑戰！' : 'Congratulations! You\'ve mastered all levels!'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelCompleteModal;
