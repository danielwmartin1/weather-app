// src/components/CurrentWeather.js

import React from 'react';

const CurrentWeather = ({ weatherData }) => {
  if (!weatherData || !weatherData.main || !weatherData.sys || !weatherData.weather || !weatherData.wind) return null;

  return (
    <div className="current-weather">
      <h2>{weatherData.name}, {weatherData.sys.country}</h2>
      <p>{Math.round(weatherData.main.temp)}°F</p> {/* Temperature in Fahrenheit */}
      <p>{weatherData.weather[0].description}</p>
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Wind Speed: {weatherData.wind.speed} ft/s</p>
    </div>
  );
};

export default CurrentWeather;
