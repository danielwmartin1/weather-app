import React, { useEffect, useRef } from 'react';
import { useAppContext } from './context/AppContext';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Search from './components/Search';
import './index.css';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';

const App = () => {
  const { state, dispatch, fetchWeatherAndForecast } = useAppContext();
  const { weatherData, forecastData, background, showImage } = state;
  const hasFetched = useRef(false); // Track if the fetch has already been executed

  // Fetch weather data based on user's location or default to New York
  useEffect(() => {
    const fetchUserLocationWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async ({ coords: { latitude, longitude } }) => {
            console.info(`Fetching weather for user location: ${latitude}, ${longitude}`);
            const location = `${latitude},${longitude}`;
            await fetchWeatherAndForecast(location);
          },
          async (error) => {
            console.warn('Geolocation failed, defaulting to New York:', error.message);
            await fetchWeatherAndForecast('New York'); // Fallback to New York
          }
        );
      } else {
        console.warn('Geolocation not supported, defaulting to New York.');
        await fetchWeatherAndForecast('New York'); // Fallback to New York
      }
    };

    if (!hasFetched.current) {
      console.info('Initializing weather data fetch...');
      fetchUserLocationWeather();
      hasFetched.current = true; // Mark fetch as completed
    }
  }, [fetchWeatherAndForecast]); // Remove `weatherData` and `forecastData` from dependencies

  // Update background image based on current weather condition
  useEffect(() => {
    if (weatherData && weatherData.weather) {
      const currentCondition = weatherData.weather[0]?.main?.toLowerCase();
      const backgroundImage = `url('/images/${currentCondition || 'blue-ribbon'}.jpg')`;
      if (background !== backgroundImage) {
        console.info(`Background updated to reflect weather condition: ${currentCondition}`);
        dispatch({ type: 'SET_BACKGROUND', payload: backgroundImage });
      }
    }
  }, [weatherData, background, dispatch]);

  return (
    <div className="app-container">
      <Header />
      <div
        className="app"
        style={{
          backgroundImage: background,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        {showImage && (
          <div id="picture">
            <svg width="176" height="79" viewBox="0 0 176 79" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* SVG content */}
            </svg>
          </div>
        )}
        <Search onSearch={fetchWeatherAndForecast} />
        {weatherData && forecastData && (
          <>
            <CurrentWeather
              weatherData={weatherData}
              forecastData={forecastData}
              location={state.location}
            />
            <hr />
            <h2 className="fiveDay">5-Day Forecast</h2>
            <Forecast forecastData={forecastData} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;