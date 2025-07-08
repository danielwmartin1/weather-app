import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const InitialRenderImage = (process.env.PUBLIC_URL || '') + '/images/initial-render-image.svg';

const Search = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  //const suggestionsRef = useRef(null);
  const itemRefs = useRef([]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setLocation(value);
    setHighlightedIndex(-1);

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

  const formatLocationString = (suggestion) => {
    return suggestion.state
      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
  };

  const handleSuggestionClick = (suggestion) => {
    const locationString = formatLocationString(suggestion);
    setLocation(locationString);
    setSuggestions([]); // Clear suggestions
    setHighlightedIndex(-1);
    onSearch({
      name: suggestion.name,
      state: suggestion.state,
      country: suggestion.country,
      lat: suggestion.lat,
      lon: suggestion.lon,
      display: locationString,
    });
  };

  const handleInputKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSuggestionClick(suggestions[highlightedIndex]);
      }
    }
  };

  // Move focus to the highlighted suggestion item for accessibility
  useEffect(() => {
    if (
      highlightedIndex >= 0 &&
      itemRefs.current[highlightedIndex]
    ) {
      itemRefs.current[highlightedIndex].focus();
    }
  }, [highlightedIndex, suggestions]);


  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim() === '') {
      alert('Please enter a location.');
      return;
    }

    const match = suggestions.find(
      (s) => formatLocationString(s) === location.trim()
    );

    if (match) {
      onSearch({
        name: match.name,
        state: match.state,
        country: match.country,
        lat: match.lat,
        lon: match.lon,
        display: location.trim(),
      });
    } else {
      onSearch(location.trim());
    }

    setLocation('');
    setSuggestions([]);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  return (
    <div className="home-screen" >
      <div className="initial-render-image">
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={InitialRenderImage} alt="Initial Render" />
        </a>
      </div>
      <form onSubmit={handleSearch} className="search-form" autoComplete="off">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          aria-label="Location search"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={
            highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
          }
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list" id="suggestions-list" role="listbox">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className={`suggestion-item${i === highlightedIndex ? ' highlighted' : ''}`}
                onClick={() => handleSuggestionClick(s)}
                onMouseEnter={() => setHighlightedIndex(i)}
                tabIndex={i === highlightedIndex ? 0 : -1}
                ref={el => (itemRefs.current[i] = el)}
                role="option"
                aria-selected={i === highlightedIndex}
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