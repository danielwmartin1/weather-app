import React, { useReducer, useEffect } from 'react';
import { fetchWeatherData, fetchForecastData } from './utils/api';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Search from './components/Search';
import './index.css';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';

// Initial state for the reducer
const initialState = {
  weatherData: null,
  forecastData: null,
  background: '',
  location: '',
  showImage: true,
};

// Reducer function to manage state
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

// Utility function to determine the background image
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
  const [state, dispatch] = useReducer(reducer, initialState);

  // Function to handle user search
  const handleSearch = async (location) => {
    if (!location || location === state.location) return; // Prevent duplicate API calls

    try {
      const weather = await fetchWeatherData(location);
      const forecast = await fetchForecastData(location);

      if (weather && forecast) {
        const formattedLocation = `${weather.name}, ${weather.sys.country}`; // Use city and country from API response
        dispatch({ type: 'SET_WEATHER_DATA', payload: weather });
        dispatch({ type: 'SET_FORECAST_DATA', payload: forecast });
        dispatch({ type: 'SET_LOCATION', payload: formattedLocation }); // Update location with API result
        dispatch({ type: 'SET_SHOW_IMAGE', payload: false });
      } else {
        console.error('Failed to fetch weather or forecast data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch default weather data on initial render
  useEffect(() => {
    const fetchDefaultWeather = async () => {
      const defaultLocation = 'New York';
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
      console.log('Fetching default weather data...');
      fetchDefaultWeather();
    }

    return () => {
      console.log('Cleaning up fetchDefaultWeather effect');
      // Add any necessary cleanup logic here
    };
  }, [state.weatherData, state.forecastData]);

  // Update background image based on current weather condition
  useEffect(() => {
    if (state.weatherData && state.weatherData.weather) {
      const currentCondition = state.weatherData.weather[0]?.main?.toLowerCase();
      const backgroundImage = getBackgroundImage(currentCondition);
      dispatch({ type: 'SET_BACKGROUND', payload: backgroundImage });
    } else if (state.weatherData === null) {
      console.warn('Weather data is not yet available');
    } else {
      console.warn('No valid weather data available');
      dispatch({ type: 'SET_BACKGROUND', payload: getBackgroundImage(null) });
    }
  }, [state.weatherData]);

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
          <Search onSearch={handleSearch} className="onSearch" />
          {state.weatherData && state.forecastData ? (
            <>
              <CurrentWeather weatherData={state.weatherData} forecastData={state.forecastData} location={state.location} />
              <hr />
              <h2 className="fiveDay">5-Day Forecast</h2>
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