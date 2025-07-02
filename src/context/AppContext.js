import React, { createContext, useReducer, useContext } from 'react';
import { fetchWeatherData, fetchForecastData } from '../utils/api';

// Initial state for the app context
const initialState = {
  weatherData: null,    // Stores current weather data
  forecastData: null,   // Stores forecast data
  background: '',       // Stores background image or style
  location: '',         // Stores formatted location string
  showImage: true,      // Controls whether to show the image
};

// Reducer function to handle state updates based on action types
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

// Create the AppContext using React's createContext
const AppContext = createContext();

// Helper function to format the location string from weather data
const formatLocation = (weather) =>
  weather && weather.name && weather.sys?.country
    ? `${weather.name}, ${weather.sys.country}`
    : '';

// Context Provider Component that wraps the app and provides state and actions
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  /**
   * Fetches weather and forecast data based on input.
   * Accepts a location string, a lat/lon object, or lat/lon numbers.
   * Updates context state with fetched data.
   */
  const fetchWeatherAndForecast = async (locationOrLat, maybeLon) => {
    try {
      let weather = null;
      let forecast = null;

      // Handle different input types for location
      if (typeof locationOrLat === 'number' && typeof maybeLon === 'number') {
        // Input is latitude and longitude as numbers
        const latLon = `${locationOrLat},${maybeLon}`;
        weather = await fetchWeatherData(latLon);
        forecast = await fetchForecastData(latLon);
      } else if (
        typeof locationOrLat === 'object' &&
        locationOrLat.lat &&
        locationOrLat.lon
      ) {
        // Input is an object with lat and lon properties
        const { lat, lon } = locationOrLat;
        const latLon = `${lat},${lon}`;
        weather = await fetchWeatherData(latLon);
        forecast = await fetchForecastData(latLon);
      } else if (typeof locationOrLat === 'string') {
        // Input is a location string
        weather = await fetchWeatherData(locationOrLat);
        forecast = await fetchForecastData(locationOrLat);
      }

      if (weather && forecast) {
        const formattedLocation = formatLocation(weather);

        // Only update state if data has changed or image should be hidden
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
        // Log error if data could not be fetched
        console.error('Failed to fetch weather or forecast data', { weather, forecast });
      }
    } catch (error) {
      // Log any errors during fetch
      console.error('Error fetching weather and forecast data:', error);
      if (error.response) {
        console.error('API error response:', error.response);
      }
    }
  };

  // Provide state, dispatch, and fetchWeatherAndForecast to children components
  return (
    <AppContext.Provider value={{ state, dispatch, fetchWeatherAndForecast }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the AppContext in components
export const useAppContext = () => useContext(AppContext);

