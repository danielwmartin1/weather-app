import '../index.css';
import '../App.css';
import React, { useState, useEffect } from 'react';
import './Search.js';
import { getHighLowTemps } from '../utils/weatherUtils';

const CurrentWeather = ({ weatherData, forecastData, location }) => {
  const [time, setTime] = useState(new Date());

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

  const overallData = weatherData;
  const units = overallData.units || 'imperial';

  // Helpers
  const getWindDirection = (deg) => {
    const directions = [
      'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
    ];
    const index = Math.round(deg / 22.5) % 16;
    return `${Math.round(deg)}° ${directions[index]}`;
  };

  const capitalizeFirstLetter = (str) =>
    str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const getDayName = (timestamp) =>
    new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });

  // Forecast high/low
  const firstDayData = forecastData.list.slice(0, 8);
  const { high, low } = getHighLowTemps(firstDayData);

  // Weather details
  const pressureInHg = (overallData.main.pressure * 0.02953).toFixed(2);
  const windSpeed = overallData.wind.speed;
  const windDirection = getWindDirection(overallData.wind.deg);

  const weatherDetails = [
    {
      label: 'Overall Conditions',
      value: capitalizeFirstLetter(overallData.weather[0].description)
    },
    {
      label: 'Current Temp',
      value: `${Math.round(overallData.main.temp)}°${units === 'metric' ? 'C' : 'F'}`
    },
    {
      label: 'Feels like',
      value: `${Math.round(overallData.main.feels_like)}°${units === 'metric' ? 'C' : 'F'}`
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
      value: `${overallData.main.humidity}%`
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
      value: `${overallData.clouds.all}%`
    },
    {
      label: 'Sunrise',
      value: new Date(overallData.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    },
    {
      label: 'Sunset',
      value: new Date(overallData.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    },
    {
      label: 'Visibility',
      value: `${overallData.visibility / 1000} ${units === 'metric' ? 'km' : 'mi'}`
    },
    {
      label: 'Pressure',
      value: `${pressureInHg} inHg`
    },
    {
      label: 'Chance of Precipitation',
      value: `${overallData.pop ? overallData.pop * 100 : 0}%`
    },
    {
      label: 'Precipitation',
      value: overallData.rain?.['1h'] ? `${overallData.rain['1h']} ${units === 'metric' ? 'mm' : 'in'}` : null
    },
    {
      label: 'Snow',
      value: overallData.snow?.['1h'] ? `${overallData.snow['1h']} ${units === 'metric' ? 'mm' : 'in'}` : null
    },
    {
      label: 'UV Index',
      value: overallData.uvi || 0
    }
  ].filter(detail => detail.value !== null);

  // Date formatting helpers
  const getDayWithSuffix = (date) => {
    const day = date.getDate();
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = day % 100;
    const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    return `${day}${suffix}`;
  };

  return (
    <div className="current-weather">
      <div className="current-weather-content">
        <div className="locationTimeContainer">
          <h2 className="locationHeader">{location}</h2>
          <div className="location-container">
            <h3 className='locationTime'>
              {getDayName(time.getTime() / 1000)} - {time.toLocaleDateString([], {
                year: 'numeric',
                month: 'short'
              })} {getDayWithSuffix(time)}
            </h3>
            <h4 className='locationTime'>
              {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
            </h4>
          </div>
        </div>
        <div className="weather-detail">
          {weatherDetails.map((detail, idx) => (
            <p className='details' key={idx}>
              <strong>{detail.label}:&nbsp;</strong> {detail.value}
            </p>
          ))}
        </div>
        <div className="icon-container">
          {overallData.weather[0] && (
            <img
              className='large-icon'
              src={`http://openweathermap.org/img/wn/${overallData.weather[0].icon}@2x.png`}
              alt={overallData.weather[0].description}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;