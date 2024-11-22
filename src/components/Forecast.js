// src/components/Forecast.js
import React from 'react';

const Forecast = ({ forecastData }) => {
    if (!forecastData) {
        return null;        
    }
    const getDayParts = (list) => {
        const dayParts = [];
        for (let i = 0; i < list.length; i += 8) {
            dayParts.push(list.slice(i, i + 8));
        }
        return dayParts.slice(0, 5); // Get data for 2 days
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

        if (day > 3 && day < 21) {
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

    return (
        <div className="forecast">
            {dayParts.map((day, dayIndex) => (
                <div key={dayIndex} className="forecast-day">
                    <h3>{getDayName(day[0].dt)} - {formatDate(day[0].dt)}</h3>
                    {day.map((part, partIndex) => (
                        <div key={part.dt} className="forecast-part">
                            <p>{new Date(part.dt * 1000).toLocaleTimeString()}</p>
                            <p>{Math.round(part.main.temp)}°F</p>
                            <p>{part.weather[0].description}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Forecast;
