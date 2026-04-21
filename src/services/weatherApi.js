import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const IS_MOCK = !API_KEY || API_KEY === 'your_openweathermap_api_key_here';

// ── Mock Data Generator ──────────────────────────────────────────────────────
const getMockWeather = (city = 'Demo City') => {
  const isRain = city.toLowerCase().includes('rain');
  const isFog = city.toLowerCase().includes('fog') || city.toLowerCase().includes('mist');
  const isSnow = city.toLowerCase().includes('snow') || city.toLowerCase().includes('winter') || city.toLowerCase().includes('ice');
  
  return {
    name: city,
    sys: { country: 'AQ', sunrise: Date.now() / 1000 - 20000, sunset: Date.now() / 1000 + 20000 },
    main: { 
      temp: isRain ? 12 : isFog ? 8 : isSnow ? -2 : 15 + Math.random() * 15, 
      feels_like: isSnow ? -6 : 14 + Math.random() * 15, 
      temp_min: isSnow ? -10 : 10, 
      temp_max: isSnow ? 2 : 30, 
      humidity: isRain ? 90 : isFog ? 95 : isSnow ? 70 : 40 + Math.random() * 40, 
      pressure: 1012 
    },
    weather: [
      isRain 
        ? { description: 'moderate rain', icon: '10d', main: 'Rain', id: 500 }
        : isFog 
          ? { description: 'misty fog', icon: '50d', main: 'Fog', id: 701 }
          : isSnow
            ? { description: 'heavy snow', icon: '13d', main: 'Snow', id: 601 }
            : Math.random() > 0.5 
              ? { description: 'clear sky', icon: '01d', main: 'Clear', id: 800 }
              : { description: 'scattered clouds', icon: '03d', main: 'Clouds', id: 803 }
    ],
    wind: { speed: 2 + Math.random() * 8 },
    visibility: isFog ? 500 : 10000,
    coord: { lat: 28.6139, lon: 77.2090 },
    dt: Date.now() / 1000,
  };
};

const getMockForecast = () => ({
  list: Array.from({ length: 40 }).map((_, i) => {
    const isClear = Math.random() > 0.5;
    return {
      dt: Date.now() / 1000 + i * 10800,
      dt_txt: new Date(Date.now() + i * 10800 * 1000).toISOString().replace('T', ' ').substring(0, 19),
      main: { temp: 15 + Math.random() * 10, temp_min: 12, temp_max: 28 },
      weather: [{ 
        main: isClear ? 'Clear' : 'Clouds', 
        description: isClear ? 'clear sky' : 'broken clouds', 
        id: isClear ? 800 : 803,
        icon: isClear ? '01d' : '03d' 
      }],
    };
  }),
});

// ── Current Weather ──────────────────────────────────────────────────────────
export const fetchWeatherByCity = async (city) => {
  if (IS_MOCK) return getMockWeather(city);
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: { q: city, appid: API_KEY, units: 'metric' },
  });
  return response.data;
};

export const fetchWeatherByCoords = async (lat, lon) => {
  if (IS_MOCK) return getMockWeather('My Location');
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: API_KEY, units: 'metric' },
  });
  return response.data;
};

// ── 5-Day Forecast ───────────────────────────────────────────────────────────
export const fetchForecastByCity = async (city) => {
  if (IS_MOCK) return getMockForecast();
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: { q: city, appid: API_KEY, units: 'metric' },
  });
  return response.data;
};

export const fetchForecastByCoords = async (lat, lon) => {
  if (IS_MOCK) return getMockForecast();
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, appid: API_KEY, units: 'metric' },
  });
  return response.data;
};

// ── Historical Weather ───────────────────────────────────────────────────────
const HISTORY_URL = 'https://history.openweathermap.org/data/2.5/history/city';

export const fetchWeatherHistoryByCount = async (lat, lon, start, cnt = 24) => {
  console.log(`Fetching history for ${lat},${lon} starting at ${start}`);
  if (IS_MOCK) {
    const list = Array.from({ length: cnt }).map((_, i) => ({
      ...getMockWeather('History Hour'),
      dt: start + i * 3600,
      main: { ...getMockWeather().main, temp: 15 + Math.random() * 5 }
    }));
    return { list };
  }
  const response = await axios.get(HISTORY_URL, {
    params: { lat, lon, type: 'hour', start, cnt, appid: API_KEY, units: 'metric' },
  });
  return response.data;
};

export const fetchWeatherHistoryByRange = async (lat, lon, start, end) => {
  if (IS_MOCK) return { list: [getMockWeather('History Range Demo')] };
  const response = await axios.get(HISTORY_URL, {
    params: { lat, lon, type: 'hour', start, end, appid: API_KEY, units: 'metric' },
  });
  return response.data;
};

// ── City Search Suggestions ──────────────────────────────────────────────────
export const fetchCitySuggestions = async (query) => {
  if (IS_MOCK) return [{ name: 'Demo City', country: 'AQ', state: 'Mock' }];
  if (!query || query.length < 2) return [];
  const response = await axios.get(`${GEO_URL}/direct`, {
    params: { q: query, limit: 5, appid: API_KEY },
  });
  return response.data;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
export const getWeatherIconUrl = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

export const celsiusToFahrenheit = (c) => Math.round((c * 9) / 5 + 32);
export const fahrenheitToCelsius = (f) => Math.round(((f - 32) * 5) / 9);

// Group forecast by day (12:00:00 entries)
export const groupForecastByDay = (list) => {
  const days = {};
  list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });
  // Return one representative entry per day (closest to noon)
  return Object.entries(days)
    .slice(1, 6)
    .map(([date, items]) => {
      const noon = items.find((i) => i.dt_txt.includes('12:00')) || items[0];
      return { date, ...noon };
    });
};
