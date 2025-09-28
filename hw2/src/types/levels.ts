export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  SUPER = 'super',
  GOD = 'god'
}

export interface LevelConfig {
  id: Difficulty;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  targetScore: number;
  dropInterval: number;
  minMatchCount: number;
  specialBallChance: number;
  colors: number;
  timeLimit: number; // 時間限制（秒）
  background: {
    gradient: string;
    particles?: boolean;
    animation?: string;
  };
  unlockScore: number;
}

export const LEVEL_CONFIGS: Record<Difficulty, LevelConfig> = {
  [Difficulty.EASY]: {
    id: Difficulty.EASY,
    name: '初心者',
    nameEn: 'Easy',
    description: '適合新手的輕鬆關卡',
    descriptionEn: 'Perfect for beginners',
    targetScore: 300,
    dropInterval: 8000,
    minMatchCount: 3,
    specialBallChance: 0.1,
    colors: 4,
    timeLimit: 120, // 2分鐘
    background: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      particles: false,
    },
    unlockScore: 0,
  },
  [Difficulty.MEDIUM]: {
    id: Difficulty.MEDIUM,
    name: '進階者',
    nameEn: 'Medium',
    description: '稍有挑戰的中等難度',
    descriptionEn: 'Moderate challenge awaits',
    targetScore: 800,
    dropInterval: 6000,
    minMatchCount: 3,
    specialBallChance: 0.15,
    colors: 5,
    timeLimit: 90, // 1.5分鐘
    background: {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      particles: true,
      animation: 'wave',
    },
    unlockScore: 300,
  },
  [Difficulty.HARD]: {
    id: Difficulty.HARD,
    name: '專家級',
    nameEn: 'Hard',
    description: '需要策略思考的困難關卡',
    descriptionEn: 'Strategic thinking required',
    targetScore: 1500,
    dropInterval: 4000,
    minMatchCount: 3,
    specialBallChance: 0.2,
    colors: 6,
    timeLimit: 120, // 2分鐘
    background: {
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      particles: true,
      animation: 'pulse',
    },
    unlockScore: 800,
  },
  [Difficulty.SUPER]: {
    id: Difficulty.SUPER,
    name: '超級挑戰',
    nameEn: 'Super',
    description: '極限挑戰，高手專屬',
    descriptionEn: 'Ultimate challenge for experts',
    targetScore: 5000,
    dropInterval: 2000,
    minMatchCount: 3,
    specialBallChance: 0.25,
    colors: 6,
    timeLimit: 240, // 4分鐘
    background: {
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      particles: true,
      animation: 'rotate',
    },
    unlockScore: 1500,
  },
  [Difficulty.GOD]: {
    id: Difficulty.GOD,
    name: '神級大師',
    nameEn: 'God',
    description: '傳說中的最高難度',
    descriptionEn: 'Legendary difficulty',
    targetScore: 12000,
    dropInterval: 1000,
    minMatchCount: 4,
    specialBallChance: 0.3,
    colors: 6,
    timeLimit: 420, // 7分鐘
    background: {
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%), linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      particles: true,
      animation: 'matrix',
    },
    unlockScore: 5000,
  },
};

export const getLevelByScore = (score: number): LevelConfig => {
  const levels = Object.values(LEVEL_CONFIGS).sort((a, b) => b.unlockScore - a.unlockScore);
  return levels.find(level => score >= level.unlockScore) || LEVEL_CONFIGS[Difficulty.EASY];
};

export const getNextLevel =  (currentLevel: Difficulty): LevelConfig | null => {
  const levels = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD, Difficulty.SUPER, Difficulty.GOD];
  const currentIndex = levels.indexOf(currentLevel);
  const nextIndex = currentIndex + 1;
  
  if (nextIndex < levels.length) {
    return LEVEL_CONFIGS[levels[nextIndex]];
  }
  
  return null;
};

export const isLevelUnlocked = (level: Difficulty, highScore: number): boolean => {
  // Easy 關卡總是解鎖的
  if (level === Difficulty.EASY) {
    return true;
  }
  return highScore >= LEVEL_CONFIGS[level].unlockScore;
};

// 檢查關卡是否可以被當前玩家選擇（考慮當前進度）
export const canSelectLevel = (level: Difficulty, highScore: number, currentLevel: Difficulty): boolean => {
  // Easy 總是可以選擇
  if (level === Difficulty.EASY) {
    return true;
  }
  
  // 如果已經解鎖，就可以選擇
  if (isLevelUnlocked(level, highScore)) {
    return true;
  }
  
  // 如果當前關卡等級高於或等於目標關卡，也可以選擇
  const levels = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD, Difficulty.SUPER, Difficulty.GOD];
  const currentIndex = levels.indexOf(currentLevel);
  const targetIndex = levels.indexOf(level);
  
  return currentIndex >= targetIndex;
};
