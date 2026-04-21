import { motion, AnimatePresence } from 'framer-motion';
import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  ArrowUp,
  ArrowDown,
  MapPin,
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

const WeatherIcon = ({ icon, size = 64 }) => {
  const iconMap = {
    '01d': <Sun className="weather-svg sun" />,
    '01n': <Moon className="weather-svg moon" />,
    '02d': <CloudSun className="weather-svg cloud-sun" />,
    '02n': <CloudMoon className="weather-svg cloud-moon" />,
    '03d': <Cloud className="weather-svg cloud" />,
    '03n': <Cloud className="weather-svg cloud" />,
    '04d': <Cloud className="weather-svg cloud" />,
    '04n': <Cloud className="weather-svg cloud" />,
    '09d': <CloudDrizzle className="weather-svg rain" />,
    '09n': <CloudDrizzle className="weather-svg rain" />,
    '10d': <CloudRain className="weather-svg rain" />,
    '10n': <CloudRain className="weather-svg rain" />,
    '11d': <CloudLightning className="weather-svg lightning" />,
    '11n': <CloudLightning className="weather-svg lightning" />,
    '13d': <CloudSnow className="weather-svg snow" />,
    '13n': <CloudSnow className="weather-svg snow" />,
    '50d': <CloudFog className="weather-svg fog" />,
    '50n': <CloudFog className="weather-svg fog" />,
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: [0, 2, -2, 0] }}
      transition={{
        duration: 0.5,
        rotate: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
      }}
      className="weather-icon-motion"
    >
      {iconMap[icon] || <Sun className="weather-svg sun" />}
    </motion.div>
  );
};

const WeatherCard = ({ data, unit, onUnitToggle }) => {
  if (!data) return null;

  const {
    name,
    sys: { country, sunrise, sunset },
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    weather: [{ description, icon }],
    wind: { speed },
    visibility,
    dt,
  } = data;

  const displayTemp = (c) =>
    unit === 'C' ? `${Math.round(c)}°C` : `${celsiusToFahrenheit(c)}°F`;

  const formatTime = (unix) =>
    new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (unix) =>
    new Date(unix * 1000).toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="weather-card"
    >
      {/* Header */}
      <div className="card-header">
        <div className="city-info">
          <div className="city-name">
            <MapPin size={18} className="city-pin" />
            <h2>{name}, {country}</h2>
          </div>
          <p className="card-date">{formatDate(dt)}</p>
        </div>

        {/* Unit Toggle */}
        <div className="unit-toggle" role="group" aria-label="Temperature unit">
          <button
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => onUnitToggle('C')}
          >
            °C
          </button>
          <button
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => onUnitToggle('F')}
          >
            °F
          </button>
        </div>
      </div>

      {/* Main Temp */}
      <div className="temp-section">
        <div className="weather-icon-wrap">
          <WeatherIcon icon={icon} />
        </div>
        <div className="temp-info">
          <span className="temp-main">{displayTemp(temp)}</span>
          <span className="temp-desc">{description}</span>
          <span className="feels-like">Feels like {displayTemp(feels_like)}</span>
        </div>
        <div className="temp-range">
          <span className="temp-high">
            <ArrowUp size={14} /> {displayTemp(temp_max)}
          </span>
          <span className="temp-low">
            <ArrowDown size={14} /> {displayTemp(temp_min)}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div whileHover={{ y: -5 }} className="stat-item">
          <Droplets size={20} className="stat-icon humidity" />
          <div>
            <span className="stat-value">{humidity}%</span>
            <span className="stat-label">Humidity</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="stat-item">
          <Wind size={20} className="stat-icon wind" />
          <div>
            <span className="stat-value">{Math.round(speed)} m/s</span>
            <span className="stat-label">Wind Speed</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="stat-item">
          <Eye size={20} className="stat-icon visibility" />
          <div>
            <span className="stat-value">{visibility ? `${(visibility / 1000).toFixed(1)} km` : 'N/A'}</span>
            <span className="stat-label">Visibility</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="stat-item">
          <Gauge size={20} className="stat-icon pressure" />
          <div>
            <span className="stat-value">{pressure} hPa</span>
            <span className="stat-label">Pressure</span>
          </div>
        </motion.div>
      </div>

      {/* Sunrise / Sunset */}
      <div className="sun-row">
        <div className="sun-item">
          <span className="sun-emoji">🌅</span>
          <div>
            <span className="sun-label">Sunrise</span>
            <span className="sun-time">{formatTime(sunrise)}</span>
          </div>
        </div>
        <div className="sun-divider" />
        <div className="sun-item">
          <span className="sun-emoji">🌇</span>
          <div>
            <span className="sun-label">Sunset</span>
            <span className="sun-time">{formatTime(sunset)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
