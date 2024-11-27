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
  return (
      <div className="app-container" style={{height: '100vh!important'}}>
        <Header />
        <div className="app">
              <>
                <Search onSearch={handleSearch} />
                {weatherData && forecastData ? (
                  <>
                    <CurrentWeather weatherData={weatherData} />
                    <hr />
                    <h2 className='fiveDay'>5-Day Forecast</h2>
                    <Forecast forecastData={forecastData} />
                  </>
                ) : (
                  null
                )}
              </>
            {/* Add more routes here as needed */}
        </div>
        <Footer />
      </div>
  );
};

export default App;

