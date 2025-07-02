import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

// Path to the initial render image
const InitialRenderImage = (process.env.PUBLIC_URL || '') + '/images/initial-render-image.svg';

const Search = ({ onSearch }) => {
  // State for the input value
  const [location, setLocation] = useState('');
  // State for autocomplete suggestions
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions from OpenWeatherMap API as user types
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setLocation(value);

    // Only fetch suggestions if input length > 2
    if (value.length > 2) {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${process.env.REACT_APP_API_KEY}`
        );
        setSuggestions(res.data || []);
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Format suggestion for display
  const formatLocationString = (suggestion) => {
    return suggestion.state
      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
  };

  // Handle user clicking a suggestion
  const handleSuggestionClick = (suggestion) => {
    const locationString = formatLocationString(suggestion);
    setLocation(locationString);
    setSuggestions([]);
    onSearch({
      name: suggestion.name,
      state: suggestion.state,
      country: suggestion.country,
      lat: suggestion.lat,
      lon: suggestion.lon,
      display: locationString,
    });
  };

  // Handle form submission (search)
  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim() === '') {
      alert('Please enter a location.');
      return;
    }

    // Try to match input with a suggestion
    const match = suggestions.find(
      (s) => formatLocationString(s) === location.trim()
    );

    if (match) {
      // If match found, pass full suggestion object
      onSearch({
        name: match.name,
        state: match.state,
        country: match.country,
        lat: match.lat,
        lon: match.lon,
        display: location.trim(),
      });
    } else {
      // Otherwise, pass the raw input string
      onSearch(location.trim());
    }

    setLocation('');
    setSuggestions([]);
  };

  return (
    <div className="home-screen">
      {/* Initial render image with link to OpenWeatherMap */}
      <div className="initial-render-image">
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={InitialRenderImage} alt="Initial Render" />
        </a>
      </div>
      {/* Search form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={handleInputChange}
          aria-label="Location search"
        />
        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, i) => (
              <li
                className="suggestion-item"
                key={i}
                onClick={() => handleSuggestionClick(s)}
              >
                {formatLocationString(s)}
              </li>
            ))}
          </ul>
        )}
        <button id="submit" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;