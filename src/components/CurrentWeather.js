// src/components/CurrentWeather.js

import React from 'react';

const CurrentWeather = ({ weatherData }) => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!weatherData || !weatherData.main || !weatherData.sys || !weatherData.weather || !weatherData.wind) return null;

  return (
    <div className="current-weather">
      <div className="current-weather-container">
        <h2>{weatherData.name}, {weatherData.sys.country}</h2>
        <h3 className='time'>
          {time.toLocaleTimeString()}
        </h3>
        <p>Current Temp: {Math.round(weatherData.main.temp)}°F</p> {/* Temperature in Fahrenheit */}
        <p>Feels like: {Math.round(weatherData.main.feels_like)}°F</p>
        <p>High: {Math.round(weatherData.main.temp_max)}°F</p>
        <p>Low: {Math.round(weatherData.main.temp_min)}°F</p>
        <p>{weatherData.weather[0].description}</p>
        <img 
          src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
          alt={weatherData.weather[0].description} 
        />
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p style={{textTransform: 'lowercase'}}>Wind Speed: {weatherData.wind.speed} ft/s</p>
      </div>
    </div>
  );
};

export default CurrentWeather;
