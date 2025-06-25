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
  const videoRef = useRef(null);

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
    if (condition === 'clear') {
      // Use mp4 for clear skies
      return { type: 'video', src: '/images/clear.mp4' };
    }
    if (condition && /(cloud|clouds|cloudy)/.test(condition)) {
      // Use mp4 for any condition containing 'cloud', 'clouds', or 'cloudy'
      return { type: 'video', src: '/images/clouds.mp4' };
    }
    if (condition === 'snow') {
      return { type: 'video', src: '/images/snow.mp4' };
    }
    // Default order: jpg
    return { type: 'image', src: `/images/${condition || 'blue-ribbon'}.jpg` };
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

  useEffect(() => {
    if (backgroundMedia.type === 'video' && videoRef.current) {
      if (
        (currentCondition === 'clear' && backgroundMedia.src.includes('clear.mp4')) ||
        (/(cloud|clouds|cloudy)/.test(currentCondition) && backgroundMedia.src.includes('clouds.mp4'))
      ) {
        videoRef.current.playbackRate = 0.25;
      } else if (currentCondition === 'snow' && backgroundMedia.src.includes('snow.mp4')) {
        videoRef.current.playbackRate = 1;
      }
    }
  }, [backgroundMedia, currentCondition]);

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
            ref={videoRef}
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
            onError={e => {
              if (e.target.src !== window.location.origin + '/images/clear.jpg') {
                e.target.style.display = 'none';
                // fallback: set background image
                document.querySelector('.app').style.backgroundImage = `url('/images/clear.jpg')`;
              }
            }}
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
            onError={e => {
              if (e.target.src !== window.location.origin + '/images/clear.jpg') {
                e.target.src = '/images/clear.jpg';
              }
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