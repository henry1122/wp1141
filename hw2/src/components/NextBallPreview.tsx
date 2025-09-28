import React from 'react';
import { Ball as BallType } from '../types/game';
import { useLanguage } from '../contexts/LanguageContext';
import './NextBallPreview.css';

interface NextBallPreviewProps {
  nextBall: BallType | null | undefined;
}

const NextBallPreview: React.FC<NextBallPreviewProps> = ({ nextBall }) => {
  const { t } = useLanguage();

  if (!nextBall) return null;

  const getBallIcon = (type: string) => {
    switch (type) {
      case 'rainbow': return '🌈';
      case 'bomb': return '💣';
      default: return '⚪';
    }
  };

  return (
    <div className="next-ball-preview">
      <div className="preview-header">
        <h3 className="preview-title">{t.nextBall}</h3>
      </div>
      <div className="preview-ball-container">
        <div 
          className={`preview-ball ${nextBall.type}`}
          style={{ 
            backgroundColor: nextBall.color,
            boxShadow: `0 0 20px ${nextBall.color}40`
          }}
        >
          <span className="ball-icon">{getBallIcon(nextBall.type)}</span>
        </div>
        <div className="ball-type-label">
          {nextBall.type === 'rainbow' && '彩虹球'}
          {nextBall.type === 'bomb' && '炸彈球'}
          {nextBall.type === 'normal' && '普通球'}
        </div>
      </div>
    </div>
  );
};

export default NextBallPreview;
