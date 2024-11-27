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
    const stateLabelValues = [
        { 'label':'Alabama', 'value': 'AL' },
        { 'label':'Alaska', 'value': 'AK'},
        { 'label':'American Samoa', 'value': 'AS'},
        { 'label':'Arizona', 'value': 'AZ'},
        { 'label':'Arkansas', 'value': 'AR'},
        { 'label':'California', 'value': 'CA'},
        { 'label':'Colorado', 'value': 'CO'},
        { 'label':'Connecticut', 'value': 'CT'},
        { 'label':'Delaware', 'value': 'DE'},
        { 'label':'District of Columbia', 'value': 'DC'},
        { 'label':'States of Micronesia', 'value': 'FM'},
        { 'label':'Florida', 'value': 'FL'},
        { 'label':'Georgia', 'value': 'GA'},
        { 'label':'Guam', 'value': 'GU'},
        { 'label':'Hawaii', 'value': 'HI'},
        { 'label':'Idaho', 'value': 'ID'},
        { 'label':'Illinois', 'value': 'IL'},
        { 'label':'Indiana', 'value': 'IN'},
        { 'label':'Iowa', 'value': 'IA'},
        { 'label':'Kansas', 'value': 'KS'},
        { 'label':'Kentucky', 'value': 'KY'},
        { 'label':'Louisiana', 'value': 'LA'},
        { 'label':'Maine', 'value': 'ME'},
        { 'label':'Marshall Islands', 'value': 'MH'},
        { 'label':'Maryland', 'value': 'MD'},
        { 'label':'Massachusetts', 'value': 'MA'},
        { 'label':'Michigan', 'value': 'MI'},
        { 'label':'Minnesota', 'value': 'MN'},
        { 'label':'Mississippi', 'value': 'MS'},
        { 'label':'Missouri', 'value': 'MO'},
        { 'label':'Montana', 'value': 'MT'},
        { 'label':'Nebraska', 'value': 'NE'},
        { 'label':'Nevada', 'value': 'NV'},
        { 'label':'New Hampshire', 'value': 'NH'},
        { 'label':'New Jersey', 'value': 'NJ'},
        { 'label':'New Mexico', 'value': 'NM'},
        { 'label':'New York', 'value': 'NY'},
        { 'label':'North Carolina', 'value': 'NC'},
        { 'label':'North Dakota', 'value': 'ND'},
        { 'label':'Northern Mariana Islands', 'value': 'MP'},
        { 'label':'Ohio', 'value': 'OH'},
        { 'label':'Oklahoma', 'value': 'OK'},
        { 'label':'Oregon', 'value': 'OR'},
        { 'label':'Palau', 'value': 'PW'},
        { 'label':'Pennsylvania', 'value': 'PA'},
        { 'label':'Puerto Rico', 'value': 'PR'},
        { 'label':'Rhode Island', 'value': 'RI'},
        { 'label':'South Carolina', 'value': 'SC'},
        { 'label':'South Dakota', 'value': 'SD'},
        { 'label':'Tennessee', 'value': 'TN'},
        { 'label':'Texas', 'value': 'TX'},
        { 'label':'Utah', 'value': 'UT'},
        { 'label':'Vermont', 'value': 'VT'},
        { 'label':'Virgin Islands', 'value': 'VI'},
        { 'label':'Virginia', 'value': 'VA'},
        { 'label':'Washington', 'value': 'WA'},
        { 'label':'West Virginia', 'value': 'WV'},
        { 'label':'Wisconsin', 'value': 'WI'},
        { 'label':'Wyoming', 'value': 'WY'}
    ];

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
                const state = stateLabelValues.find(state => state.label === stateName);
                const stateAbbreviation = state ? state.value : stateName;
                setLocation(`${locationName}${stateAbbreviation ? `, ${stateAbbreviation}` : ''}, ${countryName}`);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchLocationName(latitude, longitude);
            });
        }
    // eslint-disable-next-line
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