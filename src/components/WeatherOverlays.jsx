import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RainOverlay = () => {
  // Generate more prominent storm clouds constrained to the very top
  const clouds = Array.from({ length: 12 }).map((_, i) => ({
    id: `cloud-${i}`,
    top: `${Math.random() * 20 - 10}%`, // Positioned between -10% and 10% (very top)
    duration: 8 + Math.random() * 10,
    delay: -Math.random() * 20,
    size: 600 + Math.random() * 400,
    opacity: 0.4 + Math.random() * 0.4,
  }));

  // Generate 40 raindrops
  const raindrops = Array.from({ length: 40 }).map((_, i) => ({
    id: `drop-${i}`,
    left: `${Math.random() * 100}%`,
    duration: 0.4 + Math.random() * 0.4,
    delay: Math.random() * 2,
    opacity: 0.2 + Math.random() * 0.3,
  }));

  return (
    <div className="weather-overlay rain-overlay" aria-hidden="true">
      {/* Moving Storm Clouds */}
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="storm-cloud"
          initial={{ x: '-40%', opacity: 0 }}
          animate={{ x: '140%', opacity: [0, cloud.opacity, cloud.opacity, 0] }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            delay: cloud.delay,
            ease: "linear",
          }}
          style={{
            top: cloud.top,
            width: cloud.size,
            height: cloud.size * 0.4,
          }}
        />
      ))}

      {/* Falling Rain */}
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="rain-drop"
          style={{
            left: drop.left,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  );
};

const FogOverlay = () => {
  // Create 8 large drifting fog clouds (increased count and speed)
  const clouds = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    top: `${5 + Math.random() * 85}%`,
    duration: 15 + Math.random() * 12, // Faster than before (was 20-35s)
    delay: -Math.random() * 20,
    size: 400 + Math.random() * 400,
    opacity: 0.3 + Math.random() * 0.3,
  }));

  return (
    <div className="weather-overlay fog-overlay" aria-hidden="true">
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="fog-cloud"
          initial={{ x: '-30%', opacity: 0 }}
          animate={{ x: '130%', opacity: [0, cloud.opacity, cloud.opacity, 0] }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            delay: cloud.delay,
            ease: "linear",
          }}
          style={{
            top: cloud.top,
            width: cloud.size,
            height: cloud.size * 0.5,
          }}
        />
      ))}
    </div>
  );
};

const SnowOverlay = () => {
  // Generate 60 snowflakes with varying size and speed
  const snowflakes = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 6,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 5,
    wobble: 10 + Math.random() * 30,
  }));

  return (
    <div className="weather-overlay snow-overlay" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snow-flake"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: `${flake.duration}s, 3s`,
            animationDelay: `${flake.delay}s, ${flake.delay}s`,
            '--wobble-dist': `${flake.wobble}px`,
          }}
        />
      ))}
    </div>
  );
};

const StormOverlay = () => {
  return (
    <div className="weather-overlay storm-overlay" aria-hidden="true">
      <div className="lightning-bg-flash" />
      <RainOverlay />
    </div>
  );
};

const WeatherOverlays = ({ theme }) => {
  return (
    <AnimatePresence mode="wait">
      {theme === 'theme-storm' && (
        <motion.div
          key="storm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StormOverlay />
        </motion.div>
      )}
      {theme === 'theme-rain' && (
        <motion.div
          key="rain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <RainOverlay />
        </motion.div>
      )}
      {theme === 'theme-fog' && (
        <motion.div
          key="fog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <FogOverlay />
        </motion.div>
      )}
      {theme === 'theme-snow' && (
        <motion.div
          key="snow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <SnowOverlay />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WeatherOverlays;
