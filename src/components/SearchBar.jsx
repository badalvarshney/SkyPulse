import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({
  onSearch,
  onLocationSearch,
  suggestions,
  onSuggestionFetch,
  recentSearches,
  loading,
}) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced suggestion fetch
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        onSuggestionFetch(query.trim());
      }, 400);
    }
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
    setShowDropdown(false);
  };

  const handleSuggestionClick = (city) => {
    const name = `${city.name}, ${city.country}`;
    setQuery(name);
    onSearch(city.name);
    setShowDropdown(false);
  };

  const handleRecentClick = (city) => {
    setQuery(city);
    onSearch(city);
    setShowDropdown(false);
  };

  const clearInput = () => {
    setQuery('');
    inputRef.current.focus();
    setShowDropdown(false);
  };

  const hasDropdown =
    showDropdown && (suggestions.length > 0 || recentSearches.length > 0);

  return (
    <div className="search-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search city… e.g. London, Tokyo"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            autoComplete="off"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                className="clear-btn"
                onClick={clearInput}
                aria-label="Clear search"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="search-btn"
          disabled={loading}
          aria-label="Search weather"
        >
          {loading ? <span className="btn-spinner" /> : 'Search'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="location-btn"
          onClick={onLocationSearch}
          disabled={loading}
          aria-label="Use current location"
          title="Use my location"
        >
          <MapPin size={18} />
        </motion.button>
      </form>

      <AnimatePresence>
        {hasDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="dropdown"
            ref={dropdownRef}
          >
            {recentSearches.length > 0 && suggestions.length === 0 && (
              <>
                <div className="dropdown-label">
                  <Clock size={12} /> Recent Searches
                </div>
                {recentSearches.map((city, i) => (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i}
                    className="dropdown-item recent"
                    onClick={() => handleRecentClick(city)}
                  >
                    <Clock size={14} />
                    {city}
                  </motion.button>
                ))}
              </>
            )}

            {suggestions.length > 0 && (
              <>
                <div className="dropdown-label">
                  <Search size={12} /> Suggestions
                </div>
                {suggestions.map((city, i) => (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i}
                    className="dropdown-item"
                    onClick={() => handleSuggestionClick(city)}
                  >
                    <MapPin size={14} />
                    {city.name}, {city.state ? `${city.state}, ` : ''}{city.country}
                  </motion.button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
