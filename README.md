# SkyPulse 🌤️

**SkyPulse** is a professional-grade, real-world weather application built with React and Vite. It provides real-time weather data, forecasts, and historical records with a premium, glassmorphic UI and dynamic seasonal themes.

![SkyPulse Preview](https://via.placeholder.com/1200x600/1e1e2e/ffffff?text=SkyPulse+Weather+App+Preview)

## ✨ Features

- **Real-time Search**: Get instant weather updates for any city worldwide with smart suggestions.
- **Auto-Location**: One-click weather detection using browser geolocation.
- **Dynamic Themes**: The entire app's aesthetic (backgrounds, orbs, and animations) changes based on current weather conditions (Storm, Rain, Snow, Fog, Clear, Cloudy).
- **Seasonal Scenarios (Demo Mode)**: Manually toggle between scenarios like **Summer**, **Winter**, **Monsoon**, **Stormy**, and **Autumn** to preview animations.
- **5-Day Forecast**: Visual breakdown of the upcoming week's weather.
- **24-Hour History**: Track temperature and conditions from the past 24 hours.
- **Unit Conversion**: Seamlessly switch between Celsius (°C) and Fahrenheit (°F).
- **Recent Searches**: Quickly jump back to your most recently searched cities.
- **Animated Overlays**: Immersive visual effects for rain, snow, and thunderstorms using Framer Motion.
7
## 🚀 Tech Stack

- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS (Custom Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: OpenWeatherMap (Current, Forecast, and History)

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v16.0.0 or higher)
- npm or yarn
- An API Key from [OpenWeatherMap](https://openweathermap.org/api)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your OpenWeatherMap API key:
```env
VITE_WEATHER_API_KEY=your_actual_api_key_here
```

### 4. Run Locally
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
src/
├── assets/         # Static assets
├── components/     # UI Components (WeatherCard, Forecast, ThemeSelector, etc.)
├── services/       # API integration logic
├── App.jsx         # Main application logic and state
├── App.css         # Global styles and themes
└── main.jsx        # Entry point
```

## 🎨 Design Philosophy

SkyPulse follows a **Glassmorphic Design** approach:
- **Translucency**: Frosted glass effects using `backdrop-filter`.
- **Vibrant Backgrounds**: Dynamic gradients and animated "blobs" (orbs) that react to weather changes.
- **Typography**: Clean, modern fonts (Outfit/Inter) for maximum readability.
- **Micro-interactions**: Subtle hover effects and smooth transitions for a premium feel.

---

Crafted with ❤️ by the SkyPulse Team.
