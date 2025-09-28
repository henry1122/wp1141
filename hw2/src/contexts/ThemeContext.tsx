import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    border: string;
    shadow: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
  };
}

const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
  },
};

const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    accent: '#60a5fa',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
    secondary: 'linear-gradient(135deg, #7c3aed 0%, #a21caf 100%)',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // 更新 CSS 變數
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });
  }, [isDark, theme]);

  const value = {
    theme,
    toggleTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
