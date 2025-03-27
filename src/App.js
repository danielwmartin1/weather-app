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
  const [background, setBackground] = useState('');

  const handleSearch = async (location) => {
    const weather = await fetchWeatherData(location);
    const forecast = await fetchForecastData(location);

    setWeatherData(weather);
    setForecastData(forecast);
    setShowImage(false);
    setLocation(location);
  };

  useEffect(() => {
    if (forecastData) {
      const forecastConditions = forecastData.list.map(item => item.weather[0].main.toLowerCase());
      console.log('Forecast Conditions:', forecastConditions); // Debugging: Log conditions

      if (forecastConditions.includes('rain')) {
        setBackground("url('/images/rain.jpg')"); // Updated path
      } else if (forecastConditions.includes('clouds')) {
        setBackground("url('/images/clouds.jpg')"); // Updated path
      } else if (forecastConditions.includes('clear')) {
        setBackground("url('/images/clear.jpg')"); // Updated path
      } else if (forecastConditions.includes('snow')) {
        setBackground("url('/images/snow.jpg')"); // Updated path
      } else if (forecastConditions.includes('thunderstorm')) {
        setBackground("url('/images/thunderstorm.jpg')"); // Updated path
      } else if (forecastConditions.includes('drizzle')) {
        setBackground("url('/images/drizzle.jpg')"); // Updated path
      } else {
        setBackground("url('/images/blue-ribbon.jpg')"); // Updated path
      }
    } else {
      console.log('No forecast data available'); // Debugging: Log when no data
      setBackground("url('/images/blue-ribbon.jpg')"); // Reset to default if no data
    }
  }, [forecastData]);

  useEffect(() => {
    // This effect runs only once on the first render
    setShowImage(true);
  }, []);

  return (
      <div className="app-container">
        <Header />
        <div 
          className="app" 
          style={{ 
            backgroundImage: background,
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