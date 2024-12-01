// src/App.js

import React, { useState, useEffect } from 'react';
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
  const [showImage, setShowImage] = useState(true);
  const [location, setLocation] = useState('');

  const handleSearch = async (location) => {
    const weather = await fetchWeatherData(location);
    const forecast = await fetchForecastData(location);
  
    setWeatherData(weather);
    setForecastData(forecast);
    setShowImage(false);
    setLocation(location);
  };

  useEffect(() => {
    // This effect runs only once on the first render
    setShowImage(true);
  }, []);

  return (
      <div className="app-container">
        <Header />
        <div className="app">
          <>
            {showImage && 
            <div id="picture">
              <svg width="176" height="79" viewBox="0 0 176 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG content */}
              </svg>
            </div>
            }
            <Search onSearch={handleSearch} className="onSearch"/>
            {weatherData && forecastData ? (
              <>
                <CurrentWeather weatherData={weatherData} location={location} />
                <hr />
                <h2 className='fiveDay'>5-Day Forecast</h2>
                <Forecast forecastData={forecastData} />
              </>
            ) : (
              null
            )}
          </>
        </div>
        <Footer />
      </div>
  );
};

export default App;