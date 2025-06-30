import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import InitialRenderImage from '../images/initial-render-image.svg';

const Search = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions as user types
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length > 2) {
      // Example using OpenWeatherMap Geocoding API
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${process.env.REACT_APP_API_KEY}`
      );
      setSuggestions(res.data || []);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const locationString = suggestion.state
      ? `${suggestion.name},${suggestion.state},${suggestion.country}`
      : `${suggestion.name},${suggestion.country}`;
    setLocation(locationString);
    setSuggestions([]);
    // Pass the full suggestion object to onSearch
    onSearch({
      name: suggestion.name,
      state: suggestion.state,
      country: suggestion.country,
      lat: suggestion.lat,
      lon: suggestion.lon,
      display: locationString
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim() === '') {
      alert('Please enter a location.');
      return;
    }
    // If suggestions exist and input matches a suggestion, use its lat/lon
    const match = suggestions.find(s => {
      const str = s.state
        ? `${s.name},${s.state},${s.country}`
        : `${s.name},${s.country}`;
      return str === location.trim();
    });
    if (match) {
      onSearch({
        name: match.name,
        state: match.state,
        country: match.country,
        lat: match.lat,
        lon: match.lon,
        display: location.trim()
      });
    } else {
      // Otherwise, fallback to string search (your app should handle this)
      onSearch(location.trim());
    }
    setLocation('');
    setSuggestions([]);
  };

  return (
    <div className="home-screen">
      <div className="initial-render-image">
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={InitialRenderImage} alt="Initial Render" />
        </a>
      </div>
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
              <li key={i} onClick={() => handleSuggestionClick(s)}>
                {s.name}, {s.state ? `${s.state}, ` : ''}{s.country}
              </li>
            ))}
          </ul>
        )}
        <button id="submit" type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;