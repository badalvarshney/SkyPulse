import React from 'react';
import { motion } from 'framer-motion';

const scenarios = [
  { id: 'summer', name: 'Summer', icon: '☀️', theme: 'theme-clear' },
  { id: 'winter', name: 'Winter', icon: '❄️', theme: 'theme-snow' },
  { id: 'monsoon', name: 'Rainy', icon: '🌧️', theme: 'theme-rain' },
  { id: 'storm', name: 'Stormy', icon: '⚡', theme: 'theme-storm' },
  { id: 'autumn', name: 'Autumn', icon: '🌫️', theme: 'theme-fog' },
];

const ThemeSelector = ({ onSelect, activeId }) => {
  return (
    <div className="theme-selector-wrap">
      <span className="selector-label">🎭 Try Scenarios:</span>
      <div className="theme-chips">
        {scenarios.map((s) => (
          <motion.button
            key={s.id}
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`theme-chip ${activeId === s.id ? 'active' : ''}`}
            onClick={() => onSelect(s.id)}
          >
            <span className="chip-icon">{s.icon}</span>
            <span className="chip-name">{s.name}</span>
          </motion.button>
        ))}
        {activeId && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="clear-scenario-btn"
            onClick={() => onSelect(null)}
            title="Reset to Real Data"
          >
            ✕
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;
