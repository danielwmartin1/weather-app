// src/components/Forecast.js
import React, { useState } from 'react';
import '../index.css';
import '../App.css';
import '../utils/api.js'
import DayForecast from './DateForecast.js';

// Function to get the day name from a timestamp
const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
};

const Forecast = ({ forecastData }) => {
    // State to store the selected day's data
    const [selectedDay, setSelectedDay] = useState(null);

    // Return null if there is no forecast data
    if (!forecastData) {
        return null;        
    }

    // Function to split the forecast data into day parts
    const getDayParts = (list) => {
        const dayParts = [];
        // Split the list into chunks of 8 (assuming 3-hour intervals, 8 chunks represent a day)
        for (let i = 0; i < list.length; i += 8) {
            dayParts.push(list.slice(i, i + 8));
        }
        return dayParts.slice(0, 8); // Adjust this line to get 8 days
    };

    // Function to get the weather icon URL
    const getWeatherIconUrl = (icon) => {
        return `http://openweathermap.org/img/wn/${icon}@2x.png`;
    };

    const dayParts = getDayParts(forecastData.list);

    // Handle the click event to select a day
    const handleDayClick = (dayData) => {
        setSelectedDay(dayData);
    };

    // Handle the click event to go back to the forecast overview
    const handleBackClick = () => {
        setSelectedDay(null);
    };

    // Function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Function to get the suffix for a day (st, nd, rd, th)
    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    // Function to get the highest and lowest temperatures for a day
    const getHighLowTemps = (day) => {
        const temps = day.map(part => part.main.temp);
        return {
            high: Math.max(...temps),
            low: Math.min(...temps)
        };
    };

    return (
        <div className="forecast">
            {selectedDay ? (
                // Display the selected day's forecast details
                <div onClick={handleBackClick}>
                    <DayForecast dayData={selectedDay} />
                </div>
            ) : (
                // Display the forecast overview for each day
                dayParts.map((day, dayIndex) => {
                    const { high, low } = getHighLowTemps(day);
                    return (
                        <div key={dayIndex} className="forecast-day" onClick={() => handleDayClick(day)}>
                            <div className="headerContainer">
                                <h3 className='dateHeader'>
                                    {getDayName(day[0].dt)} - {new Date(day[0].dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(/(\d+)(?=,)/, (match) => `${match}${getDaySuffix(parseInt(match))}`)}
                                </h3>
                                <h4 className="high-low">High: {Math.round(high)}°F / Low: {Math.round(low)}°F</h4>
                            </div>
                            {day.map((part) => (
                                <div key={part.dt} className="forecast-part">
                                    <p className="part">{new Date(part.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                                    <p className="part">{Math.round(part.main.temp)}°F</p>
                                    <p className="part condition">{capitalizeFirstLetter(part.weather[0].description)}</p>
                                    <img className='small-icon' src={getWeatherIconUrl(part.weather[0].icon)} alt={part.weather[0].description} />
                                </div>
                            ))}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Forecast;
