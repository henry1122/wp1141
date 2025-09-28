import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './SpeedMatchGame.css';

interface SpeedMatchGameProps {
  isActive: boolean;
  onGameEnd: (score: number) => void;
  onExit: () => void;
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#AB47BC', '#FFD700'];
const shapes = ['●', '■', '▲', '♦', '★', '♠'];

interface Target {
  color: string;
  shape: string;
}

const SpeedMatchGame: React.FC<SpeedMatchGameProps> = ({ isActive, onGameEnd, onExit }) => {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState<Target>({ color: colors[0], shape: shapes[0] });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // 重置遊戲狀態
  const resetGame = () => {
    setTimeLeft(60);
    setScore(0);
    setTarget({ color: colors[0], shape: shapes[0] });
    setGameStarted(false);
    setGameEnded(false);
    // 不重置最高分，保持記錄
  };

  // 生成新目標
  const generateNewTarget = useCallback(() => {
    const newTarget = {
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    };
    setTarget(newTarget);
  }, []);

  // 開始遊戲
  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setTimeLeft(60);
    generateNewTarget();
  }, [generateNewTarget]);

  // 當 isActive 變為 true 時重置遊戲
  useEffect(() => {
    if (isActive) {
      resetGame();
    }
  }, [isActive]);


  // 處理匹配點擊
  const handleMatch = (color: string, shape: string) => {
    if (!gameStarted || gameEnded) return;

    if (color === target.color && shape === target.shape) {
      // 正確匹配
      setScore(prev => prev + 10);
      generateNewTarget();
    } else {
      // 錯誤匹配，扣分
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  // 計時器
  useEffect(() => {
    if (gameStarted && !gameEnded && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted) {
      setGameEnded(true);
      // 更新最高分
      if (score > highScore) {
        setHighScore(score);
      }
      // 不自動調用onGameEnd，讓玩家看到Game Over畫面
    }
  }, [gameStarted, gameEnded, timeLeft, highScore, score]);

  console.log('SpeedMatchGame render:', { isActive, gameStarted, gameEnded });

  if (!isActive) return null;

  return (
    <div className="speed-match-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="speed-match-game" onClick={(e) => e.stopPropagation()}>
        <div className="game-header">
          <h2 className="mini-game-title">
            {language === 'zh' ? '⚡ 快速匹配' : '⚡ Speed Match'}
          </h2>
          <button 
            className="exit-button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Exit button clicked in SpeedMatchGame');
              onExit();
            }}
          >
            ×
          </button>
        </div>

        <div className="game-info">
          <div className="time-display">
            ⏰ {timeLeft}s
          </div>
          <div className="score-display">
            🎯 {score}
          </div>
          <div className="high-score-display">
            {language === 'zh' ? '最高分' : 'High Score'}: {highScore}
          </div>
        </div>


        {!gameStarted && (
          <div className="game-start">
            <h3>{language === 'zh' ? '準備好了嗎？' : 'Ready to Play?'}</h3>
            <p>{language === 'zh' ? '在限時內匹配盡可能多的顏色' : 'Match as many colors as possible within time limit'}</p>
            <button className="start-button" onClick={startGame}>
              {language === 'zh' ? '開始遊戲' : 'Start Game'}
            </button>
          </div>
        )}

        {gameStarted && !gameEnded && (
          <>
            <div className="target-display">
              <h3>{language === 'zh' ? '找到這個組合：' : 'Find this combination:'}</h3>
              <div 
                className="target-item"
                style={{ color: target.color }}
              >
                {target.shape}
              </div>
            </div>

            <div className="match-grid">
              {colors.map(color => 
                shapes.map(shape => (
                  <button
                    key={`${color}-${shape}`}
                    className="match-button"
                    style={{ color }}
                    onClick={() => handleMatch(color, shape)}
                  >
                    {shape}
                  </button>
                ))
              )}
            </div>
          </>
        )}

        {gameEnded && (
          <div className="game-end">
            <h3>{language === 'zh' ? '時間到！' : 'Time\'s Up!'}</h3>
            <p>{language === 'zh' ? '最終分數' : 'Final Score'}: {score}</p>
             <div className="end-buttons">
               <button className="exit-button-full" onClick={onExit}>
                 {language === 'zh' ? '返回選單' : 'Back to Menu'}
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedMatchGame;
