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

  const weatherDetails = [
    { label: 'Current Temp', value: `${Math.round(weatherData.main.temp)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Feels like', value: `${Math.round(weatherData.main.feels_like)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'High', value: `${Math.round(weatherData.main.temp_max)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Low', value: `${Math.round(weatherData.main.temp_min)}°${weatherData.units === 'metric' ? 'C' : 'F'}` },
    { label: 'Description', value: weatherData.weather[0].description },
    { label: 'Humidity', value: `${weatherData.main.humidity}%` },
    { label: 'Wind Speed', value: `${weatherData.wind.speed} ${weatherData.units === 'metric' ? 'm/s' : 'ft/s'}` }
  ];

  return (
    <div className="current-weather">
      <div className="current-weather-container">
        <h2>{weatherData.name}, {weatherData.sys.country}</h2>
        <h3 className='time'>
          {time.toLocaleTimeString()}
        </h3>
        {weatherDetails.map((detail, index) => (
          <p className='details' key={index}>{detail.label}: {detail.value}</p>
        ))}
      </div>
    </div>
  );
  <img 
  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
  alt={weatherData.weather[0].description} 
/>
};

export default CurrentWeather;
