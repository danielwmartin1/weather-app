import React, { createContext, useReducer, useContext } from 'react';
import { fetchWeatherData, fetchForecastData } from '../utils/api';

// Initial state
const initialState = {
  weatherData: null,
  forecastData: null,
  background: '',
  location: '',
  showImage: true,
};

// Reducer function
const appReducer = (state, action) => {
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

// Create Context
const AppContext = createContext();

// Helper to format location string
const formatLocation = (weather) =>
  weather && weather.name && weather.sys?.country
    ? `${weather.name}, ${weather.sys.country}`
    : '';

// Context Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Fetch weather and forecast data based on input type
  const fetchWeatherAndForecast = async (locationOrLat, maybeLon) => {
    try {
      let weather = null;
      let forecast = null;

      // Handle different input types
      if (typeof locationOrLat === 'number' && typeof maybeLon === 'number') {
        // lat, lon as numbers
        const latLon = `${locationOrLat},${maybeLon}`;
        weather = await fetchWeatherData(latLon);
        forecast = await fetchForecastData(latLon);
      } else if (
        typeof locationOrLat === 'object' &&
        locationOrLat.lat &&
        locationOrLat.lon
      ) {
        // suggestion object with lat/lon
        const { lat, lon } = locationOrLat;
        const latLon = `${lat},${lon}`;
        weather = await fetchWeatherData(latLon);
        forecast = await fetchForecastData(latLon);
      } else if (typeof locationOrLat === 'string') {
        // location as string
        weather = await fetchWeatherData(locationOrLat);
        forecast = await fetchForecastData(locationOrLat);
      }

      if (weather && forecast) {
        const formattedLocation = formatLocation(weather);

        // Only update state if data changed
        if (
          state.weatherData !== weather ||
          state.forecastData !== forecast ||
          state.location !== formattedLocation ||
          state.showImage
        ) {
          dispatch({ type: 'SET_WEATHER_DATA', payload: weather });
          dispatch({ type: 'SET_FORECAST_DATA', payload: forecast });
          dispatch({ type: 'SET_LOCATION', payload: formattedLocation });
          dispatch({ type: 'SET_SHOW_IMAGE', payload: false });
        }
      } else {
        console.error('Failed to fetch weather or forecast data', { weather, forecast });
      }
    } catch (error) {
      console.error('Error fetching weather and forecast data:', error);
      if (error.response) {
        console.error('API error response:', error.response);
      }
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, fetchWeatherAndForecast }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);
