import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './TimeChallengeGame.css';

interface TimeChallengeGameProps {
  isActive: boolean;
  onGameEnd: (score: number) => void;
  onExit: () => void;
}

// 生成隨機的勾勾位置
const generateRandomTargets = () => {
  const targetCount = Math.floor(Math.random() * 4) + 6; // 6-9個勾勾
  const targets = [];
  const usedPositions = new Set();
  
  while (targets.length < targetCount) {
    const position = Math.floor(Math.random() * 20); // 20個位置
    if (!usedPositions.has(position)) {
      usedPositions.add(position);
      targets.push(position);
    }
  }
  
  return targets.sort((a, b) => a - b);
};

const TimeChallengeGame: React.FC<TimeChallengeGameProps> = ({ isActive, onGameEnd, onExit }) => {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [clickedTargets, setClickedTargets] = useState<number[]>([]);
  const [targetPositions, setTargetPositions] = useState<number[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // 重置遊戲狀態
  const resetGame = () => {
    setTimeLeft(5);
    setScore(0);
    setGameStarted(false);
    setGameEnded(false);
    setClickedTargets([]);
    setTargetPositions([]);
    setShowSuccess(false);
    // 不重置最高分，保持記錄
  };

  // 開始遊戲
  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setTimeLeft(5);
    setClickedTargets([]);
    setTargetPositions(generateRandomTargets());
  }, []);

  // 當 isActive 變為 true 時重置遊戲
  useEffect(() => {
    if (isActive) {
      resetGame();
    }
  }, [isActive]);



  const handleButtonClick = (index: number) => {
    if (!gameStarted || gameEnded) return;

    // 檢查是否點擊了目標位置
    if (targetPositions.includes(index) && !clickedTargets.includes(index)) {
      const newClicked = [...clickedTargets, index];
      setClickedTargets(newClicked);
      setScore(prev => prev + 10);

      // 檢查是否完成了所有目標
      if (newClicked.length === targetPositions.length) {
        // 更新最高分
        const newScore = score + 10;
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        // 顯示成功訊息
        setShowSuccess(true);
        // 繼續下一輪
        setTimeout(() => {
          setShowSuccess(false);
          setTimeLeft(5);
          setClickedTargets([]);
          setTargetPositions(generateRandomTargets());
        }, 1000);
      }
    }
  };

  // 計時器
  useEffect(() => {
    if (gameStarted && !gameEnded && !showSuccess && timeLeft > 0) {
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
  }, [gameStarted, gameEnded, showSuccess, timeLeft, score, highScore]);

  if (!isActive) return null;

  return (
    <div className="time-challenge-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="time-challenge-game" onClick={(e) => e.stopPropagation()}>
        <div className="game-header">
          <h2 className="mini-game-title">
            {language === 'zh' ? '⏱️ 時間挑戰' : '⏱️ Time Challenge'}
          </h2>
          <button className="exit-button" onClick={onExit}>×</button>
        </div>

        <div className="game-info">
          <div className="time-display critical">
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
            <p>{language === 'zh' ? '點擊所有勾勾！' : 'Click all checkmarks!'}</p>
            <button className="start-button" onClick={startGame}>
              {language === 'zh' ? '開始挑戰' : 'Start Challenge'}
            </button>
          </div>
        )}

        {showSuccess && (
          <div className="success-message">
            <h3>🎉 {language === 'zh' ? '完成！' : 'Complete!'} 🎉</h3>
            <p>{language === 'zh' ? '準備下一輪...' : 'Preparing next round...'}</p>
          </div>
        )}

        {gameStarted && !gameEnded && !showSuccess && (
          <>
            <div className="challenge-description">
              <h3>{language === 'zh' ? '點擊所有勾勾！' : 'Click all checkmarks!'}</h3>
              <div className="progress">
                {clickedTargets.length} / {targetPositions.length}
              </div>
            </div>

            <div className="challenge-grid">
              {Array.from({ length: 20 }, (_, i) => {
                const isTarget = targetPositions.includes(i);
                const isClicked = clickedTargets.includes(i);
                return (
                  <button
                    key={i}
                    className={`challenge-button ${isTarget ? 'target' : 'decoy'} ${isClicked ? 'clicked' : ''}`}
                    style={{
                      backgroundColor: isTarget ? '#10b981' : '#666',
                      opacity: isClicked ? 0.5 : 1
                    }}
                    onClick={() => handleButtonClick(i)}
                    disabled={isClicked}
                  >
                    {isTarget ? '✓' : '✗'}
                  </button>
                );
              })}
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

export default TimeChallengeGame;
