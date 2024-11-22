// src/App.js

import React, { useState } from 'react';
import { fetchWeatherData, fetchForecastData } from './utils/api';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Search from './components/Search';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const handleSearch = async (city) => {
    const weather = await fetchWeatherData(city);
    const forecast = await fetchForecastData(city);

    setWeatherData(weather);
    setForecastData(forecast);
  };

  return (
    <div className="app">
      <h1>Weather App</h1>
      <Search onSearch={handleSearch} />
      <CurrentWeather weatherData={weatherData} />
      <Forecast forecastData={forecastData} />
    </div>
  );
};

export default App;
