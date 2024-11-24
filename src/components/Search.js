// src/components/Search.js

import React, { useState, useEffect } from 'react';

const Search = ({ onSearch }) => {
    const [city, setCity] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (city.trim() === '') {
            alert('Please enter a city');
            return;
        }
        onSearch(city);
        setCity('');
    };

    const fetchCityName = async (lat, lon, cityName) => {
        const API_KEY = 'd41e3da09b3eaeb051becd162da6e929';
        const limit = 1;
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${API_KEY}`);
        const data = await response.json();
        if (data && data.length > 0) {
            const cityName = data[0].name;
            const countryName = data[0].country;
            setCity(`${cityName}, ${countryName}`);
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchCityName(latitude, longitude);
            });
        }
    }, []);

    return (
        <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default Search;