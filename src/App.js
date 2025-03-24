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

  const getBackgroundImage = () => {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return "url('./images/blue-ribbon.jpg')"; // Default background
    }

    const weatherCondition = weatherData.weather[0].main.toLowerCase();

    switch (weatherCondition) {
      case 'rain':
        return "url('./images/rain.jpg')";
      case 'clouds':
        return "url('./images/clouds.jpg')";
      case 'clear':
        return "url('./images/clear.jpg')";
      case 'snow':
        return "url('./images/snow.jpg')";
      case 'thunderstorm':
        return "url('./images/thunderstorm.jpg')";
      case 'drizzle':
        return "url('./images/drizzle.jpg')";
      default:
        return "url('./images/blue-ribbon.jpg')"; // Default background
    }
  };

  return (
      <div className="app-container">
        <Header />
        <div className="app" style={{ backgroundImage: getBackgroundImage() }}>
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
                <CurrentWeather weatherData={weatherData} forecastData={forecastData} location={location} />
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