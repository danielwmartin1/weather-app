// src/App.js

import React, { useState } from 'react';
import { fetchWeatherData, fetchForecastData } from './utils/api';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Search from './components/Search';
import './index.css';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const handleSearch = async (location) => {
    const weather = await fetchWeatherData(location);
    const forecast = await fetchForecastData(location);
  
    setWeatherData(weather);
    setForecastData(forecast);
  };
  

  const [showForecast, setShowForecast] = useState(true);

  return (
    <div className="app-container">
      <Header />
      <div className="app">
        <Search onSearch={handleSearch} />
        {weatherData && forecastData ? (
          <>
            <CurrentWeather weatherData={weatherData} />
            <hr />
            <h2 className='fiveDay' onClick={() => setShowForecast(!showForecast)}>5-Day Forecast</h2>
            {showForecast && <Forecast forecastData={forecastData} />}
          </>
        ) : (
          null
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
