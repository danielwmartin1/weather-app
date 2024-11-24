// src/components/CurrentWeather.js
import '../App.css';
import React from 'react';

const CurrentWeather = ({ weatherData }) => {
  const time = new Date();
  if (!weatherData || !weatherData.main || !weatherData.sys || !weatherData.weather || !weatherData.wind) return null;

  const weatherDetails = [
    { label: 'Current Temp', value: `${Math.round(weatherData.main.temp)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Feels like', value: `${Math.round(weatherData.main.feels_like)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'High', value: `${Math.round(weatherData.main.temp_max)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Low', value: `${Math.round(weatherData.main.temp_min)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Humidity', value: `${weatherData.main.humidity}%` },
    { label: 'Wind Speed', value: `${weatherData.wind.speed} ${weatherData.units === 'metric' ? 'm/s' : 'ft/s'}` },
    { label: 'Conditions', value: weatherData.weather[0].description },
  ];

  return (
    <div className="current-weather">
        <h2>{weatherData.name}, {weatherData.sys.country}</h2>
        <h3 className='time'>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h3>
    {weatherDetails.map((detail, index) => (
      <p className='details' key={index}>{detail.label}: {detail.value}</p>
    ))}

    <img 
      src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
      alt={weatherData.weather[0].description} 
    />
  </div>
);
};

export default CurrentWeather;
