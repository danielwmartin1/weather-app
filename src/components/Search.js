// src/components/Search.js
import '../index.css';
import '../App.css';
import React, { useState, useEffect } from 'react';

const Search = ({ onSearch }) => {
    const [location, setLocation] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (location.trim() === '') {
            alert('Please enter a location');
            return;
        }
        onSearch(location);
        setLocation('');
    };

    useEffect(() => {
        const fetchLocationName = async (lat, lon) => {
            const API_KEY = 'd41e3da09b3eaeb051becd162da6e929';
            const limit = 1;
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${API_KEY}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const locationName = data[0].name;
                const state = data[0].state ? data[0].state : '';
                const county = data[0].county ? data[0].county : '';
                const countryName = data[0].country;
                setLocation(`${locationName}${county ? `, ${county}` : ''}${state ? `, ${state}` : ''}, ${countryName}`);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchLocationName(latitude, longitude);
            });
        }
    }, []);

    return (
        <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default Search;