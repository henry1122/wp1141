import React from 'react';
import './TimeDisplay.css';

interface TimeDisplayProps {
  timeRemaining: number;
  isWarning?: boolean;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeRemaining, isWarning = false }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeClass = () => {
    if (timeRemaining <= 10) return 'time-critical';
    if (timeRemaining <= 30) return 'time-warning';
    return 'time-normal';
  };

  return (
    <div className={`time-display ${getTimeClass()}`}>
      <div className="time-icon">⏰</div>
      <div className="time-value">{formatTime(timeRemaining)}</div>
    </div>
  );
};

export default TimeDisplay;
