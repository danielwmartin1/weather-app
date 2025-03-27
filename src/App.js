import React, { useEffect, useCallback } from 'react';
import { useAppContext } from './context/AppContext';
import { fetchWeatherData, fetchForecastData } from './utils/api';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Search from './components/Search';
import Footer from './components/Footer';
import Header from './components/Header';
import './index.css';
import './App.css';

const getBackgroundImage = (condition) => {
  switch (condition) {
    case 'rain':
      return "url('/images/rain.jpg')";
    case 'clouds':
      return "url('/images/clouds.jpg')";
    case 'clear':
      return "url('/images/clear.jpg')";
    case 'snow':
      return "url('/images/snow.jpg')";
    case 'thunderstorm':
      return "url('/images/thunderstorm.jpg')";
    case 'drizzle':
      return "url('/images/drizzle.jpg')";
    default:
      return "url('/images/blue-ribbon.jpg')";
  }
};

const App = () => {
  const { state, dispatch } = useAppContext();

  // Memoize fetchWeather to avoid unnecessary re-renders
  const fetchWeather = useCallback(async (location) => {
    try {
      const weather = await fetchWeatherData(location);
      const forecast = await fetchForecastData(location);

      if (weather && forecast) {
        const formattedLocation = `${weather.name}, ${weather.sys.country}`;
        dispatch({ type: 'SET_WEATHER_DATA', payload: weather });
        dispatch({ type: 'SET_FORECAST_DATA', payload: forecast });
        dispatch({ type: 'SET_LOCATION', payload: formattedLocation });
        dispatch({ type: 'SET_SHOW_IMAGE', payload: false });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    const defaultLocation = 'New York';
    if (!state.weatherData && !state.forecastData) {
      fetchWeather(defaultLocation);
    }
  }, [state.weatherData, state.forecastData, fetchWeather]);

  useEffect(() => {
    if (state.weatherData && state.weatherData.weather) {
      const condition = state.weatherData.weather[0]?.main?.toLowerCase();
      const backgroundImage = getBackgroundImage(condition);
      dispatch({ type: 'SET_BACKGROUND', payload: backgroundImage });
    }
  }, [state.weatherData, dispatch]);

  return (
    <div className="app-container">
      <Header />
      <div
        className="app"
        style={{
          backgroundImage: state.background,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <>
          {state.showImage && (
            <div id="picture">
              <svg width="176" height="79" viewBox="0 0 176 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG content */}
              </svg>
            </div>
          )}
          <Search onSearch={fetchWeather} />
          {state.weatherData && state.forecastData && (
            <>
              <CurrentWeather />
              <hr />
              <h2 className="fiveDay">5-Day Forecast</h2>
              <Forecast forecastData={state.forecastData} />
            </>
          )}
        </>
      </div>
      <Footer />
    </div>
  );
};

export default App;