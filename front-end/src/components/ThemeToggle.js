import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span style={{ fontSize: '20px' }}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;
