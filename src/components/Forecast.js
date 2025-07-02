// src/components/Forecast.js
import React, { useState } from 'react';
import '../index.css';
import '../App.css';
import '../utils/api.js';
import DayForecast from './DateForecast.js';

// Get the day name from a timestamp
const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Capitalize the first letter of a string
const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

// Get the suffix for a day (st, nd, rd, th)
const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

// Get the highest and lowest temperatures for a day
const getHighLowTemps = (day) => {
    const temps = day.map(part => part.main.temp);
    return {
        high: Math.max(...temps),
        low: Math.min(...temps)
    };
};

// Format a date with a suffix (e.g., "Apr 5th, 2024")
const formatDateWithSuffix = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).replace(
        /(\d+)(?=,)/,
        (match) => `${match}${suffix}`
    );
};

// Get the weather icon URL
const getWeatherIconUrl = (icon) =>
    `http://openweathermap.org/img/wn/${icon}@2x.png`;

// Split the forecast data into day parts (8 per day)
const getDayParts = (list) => {
    const dayParts = [];
    for (let i = 0; i < list.length; i += 8) {
        dayParts.push(list.slice(i, i + 8));
    }
    return dayParts.slice(0, 8);
};

const Forecast = React.memo(({ forecastData }) => {
    const [selectedDay, setSelectedDay] = useState(null);

    // Debug: Log forecastData on every render
    console.debug('Forecast: forecastData', forecastData);

    if (!forecastData) {
        console.warn('Forecast: Missing forecast data.');
        return null;
    }

    const dayParts = getDayParts(forecastData.list);

    // Debug: Log dayParts
    console.debug('Forecast: dayParts', dayParts);

    // Select a day to view details
    const handleDayClick = (dayData) => {
        console.debug('Forecast: handleDayClick', dayData);
        setSelectedDay(dayData);
    };

    // Go back to the overview
    const handleBackClick = () => {
        setSelectedDay(null);
    };

    return (
        <div className="forecast">
            {selectedDay ? (
                <div className="selected-day-forecast" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <DayForecast dayData={selectedDay} />
                    <button
                        className="backButton"
                        onClick={handleBackClick}
                        style={{ margin: '1rem' }}
                    >
                        Back to Overview
                    </button>
                </div>
            ) : (
                <div className="forecast-overview">
                    {dayParts.map((day, dayIndex) => (
                        <div
                            key={dayIndex}
                            className="forecast-day"
                            onClick={() => handleDayClick(day)}
                        >
                            <div className="headerContainer">
                                <h3 className="dateHeader">
                                    {getDayName(day[0].dt)} - {formatDateWithSuffix(day[0].dt)}
                                </h3>
                                <h4 className="high-low">
                                    High: {Math.round(getHighLowTemps(day).high)}°F / Low: {Math.round(getHighLowTemps(day).low)}°F
                                </h4>
                            </div>
                            {day.map((part) => (
                                <div key={part.dt} className="forecast-part">
                                    <p className="part">
                                        {new Date(part.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                    </p>
                                    <p className="part">{Math.round(part.main.temp)}°F</p>
                                    <p className="part condition">
                                        {capitalizeFirstLetter(part.weather[0].description)}
                                    </p>
                                    <img
                                        className="small-icon"
                                        src={getWeatherIconUrl(part.weather[0].icon)}
                                        alt={part.weather[0].description}
                                    />
                                    <p className="part">
                                        💧 {Math.round((part.pop || 0) * 100)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default Forecast;
