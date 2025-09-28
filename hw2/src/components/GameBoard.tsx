import React from 'react';
import Ball from './Ball';
import { Ball as BallType } from '../types/game';
import { GAME_CONFIG } from '../utils/gameLogic';
import './GameBoard.css';

interface GameBoardProps {
  board: (BallType | null)[][];
  onCellClick?: (row: number, col: number) => void;
  nextBall?: BallType;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, nextBall }) => {
  const cellSize = 45;
  const gap = 2;

  return (
    <div className="game-board-container">
      <div className="next-ball-preview">
        <h3>Next Ball:</h3>
        {nextBall && <Ball ball={nextBall} size={35} />}
      </div>
      
      <div 
        className="game-board"
        style={{
          width: `${GAME_CONFIG.BOARD_WIDTH * (cellSize + gap) - gap}px`,
          height: `${GAME_CONFIG.BOARD_HEIGHT * (cellSize + gap) - gap}px`,
          gap: `${gap}px`
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((ball, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`game-cell ${ball ? 'occupied' : 'empty'}`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`
              }}
              onClick={() => onCellClick?.(rowIndex, colIndex)}
            >
              {ball && <Ball ball={ball} size={cellSize - 4} />}
            </div>
          ))
        )}
      </div>
      
      {/* 遊戲區域頂部警告線 */}
      <div 
        className="danger-zone"
        style={{
          position: 'absolute',
          top: `${2 * (cellSize + gap)}px`,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: '#ff4444',
          opacity: 0.7,
          animation: 'pulse 2s infinite'
        }}
      />
    </div>
  );
};

export default GameBoard;
