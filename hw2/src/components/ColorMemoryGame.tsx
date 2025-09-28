import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './ColorMemoryGame.css';

interface ColorMemoryGameProps {
  isActive: boolean;
  onGameEnd: (score: number) => void;
  onExit: () => void;
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726', '#AB47BC', '#FF7043'];

const ColorMemoryGame: React.FC<ColorMemoryGameProps> = ({ isActive, onGameEnd, onExit }) => {
  const { language } = useLanguage();
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'waiting' | 'showing' | 'input' | 'correct' | 'wrong' | 'ended'>('waiting');
  const [gameStarted, setGameStarted] = useState(false);
  const [highlightedColor, setHighlightedColor] = useState<string | null>(null);
  const [highScore, setHighScore] = useState(0);

  // 重置遊戲狀態
  const resetGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setShowingSequence(false);
    setCurrentStep(0);
    setScore(0);
    setGameState('waiting');
    setGameStarted(false);
    setHighlightedColor(null);
    // 不重置最高分，保持記錄
  };

  // 開始新一輪
  const startNewRound = useCallback(() => {
    // 生成全新的隨機序列，長度為當前回合數+1
    const newSequenceLength = sequence.length + 1;
    const newSequence = [];
    for (let i = 0; i < newSequenceLength; i++) {
      newSequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    
    setSequence(newSequence);
    setPlayerSequence([]);
    setCurrentStep(0);
    setGameState('showing');
    setShowingSequence(true);

    // 顯示序列
    newSequence.forEach((color, index) => {
      setTimeout(() => {
        setHighlightedColor(color);
        setTimeout(() => setHighlightedColor(null), 600);
      }, index * 800);
    });

    // 序列顯示完畢後允許玩家輸入
    setTimeout(() => {
      setShowingSequence(false);
      setGameState('input');
    }, newSequence.length * 800 + 500);
  }, [sequence.length]);

  // 開始遊戲
  const startGame = useCallback(() => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setCurrentStep(0);
    setGameState('waiting');
    setGameStarted(true);
    startNewRound();
  }, [startNewRound]);

  // 當 isActive 變為 true 時重置遊戲
  useEffect(() => {
    if (isActive) {
      resetGame();
    }
  }, [isActive]);


  // 處理玩家點擊
  const handleColorClick = (color: string) => {
    if (gameState !== 'input' || showingSequence) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    // 檢查是否正確
    if (color === sequence[currentStep]) {
      setCurrentStep(currentStep + 1);
      
      // 檢查是否完成這一輪
      if (currentStep + 1 === sequence.length) {
        setScore(score + sequence.length * 10);
        setGameState('correct');
        
        setTimeout(() => {
          startNewRound();
        }, 1000);
      }
     } else {
       // 錯誤
       setGameState('wrong');
       setTimeout(() => {
         setGameState('ended');
         // 更新最高分
         if (score > highScore) {
           setHighScore(score);
         }
         // 不自動調用onGameEnd，讓玩家看到Game Over畫面
       }, 1500);
     }
  };


  if (!isActive) return null;

  return (
    <div className="color-memory-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="color-memory-game" onClick={(e) => e.stopPropagation()}>
        <div className="game-header">
          <h2 className="mini-game-title">
            {language === 'zh' ? '🧠 色彩記憶' : '🧠 Color Memory'}
          </h2>
          <button className="exit-button" onClick={onExit}>×</button>
        </div>

        <div className="game-info">
          <div className="score-display">
            {language === 'zh' ? '分數' : 'Score'}: {score}
          </div>
          <div className="round-display">
            {language === 'zh' ? '回合' : 'Round'}: {sequence.length}
          </div>
          <div className="high-score-display">
            {language === 'zh' ? '最高分' : 'High Score'}: {highScore}
          </div>
        </div>


        {gameState === 'showing' && (
          <div className="sequence-display">
            <h3>{language === 'zh' ? '記住這個序列...' : 'Remember this sequence...'}</h3>
          </div>
        )}

        {gameState === 'input' && (
          <div className="input-prompt">
            <h3>{language === 'zh' ? '重複序列！' : 'Repeat the sequence!'}</h3>
            <div className="progress">
              {currentStep} / {sequence.length}
            </div>
          </div>
        )}

        {gameState === 'correct' && (
          <div className="feedback correct">
            <h3>✅ {language === 'zh' ? '正確！' : 'Correct!'}</h3>
          </div>
        )}

        {gameState === 'wrong' && (
          <div className="feedback wrong">
            <h3>❌ {language === 'zh' ? '錯誤！' : 'Wrong!'}</h3>
          </div>
        )}

        {!gameStarted && (
          <div className="game-start">
            <h3>{language === 'zh' ? '準備好了嗎？' : 'Ready to Play?'}</h3>
            <p>{language === 'zh' ? '記住顏色序列並重複它們' : 'Remember color sequences and repeat them'}</p>
            <button className="start-button" onClick={startGame}>
              {language === 'zh' ? '開始遊戲' : 'Start Game'}
            </button>
          </div>
        )}

        {gameState === 'ended' && (
          <div className="game-end">
            <h3>{language === 'zh' ? '遊戲結束！' : 'Game Over!'}</h3>
            <p>{language === 'zh' ? '最終分數' : 'Final Score'}: {score}</p>
            <p>{language === 'zh' ? '達到回合' : 'Rounds Reached'}: {sequence.length}</p>
             <div className="end-buttons">
               <button className="exit-button-full" onClick={onExit}>
                 {language === 'zh' ? '返回選單' : 'Back to Menu'}
               </button>
             </div>
          </div>
        )}

        {/* 顏色按鈕 */}
        <div className="color-grid">
          {colors.map((color) => (
            <button
              key={color}
              className={`color-button ${highlightedColor === color ? 'highlighted' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
              disabled={gameState === 'showing' || gameState === 'waiting' || gameState === 'ended'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorMemoryGame;
