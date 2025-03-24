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
    if (!forecastData || !forecastData.list) {
      return "url('./images/blue-ribbon.jpg')"; // Default background
    }
  
    const forecastConditions = forecastData.list.map(item => item.weather[0].main.toLowerCase());
  
    if (forecastConditions.some(condition => condition.includes('rain'))) {
      return "url('./images/rain.jpg')";
    }
    if (forecastConditions.some(condition => condition.includes('clouds'))) {
      return "url('./images/clouds.jpg')";
    }
    if (forecastConditions.some(condition => condition.includes('clear'))) {
      return "url('./images/clear.jpg')";
    }
    if (forecastConditions.some(condition => condition.includes('snow'))) {
      return "url('./images/snow.jpg')";
    }
    if (forecastConditions.some(condition => condition.includes('thunderstorm'))) {
      return "url('./images/thunderstorm.jpg')";
    }
    if (forecastConditions.some(condition => condition.includes('drizzle'))) {
      return "url('./images/drizzle.jpg')";
    }
  
    return "url('./images/blue-ribbon.jpg')"; // Default background
  };

  return (
      <div className="app-container">
        <Header />
        <div 
          className="app" 
          style={{ 
            backgroundImage: getBackgroundImage(),
            backgroundSize: 'cover', // Ensures the image covers the screen
            backgroundRepeat: 'no-repeat', // Prevents tiling
            backgroundPosition: 'center', // Centers the image
            height: '100vh', // Makes the container fit the screen height
            width: '100vw' // Makes the container fit the screen width
          }}
        >
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