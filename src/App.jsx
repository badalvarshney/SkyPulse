import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import Loader from './components/Loader';
import WeatherOverlays from './components/WeatherOverlays';
import HistorySection from './components/HistorySection';
import ThemeSelector from './components/ThemeSelector';
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchForecastByCity,
  fetchForecastByCoords,
  fetchCitySuggestions,
  fetchWeatherHistoryByCount,
  groupForecastByDay,
} from './services/weatherApi';
import './App.css';

// Map weather condition IDs → background theme class
const getTheme = (weather) => {
  if (!weather) return 'theme-default';
  const id = weather[0].id;
  if (id >= 200 && id < 300) return 'theme-storm';
  if (id >= 300 && id < 600) return 'theme-rain';
  if (id >= 600 && id < 700) return 'theme-snow';
  if (id >= 700 && id < 800) return 'theme-fog';
  if (id === 800) return 'theme-clear';
  if (id > 800) return 'theme-cloudy';
  return 'theme-default';
};

const MAX_RECENT = 5;

const DEMO_SCENARIOS = {
  summer: {
    name: "San Diego",
    sys: { country: "US", sunrise: 1713590000, sunset: 1713640000 },
    main: { temp: 31, feels_like: 33, temp_min: 28, temp_max: 34, humidity: 40, pressure: 1012 },
    weather: [{ main: "Clear", description: "sunny and clear", icon: "01d", id: 800 }],
    wind: { speed: 4.5 },
    visibility: 10000,
    dt: Math.floor(Date.now() / 1000),
    coord: { lat: 32.7, lon: -117.1 }
  },
  winter: {
    name: "Reykjavik",
    sys: { country: "IS", sunrise: 1713590000, sunset: 1713640000 },
    main: { temp: -4, feels_like: -8, temp_min: -6, temp_max: -2, humidity: 75, pressure: 1005 },
    weather: [{ main: "Snow", description: "heavy snowfall", icon: "13d", id: 601 }],
    wind: { speed: 8.2 },
    visibility: 1500,
    dt: Math.floor(Date.now() / 1000),
    coord: { lat: 64.1, lon: -21.9 }
  },
  monsoon: {
    name: "Mumbai",
    sys: { country: "IN", sunrise: 1713590000, sunset: 1713640000 },
    main: { temp: 26, feels_like: 29, temp_min: 24, temp_max: 27, humidity: 88, pressure: 998 },
    weather: [{ main: "Rain", description: "moderate monsoon rain", icon: "10d", id: 501 }],
    wind: { speed: 6.1 },
    visibility: 4000,
    dt: Math.floor(Date.now() / 1000),
    coord: { lat: 19.0, lon: 72.8 }
  },
  storm: {
    name: "Florida",
    sys: { country: "US", sunrise: 1713590000, sunset: 1713640000 },
    main: { temp: 22, feels_like: 22, temp_min: 20, temp_max: 24, humidity: 92, pressure: 994 },
    weather: [{ main: "Thunderstorm", description: "thunderstorm with heavy rain", icon: "11d", id: 201 }],
    wind: { speed: 12.5 },
    visibility: 2000,
    dt: Math.floor(Date.now() / 1000),
    coord: { lat: 27.6, lon: -81.5 }
  },
  autumn: {
    name: "London",
    sys: { country: "GB", sunrise: 1713590000, sunset: 1713640000 },
    main: { temp: 12, feels_like: 11, temp_min: 10, temp_max: 14, humidity: 82, pressure: 1018 },
    weather: [{ main: "Fog", description: "misty morning fog", icon: "50d", id: 741 }],
    wind: { speed: 3.2 },
    visibility: 800,
    dt: Math.floor(Date.now() / 1000),
    coord: { lat: 51.5, lon: -0.1 }
  }
};

const App = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skypulse_recent') || '[]');
    } catch {
      return [];
    }
  });

  const [activeScenario, setActiveScenario] = useState(null);

  const saveRecent = (city) => {
    setRecentSearches((prev) => {
      const updated = [city, ...prev.filter((c) => c.toLowerCase() !== city.toLowerCase())].slice(0, MAX_RECENT);
      localStorage.setItem('skypulse_recent', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = useCallback(async (city) => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setActiveScenario(null);
    try {
      const [w, f] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecastByCity(city),
      ]);
      setWeather(w);
      setForecast(groupForecastByDay(f.list));
      
      // Fetch 24h History
      const startTime = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
      try {
        const hist = await fetchWeatherHistoryByCount(w.coord.lat, w.coord.lon, startTime, 24);
        setHistoryData(hist.list || []);
      } catch {
        setHistoryData([]);
      }
      
      saveRecent(city.trim());
    } catch (err) {
      setWeather(null);
      setForecast([]);
      if (err.response?.status === 404) {
        setError(`City "${city}" not found. Try another name.`);
      } else if (err.response?.status === 401) {
        setError('Invalid API key. Please check your .env file.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocationSearch = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lon } }) => {
        try {
          const [w, f] = await Promise.all([
            fetchWeatherByCoords(lat, lon),
            fetchForecastByCoords(lat, lon),
          ]);
          setWeather(w);
          setForecast(groupForecastByDay(f.list));
          
          // Fetch 24h History
          const startTime = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
          try {
            const hist = await fetchWeatherHistoryByCount(lat, lon, startTime, 24);
            setHistoryData(hist.list || []);
          } catch {
            setHistoryData([]);
          }
          
          saveRecent(w.name);
        } catch (err) {
          if (err.response?.status === 401) {
            setError('Invalid API key. Please check your .env file.');
          } else {
            setError('Could not fetch weather for your location.');
          }
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied. Please search manually.');
        setLoading(false);
      }
    );
  }, []);

  const handleSuggestionFetch = useCallback(async (query) => {
    try {
      const data = await fetchCitySuggestions(query);
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleScenarioSelect = (id) => {
    if (!id) {
      setActiveScenario(null);
      setWeather(null);
      setForecast([]);
      setHistoryData([]);
      return;
    }
    setActiveScenario(id);
    setWeather(DEMO_SCENARIOS[id]);
    setForecast([]); // Optional: could add mock forecast too
    setHistoryData([]); 
    setError(null);
  };

  const theme = getTheme(weather?.weather);

  return (
    <div className={`app ${theme}`}>
      {/* Animated background blobs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* Weather animations (Rain, Fog, etc.) */}
      <WeatherOverlays theme={theme} />

      <div className="container">
        {/* Hero Header */}
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">🌤️</span>
            <span className="logo-text">SkyPulse</span>
          </div>
          <p className="tagline">Real-time weather, anywhere in the world</p>
        </header>

        {/* Search */}
        <SearchBar
          onSearch={handleSearch}
          onLocationSearch={handleLocationSearch}
          suggestions={suggestions}
          onSuggestionFetch={handleSuggestionFetch}
          recentSearches={recentSearches}
          loading={loading}
        />

        {/* Theme Selector */}
        <ThemeSelector activeId={activeScenario} onSelect={handleScenarioSelect} />

        {/* States */}
        {loading && <Loader />}

        {error && !loading && (
          <div className="error-card fade-in" role="alert">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && !weather && (
          <div className="empty-state fade-in">
            <div className="empty-globe">🌍</div>
            <h3>Search for any city</h3>
            <p>Get real-time weather data, forecasts, humidity, wind speed and more.</p>
            <div className="feature-pills">
              {['🌡️ Temperature', '💧 Humidity', '💨 Wind', '📅 5-Day Forecast', '📍 Auto Location'].map((f) => (
                <span key={f} className="pill">{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* Weather Data */}
        {!loading && weather && (
          <>
            <WeatherCard data={weather} unit={unit} onUnitToggle={setUnit} />
            
            {historyData.length > 0 && (
              <HistorySection data={historyData} unit={unit} />
            )}

            <Forecast data={forecast} unit={unit} />

            {/* Recent Searches Bar */}
            {recentSearches.length > 0 && (
              <div className="recent-bar fade-in">
                <span className="recent-label">🕐 Recent:</span>
                {recentSearches.map((city, i) => (
                  <button
                    key={i}
                    className="recent-chip"
                    onClick={() => handleSearch(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
