const Loader = () => (
  <div className="loader-container" aria-label="Loading weather data">
    <div className="loader-ring">
      <div className="loader-ring-inner" />
    </div>
    <p className="loader-text">Fetching weather data…</p>
  </div>
);

export default Loader;
