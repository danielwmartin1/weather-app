import React, { createContext, useReducer, useContext } from 'react';

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

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook to use the App Context
export const useAppContext = () => useContext(AppContext);
