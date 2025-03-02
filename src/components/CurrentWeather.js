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
  const pressureInHg = (weatherData.main.pressure * 0.02953).toFixed(2);

  // Array of weather details to display
  const weatherDetails = [
    { label: 'Conditions', value: capitalizeFirstLetter(weatherData.weather[0].description) },
    { label: 'Current Temp', value: `${Math.round(weatherData.main.temp)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Feels like', value: `${Math.round(weatherData.main.feels_like)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'High', value: `${Math.round(high)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Low', value: `${Math.round(low)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Humidity', value: `${weatherData.main.humidity}%` },
    { label: 'Wind Speed', value: `${weatherData.wind.speed} ${weatherData.units === 'metric' ? 'm/s' : 'ft/s'}` },
    { label: 'Cloud Cover', value: `${weatherData.clouds.all}%` },
    { label: 'Sunrise', value: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) },
    { label: 'Sunset', value: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) },
    { label: 'Visibility', value: `${weatherData.visibility / 1000} ${weatherData.units === 'metric' ? 'km' : 'mi'}` },
    { label: 'Pressure', value: `${pressureInHg} inHg` },
    { label: 'Wind Direction', value: getWindDirection(weatherData.wind.deg) || 'N/A' },
    { label: 'Chance of Precipitation', value: `${weatherData.pop ? weatherData.pop * 100 : 0}%` },
    { label: 'Precipitation', value: `${weatherData.rain && weatherData.rain['1h'] ? weatherData.rain['1h'] : 0} ${weatherData.units === 'metric' ? 'mm' : 'in'}` },
    { label: 'Snow', value: `${weatherData.snow && weatherData.snow['1h'] ? weatherData.snow['1h'] : 0} ${weatherData.units === 'metric' ? 'mm' : 'in'}` },
    { label: 'UV Index', value: weatherData.uvi || 0 },
  ];

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
        <div>
          <img 
            className='large-icon'
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
            alt={weatherData.weather[0].description} 
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;