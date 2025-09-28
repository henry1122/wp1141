export interface Position {
  row: number;
  col: number;
}

export interface Ball {
  id: string;
  color: BallColor;
  type: BallType;
  position: Position;
  isMarkedForRemoval?: boolean;
  animationState?: AnimationState;
}

export enum BallColor {
  RED = '#FF6B6B',
  BLUE = '#4ECDC4',
  GREEN = '#45B7D1',
  YELLOW = '#FFA726',
  PURPLE = '#AB47BC',
  ORANGE = '#FF7043'
}

export enum BallType {
  NORMAL = 'normal',
  RAINBOW = 'rainbow',
  BOMB = 'bomb'
}

export enum AnimationState {
  IDLE = 'idle',
  FALLING = 'falling',
  EXPLODING = 'exploding',
  DISAPPEARING = 'disappearing'
}

export enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over'
}

export interface GameStats {
  score: number;
  level: number;
  linesCleared: number;
  combo: number;
  timeElapsed: number;
}

export interface GameBoard {
  grid: (Ball | null)[][];
  width: number;
  height: number;
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  minMatchCount: number;
  fallSpeed: number;
  dropInterval: number;
  colors: BallColor[];
}
