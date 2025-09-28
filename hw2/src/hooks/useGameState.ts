import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Ball, 
  GameState, 
  GameStats
} from '../types/game';
import {
  createEmptyBoard,
  generateRandomBall,
  findAllMatches,
  applyGravity,
  removeBalls,
  calculateScore,
  isGameOver,
  canPlaceBall,
  getLowestEmptyRow,
  GAME_CONFIG
} from '../utils/gameLogic';
import { Difficulty, LEVEL_CONFIGS, getNextLevel } from '../types/levels';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [board, setBoard] = useState<(Ball | null)[][]>(createEmptyBoard());
  const [nextBall, setNextBall] = useState<Ball | null>(null);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    level: 1,
    linesCleared: 0,
    combo: 0,
    timeElapsed: 0
  });
  const [levelComplete, setLevelComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const dropTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const statsRef = useRef(stats);
  const currentLevelConfig = LEVEL_CONFIGS[currentDifficulty];

  // 檢查並更新最高分
  const checkAndUpdateHighScore = useCallback((newScore: number, newLevel: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      setIsNewHighScore(true);
      // 3秒後重置新紀錄標記
      setTimeout(() => setIsNewHighScore(false), 3000);
      return true;
    }
    return false;
  }, [highScore]);

  // 保持 statsRef 最新，並且即時檢查最高分
  useEffect(() => {
    statsRef.current = stats;
    // 當分數變化時，即時檢查最高分（但不觸發新紀錄通知）
    if (stats.score > 0) {
      checkAndUpdateHighScore(stats.score, stats.level);
    }
  }, [stats, checkAndUpdateHighScore]);

  // 初始化下一個球
  const initializeNextBall = useCallback(() => {
    const ball = generateRandomBall({ row: 0, col: 0 });
    setNextBall(ball);
  }, []);

  // 隨機掉落球
  const dropRandomBall = useCallback(() => {
    setBoard(currentBoard => {
      const availableColumns = [];
      for (let col = 0; col < GAME_CONFIG.BOARD_WIDTH; col++) {
        if (canPlaceBall(currentBoard, col)) {
          availableColumns.push(col);
        }
      }

      if (availableColumns.length === 0) {
        setGameState(GameState.GAME_OVER);
        return currentBoard;
      }

      const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
      const row = getLowestEmptyRow(currentBoard, randomCol);
      
      if (row === -1) {
        setGameState(GameState.GAME_OVER);
        return currentBoard;
      }

      const ball = generateRandomBall({ row, col: randomCol });
      const newBoard = [...currentBoard];
      newBoard[row][randomCol] = ball;

      return newBoard;
    });
  }, []);

  // 處理連鎖反應
  const processMatches = useCallback((currentBoard: (Ball | null)[][]) => {
    let newBoard = [...currentBoard.map(row => [...row])];
    let totalMatches = 0;
    let comboCount = 0;

    const processRound = () => {
      const matches = findAllMatches(newBoard);
      
      if (matches.length === 0) {
        // 沒有更多匹配，結束連鎖
        if (totalMatches > 0) {
          const scoreGain = calculateScore(totalMatches, comboCount);
          setStats(prev => {
            const newScore = prev.score + scoreGain;
            const newStats = {
              ...prev,
              score: newScore,
              linesCleared: prev.linesCleared + Math.floor(totalMatches / currentLevelConfig.minMatchCount),
              combo: comboCount,
              level: Math.floor(newScore / 1000) + 1
            };
            
            // 檢查是否完成當前關卡
            if (newScore >= currentLevelConfig.targetScore && !levelComplete) {
              console.log('Level complete!', { newScore, target: currentLevelConfig.targetScore, levelComplete });
              setTimeout(() => {
                setLevelComplete(true);
                // 暫停遊戲並顯示勝利頁面
                setGameState(GameState.PAUSED);
                if (dropTimerRef.current) clearInterval(dropTimerRef.current);
                if (timeTimerRef.current) clearInterval(timeTimerRef.current);
                if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
              }, 1000);
            }
            
            return newStats;
          });

          // 重置連擊計數器
          setTimeout(() => {
            setStats(prev => ({ ...prev, combo: 0 }));
          }, 2000);
        }
        return;
      }

      // 移除匹配的球
      newBoard = removeBalls(newBoard, matches);
      totalMatches += matches.length;
      comboCount++;

      // 等待爆炸動畫完成後應用重力
      setTimeout(() => {
        // 實際移除球
        matches.forEach(pos => {
          newBoard[pos.row][pos.col] = null;
        });
        
        // 應用重力
        newBoard = applyGravity(newBoard);
        setBoard(newBoard);
        
        // 繼續處理下一輪匹配
        setTimeout(() => processRound(), 600);
      }, 400);
    };

    processRound();
  }, [currentLevelConfig.minMatchCount, currentLevelConfig.targetScore, levelComplete]);

  // 開始遊戲
  const startGame = useCallback((difficulty?: Difficulty) => {
    if (difficulty) {
      setCurrentDifficulty(difficulty);
    }
    setGameState(GameState.PLAYING);
    setBoard(createEmptyBoard());
    setStats({
      score: 0,
      level: 1,
      linesCleared: 0,
      combo: 0,
      timeElapsed: 0
    });
    setLevelComplete(false);
    initializeNextBall();

    const levelConfig = difficulty ? LEVEL_CONFIGS[difficulty] : currentLevelConfig;
    setTimeRemaining(levelConfig.timeLimit);

    // 開始時間計時器
    if (timeTimerRef.current) clearInterval(timeTimerRef.current);
    timeTimerRef.current = setInterval(() => {
      setStats(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
    }, 1000);

    // 開始倒數計時器
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // 時間到了，遊戲結束
          setGameState(GameState.GAME_OVER);
          // 清理所有計時器
          if (dropTimerRef.current) clearInterval(dropTimerRef.current);
          if (timeTimerRef.current) clearInterval(timeTimerRef.current);
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          // 檢查最高分 - 使用最新的 stats
          checkAndUpdateHighScore(statsRef.current.score, statsRef.current.level);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 開始自動掉落計時器
    if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    dropTimerRef.current = setInterval(() => {
      dropRandomBall();
    }, levelConfig.dropInterval);
  }, [initializeNextBall, dropRandomBall, currentLevelConfig, checkAndUpdateHighScore]);

  // 暫停遊戲
  const pauseGame = useCallback(() => {
    setGameState(GameState.PAUSED);
    if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    if (timeTimerRef.current) clearInterval(timeTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
  }, []);

  // 恢復遊戲
  const resumeGame = useCallback(() => {
    setGameState(GameState.PLAYING);
    
    if (timeTimerRef.current) clearInterval(timeTimerRef.current);
    timeTimerRef.current = setInterval(() => {
      setStats(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
    }, 1000);

    // 恢復倒數計時器
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGameState(GameState.GAME_OVER);
          // 清理所有計時器
          if (dropTimerRef.current) clearInterval(dropTimerRef.current);
          if (timeTimerRef.current) clearInterval(timeTimerRef.current);
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          // 檢查最高分 - 使用最新的 stats
          checkAndUpdateHighScore(statsRef.current.score, statsRef.current.level);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    dropTimerRef.current = setInterval(() => {
      dropRandomBall();
    }, currentLevelConfig.dropInterval);
  }, [dropRandomBall, currentLevelConfig.dropInterval, checkAndUpdateHighScore]);

  // 結束遊戲
  const endGame = useCallback(() => {
    setGameState(GameState.GAME_OVER);
    if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    if (timeTimerRef.current) clearInterval(timeTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    
    // 檢查最高分 - 使用最新的 stats
    checkAndUpdateHighScore(statsRef.current.score, statsRef.current.level);
  }, [checkAndUpdateHighScore]);

  // 點擊格子放置球
  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState !== GameState.PLAYING || !nextBall) return;

    const targetRow = getLowestEmptyRow(board, col);
    if (targetRow === -1) return; // 該列已滿

    // 放置球
    const newBoard = [...board];
    const ballToPlace = { ...nextBall, position: { row: targetRow, col } };
    newBoard[targetRow][col] = ballToPlace;
    
    setBoard(newBoard);
    
    // 生成下一個球
    initializeNextBall();
    
    // 檢查匹配
    setTimeout(() => {
      processMatches(newBoard);
    }, 100);

    // 檢查遊戲結束
    if (isGameOver(newBoard)) {
      endGame();
    }
  }, [gameState, nextBall, board, processMatches, initializeNextBall, endGame]);

  // 重置遊戲
  const resetGame = useCallback(() => {
    setGameState(GameState.MENU);
    setBoard(createEmptyBoard());
    setStats({
      score: 0,
      level: 1,
      linesCleared: 0,
      combo: 0,
      timeElapsed: 0
    });
    setNextBall(null);
    
    if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    if (timeTimerRef.current) clearInterval(timeTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  }, []);

  // 清理計時器
  useEffect(() => {
    return () => {
      if (dropTimerRef.current) clearInterval(dropTimerRef.current);
      if (timeTimerRef.current) clearInterval(timeTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  // 進入下一關
  const nextLevelHandler = useCallback(() => {
    const next = getNextLevel(currentDifficulty);
    if (next) {
      setLevelComplete(false);
      setCurrentDifficulty(next.id);
      // 使用 setTimeout 確保狀態更新後再開始遊戲
      setTimeout(() => {
        startGame(next.id);
      }, 100);
    }
  }, [currentDifficulty, startGame]);

  // 設置難度
  const setDifficultyHandler = useCallback((difficulty: Difficulty) => {
    setCurrentDifficulty(difficulty);
  }, []);

  // 重置關卡完成狀態
  const resetLevelComplete = useCallback(() => {
    setLevelComplete(false);
  }, []);

  return {
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
    nextLevel: nextLevelHandler,
    setDifficulty: setDifficultyHandler,
    resetLevelComplete,
    handleCellClick
  };
};