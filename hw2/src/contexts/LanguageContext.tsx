import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'zh' | 'en';

interface Translations {
  // 遊戲標題和描述
  gameTitle: string;
  gameDescription: string;
  
  // 按鈕
  startGame: string;
  pauseGame: string;
  resumeGame: string;
  restartGame: string;
  resetGame: string;
  backToMenu: string;
  settings: string;
  
  // 遊戲狀態
  gamePaused: string;
  gameOver: string;
  finalScore: string;
  level: string;
  gameTime: string;
  playAgain: string;
  
  // 統計
  score: string;
  combo: string;
  linesCleared: string;
  
  // 遊戲說明
  instructions: string;
  instructionsList: {
    clickToPlace: string;
    matchThree: string;
    chainReaction: string;
    specialBalls: string;
    autoDrops: string;
    challenge: string;
  };
  
  // 設定
  theme: string;
  language: string;
  lightMode: string;
  darkMode: string;
  soundEffects: string;
  music: string;
  particles: string;
  
  // 特殊球類型
  normalBall: string;
  rainbowBall: string;
  bombBall: string;
  
  // 成就系統
  achievements: string;
  newAchievement: string;
  
  // 關卡系統
  selectDifficulty: string;
  levelComplete: string;
  nextChallenge: string;
  challengeNextLevel: string;
  replay: string;
  mainMenu: string;
  allComplete: string;
  congratulations: string;
  
  // 其他
  nextBall: string;
  highScore: string;
  newHighScore: string;
}

const zhTranslations: Translations = {
  gameTitle: 'Color Chain Reaction',
  gameDescription: '放置球球，當相同顏色的球相鄰3個以上時會反應並獲得分數！',
  
  startGame: '開始遊戲',
  pauseGame: '暫停',
  resumeGame: '繼續遊戲',
  restartGame: '重新開始',
  resetGame: '重新開始',
  backToMenu: '回到主選單',
  settings: '設定',
  
  gamePaused: '遊戲暫停',
  gameOver: '遊戲結束',
  finalScore: '最終分數',
  level: '達到等級',
  gameTime: '遊戲時間',
  playAgain: '再玩一次',
  
  score: '分數',
  combo: '連擊',
  linesCleared: '消除行數',
  
  instructions: '遊戲說明',
  instructionsList: {
    clickToPlace: '1. 點擊任意列放置彩色球',
    matchThree: '2. 相同顏色相鄰3個以上會消除',
    chainReaction: '3. 連鎖反應可獲得更高分數',
    specialBalls: '4. 特殊球：彩虹球（萬能）、炸彈球（爆炸範圍）',
    autoDrops: '5. 球會自動掉落，別讓頂部填滿！',
    challenge: '6. 挑戰更高分數和等級',
  },
  
  theme: '主題',
  language: '語言',
  lightMode: '亮色模式',
  darkMode: '暗色模式',
  soundEffects: '音效',
  music: '背景音樂',
  particles: '粒子效果',
  
  normalBall: '普通球',
  rainbowBall: '彩虹球',
  bombBall: '炸彈球',
  
  achievements: '成就',
  newAchievement: '新成就解鎖！',
  
  selectDifficulty: '選擇難度',
  levelComplete: '關卡完成！',
  nextChallenge: '下一個挑戰',
  challengeNextLevel: '挑戰下一關',
  replay: '重新挑戰',
  mainMenu: '主選單',
  allComplete: '恭喜！你已完成所有挑戰！',
  congratulations: '恭喜！',
  
  nextBall: '下一個球',
  highScore: '最高分',
  newHighScore: '新紀錄！',
};

const enTranslations: Translations = {
  gameTitle: 'Color Chain Reaction',
  gameDescription: 'Click to place colored balls. When 3 or more same-colored balls are adjacent, they create chain reactions!',
  
  startGame: 'Start Game',
  pauseGame: 'Pause',
  resumeGame: 'Resume',
  restartGame: 'Restart',
  resetGame: 'Reset',
  backToMenu: 'Back to Menu',
  settings: 'Settings',
  
  gamePaused: 'Game Paused',
  gameOver: 'Game Over',
  finalScore: 'Final Score',
  level: 'Level Reached',
  gameTime: 'Game Time',
  playAgain: 'Play Again',
  
  score: 'Score',
  combo: 'Combo',
  linesCleared: 'Lines Cleared',
  
  instructions: 'How to Play',
  instructionsList: {
    clickToPlace: '1. Click any column to place colored balls',
    matchThree: '2. Match 3+ same colors adjacent to eliminate',
    chainReaction: '3. Chain reactions give higher scores',
    specialBalls: '4. Special balls: Rainbow (wild), Bomb (explosion)',
    autoDrops: '5. Balls drop automatically, don\'t fill the top!',
    challenge: '6. Challenge for higher scores and levels',
  },
  
  theme: 'Theme',
  language: 'Language',
  lightMode: 'Light Mode',
  darkMode: 'Dark Mode',
  soundEffects: 'Sound Effects',
  music: 'Background Music',
  particles: 'Particle Effects',
  
  normalBall: 'Normal Ball',
  rainbowBall: 'Rainbow Ball',
  bombBall: 'Bomb Ball',
  
  achievements: 'Achievements',
  newAchievement: 'New Achievement Unlocked!',
  
  selectDifficulty: 'Select Difficulty',
  levelComplete: 'Level Complete!',
  nextChallenge: 'Next Challenge',
  challengeNextLevel: 'Next Level',
  replay: 'Replay',
  mainMenu: 'Main Menu',
  allComplete: 'Congratulations! You\'ve mastered all levels!',
  congratulations: 'Congratulations!',
  
  nextBall: 'Next Ball',
  highScore: 'High Score',
  newHighScore: 'New Record!',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'zh';
  });

  const translations = language === 'zh' ? zhTranslations : enTranslations;

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
