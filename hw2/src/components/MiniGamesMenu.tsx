import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './MiniGamesMenu.css';

interface MiniGame {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  estimatedTimeEn: string;
}

const miniGames: MiniGame[] = [
  {
    id: 'color_memory',
    title: '色彩記憶',
    titleEn: 'Color Memory',
    description: '記住顏色序列並重複它們',
    descriptionEn: 'Remember color sequences and repeat them',
    icon: '🧠',
    difficulty: 'Easy',
    estimatedTime: '2-3分鐘',
    estimatedTimeEn: '2-3 minutes',
  },
  {
    id: 'speed_match',
    title: '快速匹配',
    titleEn: 'Speed Match',
    description: '在限時內匹配盡可能多的顏色',
    descriptionEn: 'Match as many colors as possible within time limit',
    icon: '⚡',
    difficulty: 'Medium',
    estimatedTime: '1-2分鐘',
    estimatedTimeEn: '1-2 minutes',
  },
  {
    id: 'time_challenge',
    title: '時間挑戰',
    titleEn: 'Time Challenge',
    description: '在極短時間內完成複雜任務',
    descriptionEn: 'Complete complex tasks in very short time',
    icon: '⏱️',
    difficulty: 'Hard',
    estimatedTime: '30秒-1分鐘',
    estimatedTimeEn: '30s-1 minute',
  },
];

interface MiniGamesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onGameSelect: (gameId: string) => void;
}

const MiniGamesMenu: React.FC<MiniGamesMenuProps> = ({ isOpen, onClose, onGameSelect }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '🟢';
      case 'Medium': return '🟡';
      case 'Hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="mini-games-overlay" onClick={onClose}>
      <div className="mini-games-panel" onClick={(e) => e.stopPropagation()}>
        <div className="mini-games-header">
          <h2 className="mini-games-title">
            {language === 'zh' ? '小遊戲選擇' : 'Mini Games'}
          </h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="mini-games-grid">
          {miniGames.map((game, index) => (
            <div
              key={game.id}
              className="mini-game-card"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mini game selected:', game.id);
                onGameSelect(game.id);
              }}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="game-icon">{game.icon}</div>
              
              <div className="game-info">
                <h3 className="mini-game-title">
                  {language === 'zh' ? game.title : game.titleEn}
                </h3>
                <p className="game-description">
                  {language === 'zh' ? game.description : game.descriptionEn}
                </p>
                
                <div className="game-meta">
                  <div className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(game.difficulty) }}>
                    <span className="difficulty-icon">{getDifficultyIcon(game.difficulty)}</span>
                    <span>{game.difficulty}</span>
                  </div>
                  <div className="time-estimate">
                    <span className="time-icon">⏰</span>
                    <span>{language === 'zh' ? game.estimatedTime : game.estimatedTimeEn}</span>
                  </div>
                </div>
              </div>

              <div className="card-glow"></div>
              
              {/* 添加明顯的點擊提示 */}
              <div className="click-hint">
                {language === 'zh' ? '點擊開始' : 'Click to Play'}
              </div>
            </div>
          ))}
        </div>

        <div className="mini-games-footer">
          <p className="footer-text">
            {language === 'zh' 
              ? '選擇一個小遊戲來放鬆一下，或者練習你的技能！' 
              : 'Choose a mini-game to relax or practice your skills!'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniGamesMenu;
