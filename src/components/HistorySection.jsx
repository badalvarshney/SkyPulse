import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, Sun, CloudRain, CloudLightning, CloudSnow, 
  CloudFog, CloudDrizzle, SunMedium 
} from 'lucide-react';

const getAnimatedIcon = (id) => {
  if (id >= 200 && id < 300) return <CloudLightning className="weather-svg lightning" />;
  if (id >= 300 && id < 600) return <CloudRain className="weather-svg rain" />;
  if (id >= 600 && id < 700) return <CloudSnow className="weather-svg snow" />;
  if (id >= 700 && id < 800) return <CloudFog className="weather-svg fog" />;
  if (id === 800) return <Sun className="weather-svg sun" />;
  return <Cloud className="weather-svg cloud" />;
};

const HistorySection = ({ data, unit }) => {
  if (!data || data.length === 0) return null;

  return (
    <motion.section 
      className="history-section fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="section-header">
        <h3 className="section-title">🕒 Past 24 Hours</h3>
        <span className="section-subtitle">Hourly weather history</span>
      </div>

      <div className="history-scroll-container">
        {data.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const temp = Math.round(unit === 'C' ? item.main.temp : (item.main.temp * 9/5) + 32);

          return (
            <motion.div 
              key={item.dt}
              className="history-card"
              whileHover={{ y: -5, backgroundColor: 'var(--glass-hover)' }}
            >
              <span className="history-time">{time}</span>
              <div className="history-icon-wrap">
                {getAnimatedIcon(item.weather[0].id)}
              </div>
              <span className="history-temp">{temp}°{unit}</span>
              <span className="history-desc">{item.weather[0].main}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default HistorySection;
