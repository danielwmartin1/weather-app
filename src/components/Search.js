import '../App.css';
import '../utils/api.js';
import stateLabelValues from '../utils/stateLabelValues.js';
import React, { useState, useEffect } from 'react';
import InitialRenderImage from '../images/initial-render-image.svg'; // Adjust the path as needed

const Search = ({ onSearch }) => {
    // State to store the location input by the user
    const [location, setLocation] = useState('');
    // State to track if it's the initial render
    //eslint-disable-next-line
    const [initialRender, setInitialRender] = useState(true);

    // Handle the search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        // Check if the location input is empty
        if (location.trim() === '') {
            alert('Please enter a location.');
            return;
        }
        // Call the onSearch function passed as a prop with the location
        onSearch(location);
        // Clear the location input
        setLocation('');
    };

    useEffect(() => {
        // Function to fetch the location name based on latitude and longitude
        const fetchLocationName = async (lat, lon) => {
            const API_KEY = process.env.REACT_APP_API_KEY;
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
                const fullLocation = `${locationName}${stateAbbreviation ? `, ${stateAbbreviation}` : ''}, ${countryName}${zipCode ? `, ${zipCode}` : ''}`;
                // Set the location state with the full location name
                setLocation(fullLocation);
                // Automatically search for the current weather with the full location name
                onSearch(fullLocation);
            }
        };

        // Check if the browser supports geolocation
        if (navigator.geolocation) {
            // Get the current position of the user
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                // Fetch the location name based on the user's coordinates
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