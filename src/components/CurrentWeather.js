import '../index.css';
import '../App.css';
import React, { useState, useEffect } from 'react';
import '../utils/api.js';
import '../utils/stateLabelValues.js';
import './Search.js';
import { getHighLowTemps } from '../utils/weatherUtils';

const CurrentWeather = ({ weatherData, forecastData, location }) => {
  // State to store the current time
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  // Return null if the weather data is incomplete
  if (!weatherData || !weatherData.main || !weatherData.sys || !weatherData.weather || !weatherData.weather.length || !weatherData.wind || !forecastData || !forecastData.list) return null;

  // Get the overall data for the current weather
  const overallData = weatherData || {};
  const units = overallData.units || 'imperial'; // Default to imperial if not specified

  // Function to get the wind direction from degrees
  const getWindDirection = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return `${Math.round(deg)}° ${directions[index]}`;
  };

  // Function to capitalize the first letter of each word in a string
  const capitalizeFirstLetter = (str) => {
    return str
      .split(' ')
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  };

  // Function to get the day name from a timestamp
  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  // Extract the weather data for the first day in the forecast
  const firstDayData = forecastData.list.slice(0, 8);

  // Calculate high and low temperatures for the first day in the forecast
  const { high, low } = getHighLowTemps(firstDayData);

  // Convert pressure from hPa to inHg
  const pressureInHg = (overallData.main.pressure * 0.02953).toFixed(2);

  // Extract wind speed and direction
  const windSpeed = overallData.wind ? overallData.wind.speed : 0;
  const windDirection = overallData.wind ? getWindDirection(overallData.wind.deg) : 'N/A';

  // Array of weather details to display
  const weatherDetails = [
    { label: 'Conditions', value: capitalizeFirstLetter(overallData.weather[0].description) },
    { label: 'Current Temp', value: `${Math.round(overallData.main.temp)}°${units === 'metric' ? 'C' : 'F'}` },
    { label: 'Feels like', value: `${Math.round(overallData.main.feels_like)}°${units === 'metric' ? 'C' : 'F'}` },
    { label: 'High', value: `${Math.round(high)}°${units === 'metric' ? 'C' : 'F'}` },
    { label: 'Low', value: `${Math.round(low)}°${units === 'metric' ? 'C' : 'F'}` },
    { label: 'Humidity', value: `${overallData.main.humidity}%` },
    { label: 'Wind Speed', value: `${windSpeed} ${units === 'imperial' ? 'mph' : 'm/s'}` },
    { label: 'Wind Direction', value: windDirection || 'N/A' },
    { label: 'Cloud Cover', value: `${overallData.clouds.all}%` },
    { label: 'Sunrise', value: new Date(overallData.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) },
    { label: 'Sunset', value: new Date(overallData.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) },
    { label: 'Visibility', value: `${overallData.visibility / 1000} ${units === 'metric' ? 'km' : 'mi'}` },
    { label: 'Pressure', value: `${pressureInHg} inHg` },
    { label: 'Chance of Precipitation', value: `${overallData.pop ? overallData.pop * 100 : 0}%` },
    { label: 'Precipitation', value: overallData.rain && overallData.rain['1h'] ? `${overallData.rain['1h']} ${units === 'metric' ? 'mm' : 'in'}` : null },
    { label: 'Snow', value: overallData.snow && overallData.snow['1h'] ? `${overallData.snow['1h']} ${units === 'metric' ? 'mm' : 'in'}` : null },
    { label: 'UV Index', value: overallData.uvi || 0 },
  ].filter(detail => detail.value !== null); // Filter out null values

  return (
    <div className="current-weather">
      <div className="current-weather-content">
        <div className="locationTimeContainer">
          <h2 className="locationHeader">{location}</h2>
          <div className="location-container">
            <h3 className='locationTime'>
              {getDayName(time.getTime() / 1000)} - {time.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }).replace(/(\d+)(?=,)/, (match) => {
                const suffix = ['th', 'st', 'nd', 'rd'];
                const v = match % 100;
                return match + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
              })}
            </h3>
            <h4 className='locationTime'>
              {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
            </h4>
          </div>
        </div>
        <div className="weather-detail">
          {weatherDetails.map((detail, index) => (
           <p className='details' key={index}>{detail.label}: {detail.value}</p>
          ))}
        </div>
        <div className="icon-container">
          <img 
            className='large-icon'
            src={`http://openweathermap.org/img/wn/${overallData.weather[0].icon}@2x.png`} 
            alt={overallData.weather[0].description} 
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;