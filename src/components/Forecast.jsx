import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudSun,
  CloudMoon,
  CloudDrizzle,
  CloudFog,
} from 'lucide-react';
import { celsiusToFahrenheit } from '../services/weatherApi';

const ForecastIcon = ({ icon }) => {
  const iconMap = {
    '01d': <Sun className="forecast-svg sun" />,
    '01n': <Moon className="forecast-svg moon" />,
    '02d': <CloudSun className="forecast-svg cloud-sun" />,
    '02n': <CloudMoon className="forecast-svg cloud-moon" />,
    '03d': <Cloud className="forecast-svg cloud" />,
    '03n': <Cloud className="forecast-svg cloud" />,
    '04d': <Cloud className="forecast-svg cloud" />,
    '04n': <Cloud className="forecast-svg cloud" />,
    '09d': <CloudDrizzle className="forecast-svg rain" />,
    '09n': <CloudDrizzle className="forecast-svg rain" />,
    '10d': <CloudRain className="forecast-svg rain" />,
    '10n': <CloudRain className="forecast-svg rain" />,
    '11d': <CloudLightning className="forecast-svg lightning" />,
    '11n': <CloudLightning className="forecast-svg lightning" />,
    '13d': <CloudSnow className="forecast-svg snow" />,
    '13n': <CloudSnow className="forecast-svg snow" />,
    '50d': <CloudFog className="forecast-svg fog" />,
    '50n': <CloudFog className="forecast-svg fog" />,
  };

  return <div className="forecast-icon-wrap">{iconMap[icon] || <Sun />}</div>;
};

const Forecast = ({ data, unit }) => {
  if (!data || data.length === 0) return null;

  const displayTemp = (c) =>
    unit === 'C' ? `${Math.round(c)}°C` : `${celsiusToFahrenheit(c)}°F`;

  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="forecast-container"
    >
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {data.map((day, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="forecast-card"
          >
            <span className="forecast-day">{formatDay(day.date)}</span>
            <ForecastIcon icon={day.weather[0].icon} />
            <span className="forecast-desc">{day.weather[0].main}</span>
            <div className="forecast-temps">
              <span className="forecast-high">{displayTemp(day.main.temp_max)}</span>
              <span className="forecast-low">{displayTemp(day.main.temp_min)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Forecast;
