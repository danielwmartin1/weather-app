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

  const getBackgroundMedia = (condition) => {
    // Supported extensions in order of preference
    const extensions = ['mp4', 'gif', 'jpg'];
    for (const ext of extensions) {
      const path = `/images/${condition}.${ext}`;
      // For public assets, we can try to load the image/video to check if it exists
      // But since we can't check synchronously, we'll just return the first match for now
      // In a real app, you might want to preload or check existence asynchronously
      if (ext === 'mp4') {
        if (condition === 'snow') return { type: 'video', src: path };
      } else if (ext === 'gif') {
        // Add gif support if you have gifs for any condition
        // Example: if (condition === 'rain') return { type: 'gif', src: path };
      } else {
        return { type: 'image', src: path };
      }
    }
    // Default fallback
    return { type: 'image', src: '/images/blue-ribbon.jpg' };
  };

  // Update background image based on current weather condition
  useEffect(() => {
    if (weatherData && weatherData.weather) {
      const currentCondition = weatherData.weather[0]?.main?.toLowerCase();
      const media = getBackgroundMedia(currentCondition);
      if (media.type === 'image') {
        const backgroundImage = `url('${media.src}')`;
        if (background !== backgroundImage) {
          dispatch({ type: 'SET_BACKGROUND', payload: backgroundImage });
        }
      } else {
        // For video/gif, clear background image
        if (background !== '') {
          dispatch({ type: 'SET_BACKGROUND', payload: '' });
        }
      }
    }
  }, [weatherData, background, dispatch]);

  const currentCondition = weatherData?.weather?.[0]?.main?.toLowerCase();
  const backgroundMedia = getBackgroundMedia(currentCondition);

  return (
    <div className="app-container">
      <Header />
      <div
        className="app"
        style={{
          backgroundImage: backgroundMedia.type === 'image' ? background : undefined,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {backgroundMedia.type === 'video' && (
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
            src={backgroundMedia.src}
          />
        )}
        {backgroundMedia.type === 'gif' && (
          <img
            src={backgroundMedia.src}
            alt="background gif"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
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
      </div>
      <Footer />
    </div>
  );
};

export default App;