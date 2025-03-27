// src/App.js

import React, { useReducer, useEffect } from 'react';
import { fetchWeatherData, fetchForecastData } from './utils/api';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Search from './components/Search';
import './index.css';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';

const initialState = {
  weatherData: null,
  forecastData: null,
  background: '',
  location: '',
  showImage: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_WEATHER_DATA':
      return { ...state, weatherData: action.payload };
    case 'SET_FORECAST_DATA':
      return { ...state, forecastData: action.payload };
    case 'SET_BACKGROUND':
      return { ...state, background: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_SHOW_IMAGE':
      return { ...state, showImage: action.payload };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSearch = async (location) => {
    const weather = await fetchWeatherData(location);
    const forecast = await fetchForecastData(location);

    dispatch({ type: 'SET_WEATHER_DATA', payload: weather });
    dispatch({ type: 'SET_FORECAST_DATA', payload: forecast });
    dispatch({ type: 'SET_LOCATION', payload: location });
    dispatch({ type: 'SET_SHOW_IMAGE', payload: false });
  };

  useEffect(() => {
    if (state.forecastData) {
      const forecastConditions = state.forecastData.list.map(item => item.weather[0].main.toLowerCase());
      console.log('Forecast Conditions:', forecastConditions); // Debugging: Log conditions

      if (forecastConditions.includes('rain')) {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/rain.jpg')" });
      } else if (forecastConditions.includes('clouds')) {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/clouds.jpg')" });
      } else if (forecastConditions.includes('clear')) {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/clear.jpg')" });
      } else if (forecastConditions.includes('snow')) {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/snow.jpg')" });
      } else if (forecastConditions.includes('thunderstorm')) {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/thunderstorm.jpg')" });
      } else if (forecastConditions.includes('drizzle')) {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/drizzle.jpg')" });
      } else {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/blue-ribbon.jpg')" });
      }
    } else {
      console.log('No forecast data available'); // Debugging: Log when no data
      dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/blue-ribbon.jpg')" });
    }
  }, [state.forecastData]);

  useEffect(() => {
    // This effect runs only once on the first render
    dispatch({ type: 'SET_SHOW_IMAGE', payload: true });
  }, []);

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
          {state.showImage && 
          <div id="picture">
            <svg width="176" height="79" viewBox="0 0 176 79" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* SVG content */}
            </svg>
          </div>
          }
          <Search onSearch={handleSearch} className="onSearch" />
          {state.weatherData && state.forecastData ? (
            <>
              <CurrentWeather weatherData={state.weatherData} forecastData={state.forecastData} location={state.location} />
              <hr />
              <h2 className='fiveDay'>5-Day Forecast</h2>
              <Forecast forecastData={state.forecastData} />
            </>
          ) : null}
        </>
      </div>
      <Footer />
    </div>
  );
};

export default App;