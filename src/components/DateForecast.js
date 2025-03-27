import React from 'react';
import '../index.css';
import '../App.css';
import '../utils/api.js';

const DateForecast = ({ dayData }) => {
    // If there is no data, return null
    if (!dayData || !dayData.length) return null;

    // Get the overall data for the day
    const overallData = dayData[0] || {};
    const units = overallData.units || 'imperial'; // Default to imperial if not specified

    // Function to get the day name from a timestamp
    const getDayName = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const options = { weekday: 'short' };
        return date.toLocaleDateString('en-US', options);
    };

    // Function to format the time from a timestamp
    // eslint-disable-next-line    
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Function to get the wind direction from degrees
    const getWindDirection = (deg) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(deg / 22.5) % 16;
        return `${Math.round(deg)}° ${directions[index]}`;
    };

    // Get the weather details for the day
    const temperatures = dayData.map(data => data.main.temp);
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);

    // Convert pressure from hPa to inHg
    const pressureInHg = (overallData.main.pressure * 0.02953).toFixed(2);

    // Extract wind speed and direction
    const windSpeed = overallData.wind?.speed || 0;
    const windDirection = getWindDirection(overallData.wind?.deg || 0);

    // Array of weather details to display
    const weatherDetails = [
        { label: 'Conditions', value: overallData.weather?.[0]?.description || 'N/A' },
        { label: 'High Temp', value: `${Math.round(maxTemp)}°${units === 'metric' ? 'C' : 'F'}` },
        { label: 'Low Temp', value: `${Math.round(minTemp)}°${units === 'metric' ? 'C' : 'F'}` },
        { label: 'Humidity', value: `${overallData.main?.humidity || 0}%` },
        { label: 'Cloud Cover', value: `${overallData.clouds?.all || 0}%` },
        { label: 'Visibility', value: `${overallData.visibility ? overallData.visibility / 1000 : 0} ${units === 'metric' ? 'km' : 'mi'}` },
        { label: 'Pressure', value: `${pressureInHg} inHg` },
        { label: 'Chance of Precipitation', value: `${overallData.pop ? overallData.pop * 100 : 0}%` },
        { label: 'Precipitation', value: overallData.rain?.['1h'] ? `${overallData.rain['1h']} ${units === 'metric' ? 'mm' : 'in'}` : null },
        { label: 'Snow', value: overallData.snow?.['1h'] ? `${overallData.snow['1h']} ${units === 'metric' ? 'mm' : 'in'}` : null },
        { label: 'Wind Speed', value: `${windSpeed} ${units === 'imperial' ? 'mph': 'm/s'}` },
        { label: 'Wind Direction', value: windDirection || 'N/A' },

    ].filter(detail => detail.value !== null); // Filter out null values

    // Return the day forecast
    return (
        <div className="current-weather" style={{ width: '99vw', margin: "1rem", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <h2 className="dateHeader" style={{ width: '20%', display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {getDayName(overallData.dt)} - {new Date(overallData.dt * 1000).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }).replace(/(\d+)(?=,)/, (match) => {
                    const suffix = ['th', 'st', 'nd', 'rd'];
                    const v = match % 100;
                    return match + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
                })}
            </h2>
            <div className="forecast-part" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {weatherDetails.map((detail, index) => (
                    <p className='details' key={index}>{detail.label}: {detail.value}</p>
                ))}
            </div>
            <img 
                className="small-icon"
                src={`http://openweathermap.org/img/wn/${overallData.weather[0].icon}@2x.png`} 
                alt={overallData.weather[0].description} 
            />
        </div>
    );
};

export default DateForecast;