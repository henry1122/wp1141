import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import GameStats from './components/GameStats';
import SettingsPanel from './components/SettingsPanel';
import ParticleSystem from './components/ParticleSystem';
import AchievementSystem from './components/AchievementSystem';
import LevelSelector from './components/LevelSelector';
import LevelCompleteModal from './components/LevelCompleteModal';
import DynamicBackground from './components/DynamicBackground';
import TimeDisplay from './components/TimeDisplay';
import NextBallPreview from './components/NextBallPreview';
import SpecialEffects from './components/SpecialEffects';
import VictoryPage from './components/VictoryPage';
import MiniGamesMenu from './components/MiniGamesMenu';
import ColorMemoryGame from './components/ColorMemoryGame';
import SpeedMatchGame from './components/SpeedMatchGame';
import TimeChallengeGame from './components/TimeChallengeGame';
import { useGameState } from './hooks/useGameState';
import { GameState } from './types/game';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { getNextLevel } from './types/levels';
import './App.css';
import './components/AnimatedUI.css';

const GameContent: React.FC = () => {
  const { t, language } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showMiniGames, setShowMiniGames] = useState(false);
  const [showVictoryPage, setShowVictoryPage] = useState(false);
  const [currentMiniGame, setCurrentMiniGame] = useState<string | null>(null);
  
  // 調試 currentMiniGame 狀態變化
  React.useEffect(() => {
    console.log('currentMiniGame changed to:', currentMiniGame);
  }, [currentMiniGame]);
  const [particleEffect, setParticleEffect] = useState<{
    active: boolean;
    x: number;
    y: number;
    color: string;
  }>({ active: false, x: 0, y: 0, color: '#4ECDC4' });
  
  const {
    gameState,
    board,
    nextBall,
    stats,
    highScore,
    isNewHighScore,
    currentDifficulty,
    currentLevelConfig,
    levelComplete,
    timeRemaining,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    nextLevel,
    setDifficulty,
    resetLevelComplete,
    handleCellClick
  } = useGameState();

  const handleAchievementUnlocked = () => {
    // 觸發粒子效果
    setParticleEffect({
      active: true,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      color: '#FFD700'
    });
    setTimeout(() => setParticleEffect(prev => ({ ...prev, active: false })), 100);
  };


  const renderGameControls = () => {
    switch (gameState) {
      case GameState.MENU:
        return (
          <div className="game-controls">
            <h1 className="game-title">{t.gameTitle}</h1>
            <p className="game-description">
              {t.gameDescription}
            </p>
            <div className="menu-buttons">
              <button className="control-button levels" onClick={() => setShowLevelSelector(true)}>
                {language === 'zh' ? '主遊戲--選擇難度' : 'Main Game--Select Difficulty'}
              </button>
              <button className="control-button mini-games" onClick={() => setShowMiniGames(true)}>
                {language === 'zh' ? '小遊戲' : 'Mini Games'}
              </button>
              <button className="control-button settings" onClick={() => setShowSettings(true)}>
                {t.settings}
              </button>
            </div>
          </div>
        );
      
      case GameState.PLAYING:
        return (
          <div className="game-controls">
            <button className="control-button pause" onClick={pauseGame}>
              {t.pauseGame}
            </button>
            <button className="control-button reset" onClick={resetGame}>
              {t.resetGame}
            </button>
            <button className="control-button settings" onClick={() => setShowSettings(true)}>
              {t.settings}
            </button>
          </div>
        );
      
      case GameState.PAUSED:
        return (
          <div className="game-controls">
            <h2 className="pause-title">{t.gamePaused}</h2>
            <button className="control-button resume" onClick={resumeGame}>
              {t.resumeGame}
            </button>
            <button className="control-button reset" onClick={resetGame}>
              {t.resetGame}
            </button>
            <button className="control-button settings" onClick={() => setShowSettings(true)}>
              {t.settings}
            </button>
          </div>
        );
      
      case GameState.GAME_OVER:
        return (
          <div className="game-controls">
            <h2 className="game-over-title">{t.gameOver}</h2>
            {isNewHighScore && (
              <div className="new-high-score">
                🎉 {t.newHighScore} 🎉
              </div>
            )}
            <div className="final-stats">
              <p>{t.finalScore}: <span className="highlight">{stats.score.toLocaleString()}</span></p>
              <p>{t.level}: <span className="highlight">{stats.level}</span></p>
              <p>{t.gameTime}: <span className="highlight">{Math.floor(stats.timeElapsed / 60)}:{(stats.timeElapsed % 60).toString().padStart(2, '0')}</span></p>
              <p>{t.highScore}: <span className="highlight">{highScore.toLocaleString()}</span></p>
            </div>
            <button className="control-button restart" onClick={() => startGame()}>
              {t.playAgain}
            </button>
            <button className="control-button menu" onClick={resetGame}>
              {t.backToMenu}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderGameInstructions = () => {
    if (gameState === GameState.MENU) {
      return (
        <div className="game-instructions">
          <h3>{language === 'zh' ? '主遊戲--遊戲說明' : 'Main Game--Instructions'}</h3>
          <ul>
            <li>{t.instructionsList.clickToPlace}</li>
            <li>{t.instructionsList.matchThree}</li>
            <li>{t.instructionsList.chainReaction}</li>
            <li>{t.instructionsList.specialBalls}</li>
            <li>{t.instructionsList.autoDrops}</li>
            <li>{t.instructionsList.challenge}</li>
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app">
      {/* 動態背景 */}
      <DynamicBackground level={currentLevelConfig} />
      
      <div className="app-container">
        {gameState === GameState.MENU ? (
          <div className="menu-layout animate-float">
            {renderGameControls()}
            {renderGameInstructions()}
          </div>
        ) : (
          <div className="game-layout">
            <div className="game-area animate-float">
              <GameBoard 
                board={board}
                onCellClick={handleCellClick}
                nextBall={nextBall || undefined}
              />
            </div>
            
            <div className="sidebar">
              <div className="animate-float">
                <TimeDisplay timeRemaining={timeRemaining} />
              </div>
              <div className="animate-float" style={{ animationDelay: '0.5s' }}>
                <NextBallPreview nextBall={nextBall} />
              </div>
              <div className="animate-float" style={{ animationDelay: '1s' }}>
                <GameStats stats={stats} />
              </div>
              <div className="animate-float" style={{ animationDelay: '1.5s' }}>
                {renderGameControls()}
              </div>
            </div>
          </div>
        )}
        
        {(gameState === GameState.PAUSED || gameState === GameState.GAME_OVER) && (
          <div className="overlay">
            <div className="overlay-content">
              {renderGameControls()}
            </div>
          </div>
        )}
      </div>
      
      {/* 設定面板 */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
      
      {/* 關卡選擇器 */}
      <LevelSelector 
        currentLevel={currentDifficulty}
        highScore={highScore}
        onLevelSelect={(level) => {
          console.log('Level selected:', level);
          setDifficulty(level);
          setShowLevelSelector(false);
          // 選擇關卡後自動開始遊戲
          startGame(level);
        }}
        onClose={() => setShowLevelSelector(false)}
        isOpen={showLevelSelector}
      />
      
      {/* 關卡完成模態框 */}
      <LevelCompleteModal 
        isOpen={levelComplete && !showVictoryPage}
        currentLevel={currentLevelConfig}
        nextLevel={getNextLevel(currentDifficulty)}
        score={stats.score}
        onNextLevel={() => {
          console.log('Next level clicked');
          setShowVictoryPage(true);
          setTimeout(() => {
            setShowVictoryPage(false);
            resetLevelComplete();
            nextLevel();
            setParticleEffect({
              active: true,
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
              color: '#FFD700'
            });
            setTimeout(() => setParticleEffect(prev => ({ ...prev, active: false })), 100);
          }, 3000);
        }}
        onReplay={() => {
          resetLevelComplete();
          startGame(currentDifficulty);
        }}
        onMenu={() => {
          resetLevelComplete();
          resetGame();
        }}
      />
      
      {/* 粒子效果 */}
      <ParticleSystem 
        isActive={particleEffect.active}
        x={particleEffect.x}
        y={particleEffect.y}
        color={particleEffect.color}
        type="sparkle"
      />
      
      {/* 成就系統 */}
      <AchievementSystem 
        stats={stats}
        onAchievementUnlocked={handleAchievementUnlocked}
      />
      
      {/* 特殊效果 */}
      <SpecialEffects 
        combo={stats.combo}
        score={stats.score}
        timeRemaining={timeRemaining}
      />
      
      
      {/* 小遊戲選單 */}
      <MiniGamesMenu 
        isOpen={showMiniGames}
        onClose={() => setShowMiniGames(false)}
        onGameSelect={(gameId) => {
          console.log('App received game selection:', gameId);
          console.log('Setting currentMiniGame to:', gameId);
          setCurrentMiniGame(gameId);
          setShowMiniGames(false);
          console.log('Mini games menu closed, currentMiniGame should be:', gameId);
        }}
      />
      
      {/* 小遊戲們 */}
      
      <ColorMemoryGame 
        isActive={currentMiniGame === 'color_memory'}
        onGameEnd={(score) => {
          console.log('Color Memory Game ended with score:', score);
          // 不自動關閉遊戲，讓玩家在Game Over畫面中選擇
        }}
        onExit={() => {
          console.log('Exiting Color Memory Game');
          setCurrentMiniGame(null);
        }}
      />
      
      <SpeedMatchGame 
        isActive={currentMiniGame === 'speed_match'}
        onGameEnd={(score) => {
          console.log('Speed Match Game ended with score:', score);
          // 不自動關閉遊戲，讓玩家在Game Over畫面中選擇
        }}
        onExit={() => {
          console.log('Exiting Speed Match Game');
          setCurrentMiniGame(null);
        }}
      />
      
      <TimeChallengeGame 
        isActive={currentMiniGame === 'time_challenge'}
        onGameEnd={(score) => {
          console.log('Time Challenge Game ended with score:', score);
          // 不自動關閉遊戲，讓玩家在Game Over畫面中選擇
        }}
        onExit={() => {
          console.log('Exiting Time Challenge Game');
          setCurrentMiniGame(null);
        }}
      />
      
      {/* 勝利頁面 */}
      <VictoryPage 
        isVisible={showVictoryPage || levelComplete}
        completedLevel={currentDifficulty}
        finalStats={stats}
        onContinue={() => {
          setShowVictoryPage(false);
          resetLevelComplete();
          if (getNextLevel(currentDifficulty)) {
            nextLevel();
          } else {
            resetGame();
          }
        }}
        onMainMenu={() => {
          setShowVictoryPage(false);
          resetLevelComplete();
          resetGame();
        }}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <GameContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
