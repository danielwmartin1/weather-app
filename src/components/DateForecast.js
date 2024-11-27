// src/components/DayForecast.js
import React from 'react';
import '../index.css';
import '../App.css';

const DayForecast = ({ dayData }) => {
    if (!dayData || !dayData.length) return null;

    const overallData = dayData[0];

    const getWindDirection = (deg) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(deg / 22.5) % 16;
        return directions[index];
      };

    const weatherDetails = [
        { label: 'Conditions', value: overallData.weather[0].description },
        { label: 'High', value: `${Math.round(overallData.main.temp_max)}°${overallData.units === 'metric' ? 'C' : 'F'}` },
        { label: 'Low', value: `${Math.round(overallData.main.temp_min)}°${overallData.units === 'metric' ? 'C' : 'F'}` },
        { label: 'Humidity', value: `${overallData.main.humidity}%` },
        { label: 'Wind Speed', value: `${overallData.wind.speed} ${overallData.units === 'metric' ? 'm/s' : 'ft/s'}` },
        { label: 'Cloud Cover', value: `${overallData.clouds.all}%` },
        { label: 'Sunrise', value: new Date(overallData.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) },
        { label: 'Sunset', value: new Date(overallData.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) },
        { label: 'Visibility', value: `${overallData.visibility / 1000} ${overallData.units === 'metric' ? 'km' : 'mi'}` },
        { label: 'Pressure', value: `${overallData.main.pressure} ${overallData.units === 'metric' ? 'hPa' : 'mmHg'}` },
        { label: 'Dew Point', value: `${Math.round(overallData.main.temp - (overallData.main.temp - ((100 - overallData.main.humidity) / 5)))}°${overallData.units === 'metric' ? 'c' : 'f'}` },
        { label: 'UV Index', value: overallData.uvi || 'N/A' },
        { label: 'Wind Direction', value: getWindDirection(overallData.wind.deg) || 'N/A' },
        { label: 'Precipitation', value: `${overallData.rain && overallData.rain['1h'] ? overallData.rain['1h'] : 0} ${overallData.units === 'metric' ? 'mm' : 'in'}` },
      ];

    return (
        <div className="weather-forecast ">
            <h2 className="dateHeader">Forecast for {new Date(overallData.dt * 1000).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</h2>
            <div className="forecast-part">
                {weatherDetails.map((detail, index) => (
                <p className='details' key={index}>{detail.label}: {detail.value}</p>
                ))}
            </div>
            <img 
                src={`http://openweathermap.org/img/wn/${overallData.weather[0].icon}@2x.png`} 
                alt={overallData.weather[0].description} 
            />
        </div>
    );
};

export default DayForecast;
