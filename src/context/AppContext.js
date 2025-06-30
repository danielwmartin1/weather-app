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

// Context Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Function to fetch weather and forecast data
  const fetchWeatherAndForecast = async (locationOrLat, maybeLon) => {
    try {
      console.info('Fetching weather and forecast for:', locationOrLat, maybeLon);
      let weather, forecast;

      if (typeof locationOrLat === 'number' && typeof maybeLon === 'number') {
        // Called with lat/lon
        const latLon = `${locationOrLat},${maybeLon}`;
        weather = await fetchWeatherData(latLon);
        forecast = await fetchForecastData(latLon);
      } else if (typeof locationOrLat === 'object' && locationOrLat.lat && locationOrLat.lon) {
        // Called with suggestion object
        const { lat, lon } = locationOrLat;
        const latLon = `${lat},${lon}`;
        weather = await fetchWeatherData(latLon);
        forecast = await fetchForecastData(latLon);
      } else if (typeof locationOrLat === 'string') {
        // Called with string (geocode first)
        weather = await fetchWeatherData(locationOrLat);
        forecast = await fetchForecastData(locationOrLat);
      }

      console.info('Weather data:', weather);
      console.info('Forecast data:', forecast);

      if (weather && forecast) {
        const formattedLocation = `${weather.name}, ${weather.sys.country}`;

        // Avoid redundant dispatch calls by checking if the state already matches
        if (state.weatherData !== weather || state.forecastData !== forecast || state.location !== formattedLocation || state.showImage) {
          console.info('Updating state with fetched weather and forecast data.');
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
