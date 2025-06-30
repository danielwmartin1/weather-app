import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import InitialRenderImage from '../images/initial-render-image.svg';

const Search = ({ onSearch }) => {
  const [location, setLocation] = useState('');

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const value = location.trim();
    if (value === '') {
      alert('Please enter a location.');
      return;
    }
    // If input is a 5-digit zip code, search by zip
    if (/^\d{5}$/.test(value)) {
      onSearch(value);
      setLocation('');
      return;
    }
    // Otherwise, try to get location data from API
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=1&appid=${process.env.REACT_APP_API_KEY}`
      );
      if (res.data && res.data.length > 0) {
        const suggestion = res.data[0];
        const locationString = suggestion.state
          ? `${suggestion.name},${suggestion.state},${suggestion.country}`
          : `${suggestion.name},${suggestion.country}`;
        onSearch({
          name: suggestion.name,
          state: suggestion.state,
          country: suggestion.country,
          lat: suggestion.lat,
          lon: suggestion.lon,
          display: locationString
        });
      } else {
        // Fallback: just pass the string
        onSearch(value);
      }
    } catch (error) {
      onSearch(value);
    }
    setLocation('');
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
          placeholder="Enter location or 5-digit zipcode"
          value={location}
          onChange={handleInputChange}
          aria-label="Location search"
        />
        <button id="submit" type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;