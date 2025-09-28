import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import './SettingsPanel.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [particlesEnabled, setParticlesEnabled] = useState(() => {
    return localStorage.getItem('particlesEnabled') !== 'false';
  });
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    return localStorage.getItem('animationsEnabled') !== 'false';
  });
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    return localStorage.getItem('autoSaveEnabled') !== 'false';
  });
  const [showFPS, setShowFPS] = useState(() => {
    return localStorage.getItem('showFPS') === 'true';
  });

  const handleParticlesToggle = () => {
    const newValue = !particlesEnabled;
    setParticlesEnabled(newValue);
    localStorage.setItem('particlesEnabled', newValue.toString());
  };

  const handleAnimationsToggle = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    localStorage.setItem('animationsEnabled', newValue.toString());
    // 動態調整 CSS 動畫
    document.documentElement.style.setProperty('--animation-speed', newValue ? '1s' : '0s');
  };

  const handleAutoSaveToggle = () => {
    const newValue = !autoSaveEnabled;
    setAutoSaveEnabled(newValue);
    localStorage.setItem('autoSaveEnabled', newValue.toString());
  };

  const handleFPSToggle = () => {
    const newValue = !showFPS;
    setShowFPS(newValue);
    localStorage.setItem('showFPS', newValue.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">{t.settings}</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="settings-content">
          {/* 主題設定 */}
          <div className="setting-group">
            <h3 className="setting-group-title">{t.theme}</h3>
            <div className="theme-selector">
              <button 
                className={`theme-option ${!isDark ? 'active' : ''}`}
                onClick={!isDark ? undefined : toggleTheme}
              >
                <div className="theme-preview light-preview">
                  <div className="preview-bg"></div>
                  <div className="preview-surface"></div>
                </div>
                <span>{t.lightMode}</span>
              </button>
              <button 
                className={`theme-option ${isDark ? 'active' : ''}`}
                onClick={isDark ? undefined : toggleTheme}
              >
                <div className="theme-preview dark-preview">
                  <div className="preview-bg"></div>
                  <div className="preview-surface"></div>
                </div>
                <span>{t.darkMode}</span>
              </button>
            </div>
          </div>

          {/* 語言設定 */}
          <div className="setting-group">
            <h3 className="setting-group-title">{t.language}</h3>
            <div className="language-selector">
              <button 
                className={`language-option ${language === 'zh' ? 'active' : ''}`}
                onClick={() => setLanguage('zh')}
              >
                <span className="flag">🇹🇼</span>
                <span>繁體中文</span>
              </button>
              <button 
                className={`language-option ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                <span className="flag">🇺🇸</span>
                <span>English</span>
              </button>
            </div>
          </div>

          {/* 視覺效果設定 */}
          <div className="setting-group">
            <h3 className="setting-group-title">Visual Effects</h3>
            <div className="toggle-settings">
              <div className="toggle-setting">
                <label className="toggle-label">
                  <span>{t.particles}</span>
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={particlesEnabled}
                      onChange={handleParticlesToggle}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
              
              <div className="toggle-setting">
                <label className="toggle-label">
                  <span>{language === 'zh' ? '動畫效果' : 'Animations'}</span>
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={animationsEnabled}
                      onChange={handleAnimationsToggle}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 遊戲設定 */}
          <div className="setting-group">
            <h3 className="setting-group-title">{language === 'zh' ? '遊戲設定' : 'Game Settings'}</h3>
            <div className="toggle-settings">
              <div className="toggle-setting">
                <label className="toggle-label">
                  <span>{language === 'zh' ? '自動保存' : 'Auto Save'}</span>
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={autoSaveEnabled}
                      onChange={handleAutoSaveToggle}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
              
              <div className="toggle-setting">
                <label className="toggle-label">
                  <span>{language === 'zh' ? '顯示FPS' : 'Show FPS'}</span>
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={showFPS}
                      onChange={handleFPSToggle}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 遊戲資訊 */}
          <div className="setting-group">
            <h3 className="setting-group-title">Game Info</h3>
            <div className="game-info">
              <div className="info-item">
                <span className="info-label">Version:</span>
                <span className="info-value">2.6.0</span>
              </div>
              <div className="info-item">
                <span className="info-label">{t.highScore}:</span>
                <span className="info-value">{localStorage.getItem('highScore') || '0'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
