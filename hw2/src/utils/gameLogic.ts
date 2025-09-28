import { Ball, BallColor, BallType, Position, AnimationState } from '../types/game';

export const GAME_CONFIG = {
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 12,
  MIN_MATCH_COUNT: 3,
  FALL_SPEED: 500,
  DROP_INTERVAL: 3000,
  COLORS: [
    BallColor.RED,
    BallColor.BLUE,
    BallColor.GREEN,
    BallColor.YELLOW,
    BallColor.PURPLE,
    BallColor.ORANGE
  ]
};

export const createEmptyBoard = (): (Ball | null)[][] => {
  return Array(GAME_CONFIG.BOARD_HEIGHT).fill(null).map(() => 
    Array(GAME_CONFIG.BOARD_WIDTH).fill(null)
  );
};

export const generateRandomBall = (position: Position): Ball => {
  const colors = GAME_CONFIG.COLORS;
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // 5% 機率生成特殊球
  const isSpecial = Math.random() < 0.05;
  const ballType = isSpecial ? 
    (Math.random() < 0.5 ? BallType.RAINBOW : BallType.BOMB) : 
    BallType.NORMAL;

  return {
    id: `${position.row}-${position.col}-${Date.now()}-${Math.random()}`,
    color: ballType === BallType.RAINBOW ? BallColor.RED : randomColor, // Rainbow ball 會循環顏色
    type: ballType,
    position,
    animationState: AnimationState.FALLING
  };
};

export const findMatches = (board: (Ball | null)[][], ball: Ball): Position[] => {
  const matches: Position[] = [];
  const visited = new Set<string>();
  
  const dfs = (row: number, col: number, targetColor: BallColor) => {
    const key = `${row}-${col}`;
    if (visited.has(key)) return;
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return;
    
    const currentBall = board[row][col];
    if (!currentBall || currentBall.color !== targetColor) return;
    
    visited.add(key);
    matches.push({ row, col });
    
    // 檢查四個方向
    dfs(row - 1, col, targetColor); // 上
    dfs(row + 1, col, targetColor); // 下
    dfs(row, col - 1, targetColor); // 左
    dfs(row, col + 1, targetColor); // 右
  };
  
  dfs(ball.position.row, ball.position.col, ball.color);
  
  return matches.length >= GAME_CONFIG.MIN_MATCH_COUNT ? matches : [];
};

export const findAllMatches = (board: (Ball | null)[][]): Position[] => {
  const allMatches: Position[] = [];
  const processed = new Set<string>();
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const ball = board[row][col];
      if (!ball || processed.has(`${row}-${col}`)) continue;
      
      const matches = findMatches(board, ball);
      if (matches.length > 0) {
        matches.forEach(pos => {
          processed.add(`${pos.row}-${pos.col}`);
          allMatches.push(pos);
        });
      }
    }
  }
  
  return allMatches;
};

export const applyGravity = (board: (Ball | null)[][]): (Ball | null)[][] => {
  const newBoard = createEmptyBoard();
  
  for (let col = 0; col < GAME_CONFIG.BOARD_WIDTH; col++) {
    const column: Ball[] = [];
    
    // 收集該列所有非空的球
    for (let row = GAME_CONFIG.BOARD_HEIGHT - 1; row >= 0; row--) {
      if (board[row][col]) {
        column.push(board[row][col]!);
      }
    }
    
    // 從底部開始放置球
    for (let i = 0; i < column.length; i++) {
      const newRow = GAME_CONFIG.BOARD_HEIGHT - 1 - i;
      const ball = column[i];
      ball.position = { row: newRow, col };
      ball.animationState = AnimationState.FALLING;
      newBoard[newRow][col] = ball;
    }
  }
  
  return newBoard;
};

export const removeBalls = (board: (Ball | null)[][], positions: Position[]): (Ball | null)[][] => {
  const newBoard = board.map(row => [...row]);
  
  positions.forEach(pos => {
    if (newBoard[pos.row][pos.col]) {
      newBoard[pos.row][pos.col]!.animationState = AnimationState.EXPLODING;
      // 實際移除會在動畫完成後進行
      setTimeout(() => {
        newBoard[pos.row][pos.col] = null;
      }, 300);
    }
  });
  
  return newBoard;
};

export const calculateScore = (matchCount: number, combo: number): number => {
  const baseScore = matchCount * 10;
  const comboMultiplier = Math.max(1, combo);
  return Math.floor(baseScore * comboMultiplier * 1.5);
};

export const isGameOver = (board: (Ball | null)[][]): boolean => {
  // 檢查頂部兩行是否有球
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < GAME_CONFIG.BOARD_WIDTH; col++) {
      if (board[row][col]) {
        return true;
      }
    }
  }
  return false;
};

export const canPlaceBall = (board: (Ball | null)[][], col: number): boolean => {
  return board[0][col] === null;
};

export const getLowestEmptyRow = (board: (Ball | null)[][], col: number): number => {
  for (let row = GAME_CONFIG.BOARD_HEIGHT - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return -1; // 該列已滿
};
