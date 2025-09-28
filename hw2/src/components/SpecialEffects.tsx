import React, { useState, useEffect } from 'react';
import './SpecialEffects.css';

interface SpecialEffectsProps {
  combo: number;
  score: number;
  timeRemaining: number;
}

const SpecialEffects: React.FC<SpecialEffectsProps> = ({ combo, score, timeRemaining }) => {
  const [showComboEffect, setShowComboEffect] = useState(false);
  const [showScoreEffect, setShowScoreEffect] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  // 連擊特效
  useEffect(() => {
    if (combo >= 5) {
      setShowComboEffect(true);
      setTimeout(() => setShowComboEffect(false), 2000);
    }
  }, [combo]);

  // 分數里程碑特效
  useEffect(() => {
    if (score > 0 && score % 1000 === 0) {
      setShowScoreEffect(true);
      setTimeout(() => setShowScoreEffect(false), 3000);
    }
  }, [score]);

  // 時間警告
  useEffect(() => {
    setShowTimeWarning(timeRemaining <= 30 && timeRemaining > 0);
  }, [timeRemaining]);

  return (
    <div className="special-effects">
      {/* 超級連擊效果 */}
      {showComboEffect && (
        <div className="combo-effect">
          <div className="combo-text">
            SUPER COMBO! 
            <span className="combo-multiplier">x{combo}</span>
          </div>
          <div className="combo-particles">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="combo-particle" style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties} />
            ))}
          </div>
        </div>
      )}

      {/* 分數里程碑效果 */}
      {showScoreEffect && (
        <div className="score-milestone">
          <div className="milestone-text">
            🎯 {score.toLocaleString()} POINTS!
          </div>
        </div>
      )}

      {/* 時間警告效果 */}
      {showTimeWarning && (
        <div className="time-warning-overlay">
          <div className="warning-pulse"></div>
        </div>
      )}

      {/* 背景動態效果 */}
      {combo > 3 && (
        <div className="background-energy">
          {[...Array(combo)].map((_, i) => (
            <div 
              key={i} 
              className="energy-wave" 
              style={{ '--delay': `${i * 0.2}s`, '--intensity': combo / 10 } as React.CSSProperties} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialEffects;
