import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GameStats } from '../types/game';
import { Difficulty } from '../types/levels';
import './VictoryPage.css';

interface VictoryPageProps {
  isVisible: boolean;
  completedLevel: Difficulty;
  finalStats: GameStats;
  onContinue: () => void;
  onMainMenu: () => void;
}

const VictoryPage: React.FC<VictoryPageProps> = ({
  isVisible,
  completedLevel,
  finalStats,
  onContinue,
  onMainMenu
}) => {
  const { language } = useLanguage();
  const [showStats, setShowStats] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // 延遲顯示統計和按鈕
      setTimeout(() => setShowStats(true), 1000);
      setTimeout(() => setShowButtons(true), 2000);
    } else {
      setShowStats(false);
      setShowButtons(false);
    }
  }, [isVisible]);

  const getLevelTitle = (level: Difficulty) => {
    const titles = {
      [Difficulty.EASY]: { zh: '初心者大師', en: 'Beginner Master' },
      [Difficulty.MEDIUM]: { zh: '進階征服者', en: 'Advanced Conqueror' },
      [Difficulty.HARD]: { zh: '專家級英雄', en: 'Expert Hero' },
      [Difficulty.SUPER]: { zh: '超級傳奇', en: 'Super Legend' },
      [Difficulty.GOD]: { zh: '神級至尊', en: 'Divine Master' },
    };
    return language === 'zh' ? titles[level].zh : titles[level].en;
  };

  const getLevelIcon = (level: Difficulty) => {
    const icons = {
      [Difficulty.EASY]: '🌱',
      [Difficulty.MEDIUM]: '🔥',
      [Difficulty.HARD]: '⚡',
      [Difficulty.SUPER]: '💎',
      [Difficulty.GOD]: '👑',
    };
    return icons[level];
  };

  const getVictoryMessage = (level: Difficulty) => {
    const messages = {
      [Difficulty.EASY]: {
        zh: '恭喜你踏出了第一步！繼續挑戰更高的難度吧！',
        en: 'Congratulations on your first step! Challenge higher difficulties!'
      },
      [Difficulty.MEDIUM]: {
        zh: '你已經掌握了基本技巧！準備好面對更大的挑戰了嗎？',
        en: 'You\'ve mastered the basics! Ready for bigger challenges?'
      },
      [Difficulty.HARD]: {
        zh: '真正的高手！你的策略思維令人印象深刻！',
        en: 'A true expert! Your strategic thinking is impressive!'
      },
      [Difficulty.SUPER]: {
        zh: '超凡入聖！你已經達到了傳奇級別的技能！',
        en: 'Transcendent! You\'ve reached legendary skill levels!'
      },
      [Difficulty.GOD]: {
        zh: '神級大師！你已經征服了所有挑戰，成為真正的色彩連鎖反應之神！',
        en: 'Divine Master! You\'ve conquered all challenges and become the true God of Color Chain Reaction!'
      },
    };
    return language === 'zh' ? messages[level].zh : messages[level].en;
  };

  if (!isVisible) return null;

  return (
    <div className="victory-page-overlay">
      <div className="victory-page">
        {/* 主要慶祝區域 */}
        <div className="victory-celebration">
          <div className="victory-icon-container">
            <div className="victory-icon">{getLevelIcon(completedLevel)}</div>
            <div className="victory-crown">👑</div>
          </div>
          
          <h1 className="victory-title">
            {completedLevel === Difficulty.GOD 
              ? (language === 'zh' ? '🎉 YOU BEAT THE GAME! 🎉' : '🎉 YOU BEAT THE GAME! 🎉')
              : (language === 'zh' ? '恭喜通關！' : 'VICTORY!')
            }
          </h1>
          
          <h2 className="victory-subtitle">
            {getLevelTitle(completedLevel)}
          </h2>
          
          {completedLevel === Difficulty.GOD && (
            <div className="ultimate-victory">
              <div className="ultimate-text">
                {language === 'zh' ? '🏆 終極大師 🏆' : '🏆 ULTIMATE MASTER 🏆'}
              </div>
              <div className="god-message">
                {language === 'zh' 
                  ? '你已經征服了所有挑戰，成為真正的色彩連鎖反應之神！' 
                  : 'You have conquered all challenges and become the true God of Color Chain Reaction!'
                }
              </div>
            </div>
          )}
          
          <p className="victory-message">
            {getVictoryMessage(completedLevel)}
          </p>
        </div>

        {/* 統計展示 */}
        {showStats && (
          <div className="victory-stats-section">
            <h3 className="stats-title">
              {language === 'zh' ? '通關統計' : 'Victory Stats'}
            </h3>
            
            <div className="victory-stats-grid">
              <div className="victory-stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <div className="stat-label">
                    {language === 'zh' ? '最終分數' : 'Final Score'}
                  </div>
                  <div className="stat-value score">
                    {finalStats.score.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="victory-stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <div className="stat-label">
                    {language === 'zh' ? '完成時間' : 'Completion Time'}
                  </div>
                  <div className="stat-value time">
                    {Math.floor(finalStats.timeElapsed / 60)}:{(finalStats.timeElapsed % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
              
              <div className="victory-stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <div className="stat-label">
                    {language === 'zh' ? '最高連擊' : 'Best Combo'}
                  </div>
                  <div className="stat-value combo">
                    {finalStats.combo}x
                  </div>
                </div>
              </div>
              
              <div className="victory-stat-card">
                <div className="stat-icon">🧹</div>
                <div className="stat-info">
                  <div className="stat-label">
                    {language === 'zh' ? '清除行數' : 'Lines Cleared'}
                  </div>
                  <div className="stat-value lines">
                    {finalStats.linesCleared}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 行動按鈕 */}
        {showButtons && (
          <div className="victory-actions">
            <button className="victory-button primary" onClick={onContinue}>
              <span className="button-icon">🚀</span>
              <span>
                {language === 'zh' ? '繼續挑戰' : 'Continue Challenge'}
              </span>
            </button>
            
            <button className="victory-button secondary" onClick={onMainMenu}>
              <span className="button-icon">🏠</span>
              <span>
                {language === 'zh' ? '回到主選單' : 'Main Menu'}
              </span>
            </button>
          </div>
        )}

        {/* 背景慶祝效果 */}
        <div className="victory-fireworks">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="firework"
              style={{
                '--delay': `${i * 0.3}s`,
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VictoryPage;
