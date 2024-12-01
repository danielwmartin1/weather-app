// src/components/DayForecast.js
import React from 'react';
import '../index.css';
import '../App.css';
import '../utils/api.js'

const DayForecast = ({ dayData }) => {
    // If there is no data, return null
    if (!dayData || !dayData.length) return null;

    // Get the overall data for the day
    const overallData = dayData[0] || {};

    // Get the weather details for the day
    const weatherDetails = [
        { label: 'Conditions', value: overallData.weather[0].description },
        //{ label: 'High', value: `${Math.round(overallData.main.temp_max)}°${overallData.units === 'metric' ? 'C' : 'F'}` },
        //{ label: 'Low', value: `${Math.round(overallData.main.temp_min)}°${overallData.units === 'metric' ? 'C' : 'F'}` },
        { label: 'Average Temp', value: `${Math.round(overallData.main.temp)}°${overallData.units === 'metric' ? 'C' : 'F'}` },
        { label: 'Humidity', value: `${overallData.main.humidity}%` },
       // { label: 'Wind Speed', value: `${overallData.wind.speed} ${overallData.units === 'metric' ? 'm/s' : 'ft/s'}` },
        { label: 'Cloud Cover', value: `${overallData.clouds.all}%` },
        //{ label: 'Sunrise', value: new Date(overallData.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) },
        //{ label: 'Sunset', value: new Date(overallData.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) },
        { label: 'Visibility', value: `${overallData.visibility / 1000} ${overallData.units === 'metric' ? 'km' : 'mi'}` },
        { label: 'Pressure', value: `${overallData.units === 'metric' ? overallData.main.pressure + ' hPa' : (overallData.main.pressure * 0.750062).toFixed(2) + ' mmHg'}` },
        //{ label: 'Dew Point', value: `${Math.round(overallData.main.temp - (overallData.main.temp - ((100 - overallData.main.humidity) / 5)))}°${overallData.units === 'metric' ? 'C' : 'F'}` },
        { label: 'Chance of Precipitation', value: `${overallData.pop ? overallData.pop * 100 : 0}%` },
        { label: 'Precipitation', value: `${overallData.rain && overallData.rain['1h'] ? overallData.rain['1h'] : 0} ${overallData.units === 'metric' ? 'mm' : 'in'}` },

    ];
    
    // Return the day forecast
    return (
        <div className="current-weather">
            <h2 className="dateHeader">{new Date(overallData.dt * 1000).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).replace(/(\d+)(?=,)/, (match) => {
                const suffix = ['th', 'st', 'nd', 'rd'];
                const v = match % 100;
                return match + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
            })}</h2>
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
