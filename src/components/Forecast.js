// src/components/Forecast.js
import React, { useState } from 'react';
import '../index.css';
import '../App.css';
import '../utils/api.js'
import DayForecast from './DateForecast.js';
import CurrentWeather from './CurrentWeather.js';

const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
};

const Forecast = ({ forecastData }) => {
    const [selectedDay, setSelectedDay] = useState(null);

    if (!forecastData) {
        return null;        
    }
    const getDayParts = (list) => {
        const dayParts = [];
        for (let i = 0; i < list.length; i += 8) {
            dayParts.push(list.slice(i, i + 8));
        }
        return dayParts.slice(0, 8); // Adjust this line to get 8 days
    };
    const getWeatherIconUrl = (icon) => {
        return `http://openweathermap.org/img/wn/${icon}@2x.png`;
    };
    const dayParts = getDayParts(forecastData.list);

    const handleDayClick = (dayData) => {
        setSelectedDay(dayData);
    };

    const handleBackClick = () => {
        setSelectedDay(null);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="forecast">
            {selectedDay ? (
                <div onClick={handleBackClick}>
                    <DayForecast dayData={selectedDay} />
                </div>
            ) : (
                dayParts.map((day, dayIndex) => (
                    <div key={dayIndex} className="forecast-day" onClick={() => handleDayClick(day)}>
                        <h3 className='dateHeader'>
                            {getDayName(day[0].dt)} - {new Date(day[0].dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </h3>
                        {day.map((part) => (
                            <div key={part.dt} className="forecast-part">
                                <p className="part">{new Date(part.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                                <p className="part">{Math.round(part.main.temp)}°F</p>
                                <p className="part condition">{capitalizeFirstLetter(part.weather[0].description)}</p>
                                <img className='small-icon' src={getWeatherIconUrl(part.weather[0].icon)} alt={part.weather[0].description} />
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default Forecast;
