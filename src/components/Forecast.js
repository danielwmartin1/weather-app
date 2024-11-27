// src/components/Forecast.js
import React, { useState } from 'react';
import '../index.css';
import '../App.css';
import DayForecast from './DateForecast.js';

const Forecast = ({ forecastData }) => {
    const [selectedDay, setSelectedDay] = useState(null);

    if (!forecastData) {
        return null;        
    }
    const getDayParts = (list) => {
        const dayParts = [];
        for (let i = 0; i < list.length; i += 5) {
            dayParts.push(list.slice(i, i + 5));
        }
        return dayParts.slice(0, 5); // Get data for 2 days
    };
    const getWeatherIconUrl = (icon) => {
        return `http://openweathermap.org/img/wn/${icon}@2x.png`;
    };
    const dayParts = getDayParts(forecastData.list);

    const getDayName = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const day = date.getDate();
        let daySuffix;

        if (day === 11 || day === 12 || day === 13) {
            daySuffix = 'th';
        } else {
            switch (day % 10) {
                case 1: daySuffix = 'st'; break;
                case 2: daySuffix = 'nd'; break;
                case 3: daySuffix = 'rd'; break;
                default: daySuffix = 'th'; break;
            }
        }

        return formattedDate.replace(/\d+/, day + daySuffix);
    };

    const handleDayClick = (dayData) => {
        setSelectedDay(dayData);
    };

    return (
        <div className="forecast">
            {selectedDay ? (<DayForecast dayData={selectedDay} />) : (
                dayParts.map((day, dayIndex) => (
                    <div key={dayIndex} className="forecast-day">
                        <h3 className='dateHeader' onClick={() => handleDayClick(day)}>
                            {getDayName(day[0].dt)} - {formatDate(day[0].dt)}
                        </h3>
                        {day.map((part, partIndex) => (
                            <div key={part.dt} className="forecast-part">
                                <p>{new Date(part.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                                <p>{Math.round(part.main.temp)}°F</p>
                                <p>{part.weather[0].description}</p>
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
