// src/components/CurrentWeather.js
import '../index.css';
import '../App.css';
import React from 'react';

const CurrentWeather = ({ weatherData }) => {
  const time = new Date();
  if (!weatherData || !weatherData.main || !weatherData.sys || !weatherData.weather || !weatherData.weather.length || !weatherData.wind) return null;

  const getWindDirection = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };

  const capitalizeFirstLetter = (str) => {
    return str
      .split(' ')              // Split the string into an array of words
      .map(word =>              // Apply the function to each word
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()  // Capitalize the first letter, and make the rest lowercase
      )
      .join(' ');              // Join the array back into a single string
  };

  const weatherDetails = [
    { label: 'Conditions', value: capitalizeFirstLetter(weatherData.weather[0].description) },
    { label: 'Current Temp', value: `${Math.round(weatherData.main.temp)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Feels like', value: `${Math.round(weatherData.main.feels_like)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'High', value: `${Math.round(weatherData.main.temp_max)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Low', value: `${Math.round(weatherData.main.temp_min)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Humidity', value: `${weatherData.main.humidity}%` },
    { label: 'Wind Speed', value: `${weatherData.wind.speed} ${weatherData.units === 'metric' ? 'm/s' : 'ft/s'}` },
    { label: 'Cloud Cover', value: `${weatherData.clouds.all}%` },
    { label: 'Sunrise', value: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) },
    { label: 'Sunset', value: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) },
    { label: 'Visibility', value: `${weatherData.visibility / 1000} ${weatherData.units === 'metric' ? 'km' : 'mi'}` },
    { label: 'Pressure', value: `${weatherData.units === 'metric' ? weatherData.main.pressure + ' hPa' : (weatherData.main.pressure * 0.750062).toFixed(2) + ' mmHg'}` },
    { label: 'Wind Direction', value: getWindDirection(weatherData.wind.deg) || 'N/A' },
    { label: 'Chance of Precipitation', value: `${weatherData.pop ? weatherData.pop * 100 : 0}%` },
    { label: 'Precipitation', value: `${weatherData.rain && weatherData.rain['1h'] ? weatherData.rain['1h'] : 0} ${weatherData.units === 'metric' ? 'mm' : 'in'}` },
  ];

  return (
    <div className="current-weather">
      <div className="locationTimeContainer">
        <h2 className="locationTime">{weatherData.name}, {weatherData.sys.country}</h2>
        <h3 className='locationTime'>
          {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </h3>
      </div>
      <div className="weather-detail">
        {weatherDetails.map((detail, index) => (
         <p className='details' key={index}>{detail.label}: {detail.value}</p>
        ))}
      </div>
      <img 
        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
        alt={weatherData.weather[0].description} 
      />
    </div>
  );
};

export default CurrentWeather;
