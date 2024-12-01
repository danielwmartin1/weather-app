import '../App.css';
import '../utils/api.js';
import stateLabelValues from '../utils/stateLabelValues.js';
import React, { useState, useEffect } from 'react';
import InitialRenderImage from '../images/initial-render-image.svg'; // Adjust the path as needed

const Search = ({ onSearch }) => {
    const [location, setLocation] = useState('');
    const [initialRender, setInitialRender] = useState(true);

    const handleSearch = (e) => {
        e.preventDefault();
        if (location.trim() === '') {
            alert('Please enter a location.');
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
                const stateName = data[0].state;
                const countryName = data[0].country;
                const zipCode = data[0].zip; // Assuming the API returns a zip field
                const state = stateLabelValues.find(state => state.label === stateName);
                const stateAbbreviation = state ? state.value : stateName;
                setLocation(`${locationName}${stateAbbreviation ? `, ${stateAbbreviation}` : ''}, ${countryName}${zipCode ? `, ${zipCode}` : ''}`);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchLocationName(latitude, longitude);
            });
        }

        // Set initialRender to false after the first render
        setInitialRender(false);
    // eslint-disable-next-line
    }, []);

    return (
        <div className="home-screen">
            <div className="initial-render-image">
                <img src={InitialRenderImage} alt="Initial Render" />
            </div>
            <form onSubmit={handleSearch} className="search-form" style={{ marginBottom: location ? '20%' : '0' }}>
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