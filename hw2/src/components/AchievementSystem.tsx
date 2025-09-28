import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GameStats } from '../types/game';
import './AchievementSystem.css';

export interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  condition: (stats: GameStats, gameData: any) => boolean;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementSystemProps {
  stats: GameStats;
  gameData?: any;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const achievements: Achievement[] = [
  {
    id: 'first_game',
    titleKey: 'First Steps',
    descriptionKey: 'Play your first game',
    icon: '🎮',
    condition: (stats) => stats.score > 0,
    unlocked: false,
  },
  {
    id: 'score_1000',
    titleKey: 'Getting Started',
    descriptionKey: 'Reach 1,000 points',
    icon: '⭐',
    condition: (stats) => stats.score >= 1000,
    unlocked: false,
  },
  {
    id: 'score_5000',
    titleKey: 'Rising Star',
    descriptionKey: 'Reach 5,000 points',
    icon: '🌟',
    condition: (stats) => stats.score >= 5000,
    unlocked: false,
  },
  {
    id: 'score_10000',
    titleKey: 'Champion',
    descriptionKey: 'Reach 10,000 points',
    icon: '🏆',
    condition: (stats) => stats.score >= 10000,
    unlocked: false,
  },
  {
    id: 'combo_10',
    titleKey: 'Combo Master',
    descriptionKey: 'Achieve a 10x combo',
    icon: '⚡',
    condition: (stats) => stats.combo >= 10,
    unlocked: false,
  },
  {
    id: 'level_5',
    titleKey: 'Experienced',
    descriptionKey: 'Reach level 5',
    icon: '📈',
    condition: (stats) => stats.level >= 5,
    unlocked: false,
  },
  {
    id: 'level_10',
    titleKey: 'Expert',
    descriptionKey: 'Reach level 10',
    icon: '🎯',
    condition: (stats) => stats.level >= 10,
    unlocked: false,
  },
  {
    id: 'time_300',
    titleKey: 'Endurance',
    descriptionKey: 'Play for 5 minutes',
    icon: '⏰',
    condition: (stats) => stats.timeElapsed >= 300,
    unlocked: false,
  },
  {
    id: 'lines_100',
    titleKey: 'Cleaner',
    descriptionKey: 'Clear 100 lines',
    icon: '🧹',
    condition: (stats) => stats.linesCleared >= 100,
    unlocked: false,
  },
];

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  stats,
  gameData,
  onAchievementUnlocked
}) => {
  const { t } = useLanguage();
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [showNotification, setShowNotification] = useState<Achievement | null>(null);

  // 載入已解鎖的成就
  useEffect(() => {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        setUnlockedAchievements(parsed);
      } catch (error) {
        console.error('Failed to parse achievements:', error);
      }
    }
  }, []);

  // 檢查成就條件
  useEffect(() => {
    achievements.forEach(achievement => {
      const isAlreadyUnlocked = unlockedAchievements.some(
        unlocked => unlocked.id === achievement.id
      );

      if (!isAlreadyUnlocked && achievement.condition(stats, gameData)) {
        const newAchievement = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date(),
        };

        setUnlockedAchievements(prev => {
          const updated = [...prev, newAchievement];
          localStorage.setItem('achievements', JSON.stringify(updated));
          return updated;
        });

        // 顯示通知
        setShowNotification(newAchievement);
        setTimeout(() => setShowNotification(null), 4000);

        // 回調
        if (onAchievementUnlocked) {
          onAchievementUnlocked(newAchievement);
        }
      }
    });
  }, [stats, gameData, unlockedAchievements, onAchievementUnlocked]);

  const getAchievementTitle = (achievement: Achievement) => {
    // 如果有翻譯，使用翻譯，否則使用原始 key
    return achievement.titleKey;
  };

  const getAchievementDescription = (achievement: Achievement) => {
    // 如果有翻譯，使用翻譯，否則使用原始 key
    return achievement.descriptionKey;
  };

  return (
    <>
      {/* 成就通知 */}
      {showNotification && (
        <div className="achievement-notification">
          <div className="achievement-notification-content">
            <div className="achievement-icon">{showNotification.icon}</div>
            <div className="achievement-text">
              <div className="achievement-title">
                {t.newAchievement}
              </div>
              <div className="achievement-name">
                {getAchievementTitle(showNotification)}
              </div>
              <div className="achievement-desc">
                {getAchievementDescription(showNotification)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AchievementSystem;
