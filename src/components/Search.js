import React, { useState } from 'react';
import '../App.css';
import InitialRenderImage from '../images/initial-render-image.svg';

const Search = ({ onSearch }) => {
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim() === '') {
      alert('Please enter a location.');
      return;
    }
    onSearch(location);
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
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button id="submit" type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;