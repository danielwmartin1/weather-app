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
    try {
      if (!location || location === state.location) {
        // Prevent duplicate or unnecessary API calls
        return;
      }

      const weather = await fetchWeatherData(location);
      const forecast = await fetchForecastData(location);

      if (weather && forecast) {
        dispatch({ type: 'SET_WEATHER_DATA', payload: weather });
        dispatch({ type: 'SET_FORECAST_DATA', payload: forecast });
        dispatch({ type: 'SET_LOCATION', payload: location });
        dispatch({ type: 'SET_SHOW_IMAGE', payload: false });
      } else {
        console.error('Failed to fetch weather or forecast data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (state.weatherData && state.weatherData.weather) {
      // Use the current weather condition as the primary determinant
      const currentCondition = state.weatherData.weather[0]?.main?.toLowerCase();

      if (currentCondition === 'rain') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/rain.jpg')" });
      } else if (currentCondition === 'clouds') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/clouds.jpg')" });
      } else if (currentCondition === 'clear') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/clear.jpg')" });
      } else if (currentCondition === 'snow') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/snow.jpg')" });
      } else if (currentCondition === 'thunderstorm') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/thunderstorm.jpg')" });
      } else if (currentCondition === 'drizzle') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/drizzle.jpg')" });
      } else {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/blue-ribbon.jpg')" });
      }
    } else if (state.forecastData && state.forecastData.list) {
      // Fallback to the most frequent condition in the forecast
      const forecastConditions = state.forecastData.list.map(item => item.weather[0]?.main?.toLowerCase());
      const conditionCounts = forecastConditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
      }, {});

      const sortedConditions = Object.keys(conditionCounts).sort((a, b) => conditionCounts[b] - conditionCounts[a]);
      const dominantCondition = sortedConditions[0];

      if (dominantCondition === 'rain') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/rain.jpg')" });
      } else if (dominantCondition === 'clouds') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/clouds.jpg')" });
      } else if (dominantCondition === 'clear') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/clear.jpg')" });
      } else if (dominantCondition === 'snow') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/snow.jpg')" });
      } else if (dominantCondition === 'thunderstorm') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/thunderstorm.jpg')" });
      } else if (dominantCondition === 'drizzle') {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/drizzle.jpg')" });
      } else {
        dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/blue-ribbon.jpg')" });
      }
    } else {
      console.warn('No valid weather or forecast data available');
      dispatch({ type: 'SET_BACKGROUND', payload: "url('/images/blue-ribbon.jpg')" });
    }
  }, [state.weatherData, state.forecastData]);

  useEffect(() => {
    // This effect runs only once on the first render
    dispatch({ type: 'SET_SHOW_IMAGE', payload: true });
  }, []);

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      const defaultLocation = 'New York'; // Set your default location here
      try {
        const weather = await fetchWeatherData(defaultLocation);
        const forecast = await fetchForecastData(defaultLocation);

        if (weather && forecast) {
          dispatch({ type: 'SET_WEATHER_DATA', payload: weather });
          dispatch({ type: 'SET_FORECAST_DATA', payload: forecast });
          dispatch({ type: 'SET_LOCATION', payload: defaultLocation });
          dispatch({ type: 'SET_SHOW_IMAGE', payload: false });
        } else {
          console.error('Failed to fetch default weather or forecast data');
        }
      } catch (error) {
        console.error('Error fetching default weather data:', error);
      }
    };

    if (!state.weatherData && !state.forecastData) {
      fetchDefaultWeather();
    }
  }, [state.weatherData, state.forecastData]);

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