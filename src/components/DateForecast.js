import React from 'react';
import '../index.css';
import '../App.css';
import '../utils/api.js';

// Returns the short weekday name (e.g., "Mon") from a Unix timestamp
const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Returns wind direction as a string (e.g., "90° E")
const getWindDirection = (deg) => {
    const directions = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
    ];
    const index = Math.round(deg / 22.5) % 16;
    return `${Math.round(deg)}° ${directions[index]}`;
};

// Returns a formatted date string with ordinal suffix (e.g., "Jun 1st, 2024")
const getDateWithSuffix = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = day % 100;
    const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
        .replace(day, day + suffix);
};

// Main component to display the forecast for a specific date
const DateForecast = ({ dayData }) => {
    // Debug: Log incoming dayData
    console.debug('DateForecast: dayData:', dayData);

    // Return nothing if no data is provided
    if (!dayData || !dayData.length) {
        console.warn('DateForecast: No dayData provided or empty array.');
        return null;
    }

    // Use the first entry as the overall data for the day
    const overallData = dayData[0] || {};
    const units = overallData.units || 'imperial';

    // Debug: Log overallData and units
    console.debug('DateForecast: overallData:', overallData);
    console.debug('DateForecast: units:', units);

    // Calculate max and min temperatures for the day
    const temperatures = dayData.map(data => data.main.temp);
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);

    // Debug: Log temperatures, maxTemp, minTemp
    console.debug('DateForecast: temperatures:', temperatures);
    console.debug('DateForecast: maxTemp:', maxTemp, 'minTemp:', minTemp);

    // Convert pressure from hPa to inHg
    const pressureInHg = (overallData.main.pressure * 0.02953).toFixed(2);

    // Wind speed and direction
    const windSpeed = overallData.wind?.speed || 0;
    const windDirection = getWindDirection(overallData.wind?.deg || 0);

    // Debug: Log wind info
    console.debug('DateForecast: windSpeed:', windSpeed, 'windDirection:', windDirection);

    // Calculate total precipitation and average chance of precipitation for the day
    const totalRain = dayData.reduce((sum, d) => sum + (d.rain?.['3h'] || 0), 0);
    const totalSnow = dayData.reduce((sum, d) => sum + (d.snow?.['3h'] || 0), 0);
    const totalPrecip = totalRain + totalSnow;
    const totalPrecipInches = totalPrecip * 0.0393701; // Convert mm to inches
    const avgPop = (dayData.reduce((sum, d) => sum + (d.pop || 0), 0) / dayData.length) * 100;

    // Debug: Log precipitation and pop
    console.debug('DateForecast: totalPrecip:', totalPrecip, 'avgPop:', avgPop);

    // Prepare weather details for display
    const weatherDetails = [
        { label: 'Overall Conditions', value: overallData.weather?.[0]?.description || 'N/A' },
        { label: 'High Temp', value: `${Math.round(maxTemp)}°${units === 'metric' ? 'C' : 'F'}` },
        { label: 'Low Temp', value: `${Math.round(minTemp)}°${units === 'metric' ? 'C' : 'F'}` },
        { label: 'Humidity', value: `${overallData.main?.humidity || 0}%` },
        { label: 'Cloud Cover', value: `${overallData.clouds?.all || 0}%` },
        { label: 'Visibility', value: `${overallData.visibility ? overallData.visibility / 1000 : 0} ${units === 'metric' ? 'km' : 'mi'}` },
        { label: 'Pressure', value: `${pressureInHg} inHg` },
        { label: 'Chance of Precipitation', value: `${avgPop.toFixed(0)}%` },
        { label: 'Precipitation', value: `${totalPrecipInches.toFixed(2)} in` }, // <-- Inches and label
        { label: 'Snow', value: overallData.snow?.['1h'] ? `${(overallData.snow['1h'] * 0.0393701).toFixed(2)} in` : null },
        { label: 'Wind Speed', value: `${windSpeed} ${units === 'imperial' ? 'mph' : 'm/s'}` },
        { label: 'Wind Direction', value: windDirection || 'N/A' },
    ].filter(detail => detail.value !== null);

    // Debug: Log weatherDetails
    console.debug('DateForecast: weatherDetails:', weatherDetails);

    return (
        <div
            className="current-weather"
            style={{
                width: '98.5vw',
                margin: "1rem",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
            }}
        >
            {/* Date header with day name and formatted date */}
            <h2
                className="dateHeader"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: 'center',
                    marginBottom: '0rem'
                }}
            >
                {getDayName(overallData.dt)} - {getDateWithSuffix(overallData.dt)}
            </h2>
            {/* Weather details list */}
            <div className="forecast-part" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {weatherDetails.map((detail, index) => (
                    <p className='details' key={index}>
                        <strong>{detail.label}:&nbsp;</strong>
                        {typeof detail.value === 'string'
                            ? detail.value.replace(/\b\w/g, char => char.toUpperCase())
                            : detail.value}
                    </p>
                ))}
            </div>
            {/* Weather icon */}
            <img
                className="small-icon date-icon"
                src={`http://openweathermap.org/img/wn/${overallData.weather[0].icon}@2x.png`}
                alt={overallData.weather[0].description}
            />
        </div>
    );
};

export default DateForecast;