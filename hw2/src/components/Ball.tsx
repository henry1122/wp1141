import React from 'react';
import { Ball as BallType, BallType as BallTypeEnum, AnimationState } from '../types/game';
import './Ball.css';

interface BallProps {
  ball: BallType;
  size?: number;
  onClick?: () => void;
}

const Ball: React.FC<BallProps> = ({ ball, size = 40, onClick }) => {
  const getAnimationClass = () => {
    switch (ball.animationState) {
      case AnimationState.FALLING:
        return 'ball-falling';
      case AnimationState.EXPLODING:
        return 'ball-exploding';
      case AnimationState.DISAPPEARING:
        return 'ball-disappearing';
      default:
        return '';
    }
  };

  const getBallContent = () => {
    switch (ball.type) {
      case BallTypeEnum.RAINBOW:
        return '🌈';
      case BallTypeEnum.BOMB:
        return '💣';
      default:
        return '';
    }
  };

  const getBallStyle = () => {
    const baseStyle: React.CSSProperties = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: ball.color,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${size * 0.5}px`,
      cursor: onClick ? 'pointer' : 'default',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      boxShadow: `
        inset 0 2px 4px rgba(255, 255, 255, 0.3),
        0 2px 8px rgba(0, 0, 0, 0.3)
      `,
      transition: 'transform 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    };

    if (ball.type === BallTypeEnum.RAINBOW) {
      baseStyle.background = `
        conic-gradient(
          from 0deg,
          #FF6B6B 0deg,
          #4ECDC4 60deg,
          #45B7D1 120deg,
          #FFA726 180deg,
          #AB47BC 240deg,
          #FF7043 300deg,
          #FF6B6B 360deg
        )
      `;
    }

    return baseStyle;
  };

  return (
    <div
      className={`ball ${getAnimationClass()}`}
      style={getBallStyle()}
      onClick={onClick}
    >
      {getBallContent()}
      {ball.type === BallTypeEnum.NORMAL && (
        <div
          className="ball-shine"
          style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: '30%',
            height: '30%',
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            filter: 'blur(2px)'
          }}
        />
      )}
    </div>
  );
};

export default Ball;
