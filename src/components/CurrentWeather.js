import React, { useState, useEffect } from 'react';
import '../index.css';
import '../App.css';
import './Search.js';
import { getHighLowTemps } from '../utils/weatherUtils';

// --- Helper Functions ---

// Converts wind degree to compass direction (e.g., 90° -> E)
const getWindDirection = (deg) => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(deg / 22.5) % 16;
  return `${Math.round(deg)}° ${directions[index]}`;
};

// Capitalizes the first letter of each word in a string
const capitalizeFirstLetter = (str) =>
  str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

// Returns the short weekday name from a UNIX timestamp
const getDayName = (timestamp) =>
  new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });

// Returns the day of the month with the appropriate suffix (e.g., 1st, 2nd)
const getDayWithSuffix = (date) => {
  const day = date.getDate();
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = day % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  return `${day}${suffix}`;
};

// Formats the location header based on location and weather data
const getLocationHeader = (location, weatherData) => {
  if (typeof location === 'object' && location !== null) {
    const city = location.name;
    const state = location.state && location.country === 'US' ? location.state : (location.state || '');
    const country = location.country || '';
    return `${city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
  }

  if (typeof location === 'string' && location.includes(',')) {
    const [city, country] = location.split(',').map(s => s.trim());
    let state = '';
    // Special case for Huntertown, US
    if (weatherData?.sys?.country === 'US' && city === 'Huntertown') state = 'IN';
    return `${city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
  }

  return location || '';
};


// --- Main Component ---

/**
 * Displays the current weather and details for a given location.
 * @param {Object} props
 * @param {Object} props.weatherData - Current weather data from API
 * @param {Object} props.forecastData - Forecast data from API
 * @param {Object|string} props.location - Location object or string
 */
const CurrentWeather = ({ weatherData, forecastData, location }) => {
  // State for current time (updates every second)
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Early return if required data is missing
  if (
    !weatherData ||
    !weatherData.main ||
    !weatherData.sys ||
    !weatherData.weather?.length ||
    !weatherData.wind ||
    !forecastData?.list
  ) return null;

  const units = weatherData.units || 'imperial';

  // Get high/low temps for today from forecast data
  const firstDayData = forecastData.list.slice(0, 8);
  const { high, low } = getHighLowTemps(firstDayData);

  // Convert pressure to inHg
  const pressureInHg = (weatherData.main.pressure * 0.02953).toFixed(2);
  const windSpeed = weatherData.wind.speed;
  const windDirection = getWindDirection(weatherData.wind.deg);

  // Prepare weather details for display
  const weatherDetails = [
    {
      label: 'Overall Conditions',
      value: capitalizeFirstLetter(weatherData.weather[0].description)
    },
    {
      label: 'Current Temp',
      value: `${Math.round(weatherData.main.temp)}°${units === 'metric' ? 'C' : 'F'}`
    },
    {
      label: 'Feels like',
      value: `${Math.round(weatherData.main.feels_like)}°${units === 'metric' ? 'C' : 'F'}`
    },
    {
      label: 'High',
      value: `${Math.round(high)}°${units === 'metric' ? 'C' : 'F'}`
    },
    {
      label: 'Low',
      value: `${Math.round(low)}°${units === 'metric' ? 'C' : 'F'}`
    },
    {
      label: 'Humidity',
      value: `${weatherData.main.humidity}%`
    },
    {
      label: 'Wind Speed',
      value: `${windSpeed} ${units === 'imperial' ? 'mph' : 'm/s'}`
    },
    {
      label: 'Wind Direction',
      value: windDirection
    },
    {
      label: 'Cloud Cover',
      value: `${weatherData.clouds.all}%`
    },
    {
      label: 'Sunrise',
      value: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    },
    {
      label: 'Sunset',
      value: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    },
    {
      label: 'Visibility',
      value: `${weatherData.visibility / 1000} ${units === 'metric' ? 'km' : 'mi'}`
    },
    {
      label: 'Pressure',
      value: `${pressureInHg} inHg`
    },
    {
      label: 'Chance of Precipitation',
      value: `${weatherData.pop ? weatherData.pop * 100 : 0}%`
    },
    {
      label: 'Precipitation',
      value: weatherData.rain?.['1h'] ? `${weatherData.rain['1h']} ${units === 'metric' ? 'mm' : 'in'}` : null
    },
    {
      label: 'Snow',
      value: weatherData.snow?.['1h'] ? `${weatherData.snow['1h']} ${units === 'metric' ? 'mm' : 'in'}` : null
    },
    {
      label: 'UV Index',
      value: weatherData.uvi || 0
    }
  ].filter(detail => detail.value !== null);

  // --- Render ---

  return (
    <div className="current-weather">
      <div className="current-weather-content">
        {/* Location and current time */}
        <div className="locationTimeContainer">
          <h2 className="locationHeader">
            {getLocationHeader(location, weatherData)}
          </h2>
          <div className="location-container">
            <h3 className='locationTime'>
              {/* Day name, date, and day with suffix */}
              {getDayName(time.getTime() / 1000)} - {time.toLocaleDateString([], {
                year: 'numeric',
                month: 'short'
              })} {getDayWithSuffix(time)}
            </h3>
            <h4 className='locationTime'>
              {/* Current time */}
              {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
            </h4>
          </div>
        </div>
        {/* Weather details list */}
        <div className="weather-detail">
          {weatherDetails.map((detail, idx) => (
            <p className='details' key={idx}>
              <strong>{detail.label}:&nbsp;</strong> {detail.value}
            </p>
          ))}
        </div>
        {/* Weather icon */}
        <div className="icon-container">
          {weatherData.weather[0] && (
            <img
              className='large-icon'
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
