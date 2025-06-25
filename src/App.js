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

  const conditions = [
    'clear', 'clouds', 'cloudy', 'cloud', 'snow', 'rain', 'drizzle', 'thunderstorm', 'overcast',
    'night-clear', 'night-clouds', 'night-cloudy', 'night-cloud', 'night-snow', 'night-rain', 'night-drizzle', 'night-thunderstorm', 'night-overcast', 'night'
  ];

  const getBackgroundMedia = (condition, isNight) => {
    // Priority: mp4 > gif > jpg > png
    if (isNight && condition === 'clear') {
      return { type: 'video', src: '/images/night-clear.mp4' };
    }
    if (isNight && /(cloud|clouds|cloudy)/.test(condition)) {
      return { type: 'video', src: '/images/night-cloudy.mp4' };
    }
    if (isNight && /(rain|rainy|drizzle)/.test(condition)) {
      return { type: 'video', src: '/images/night-rain.mp4' };
    }
    if (isNight && /snow/.test(condition)) {
      return { type: 'video', src: '/images/night-snow.mp4' };
    }
    if (condition === 'clear') {
      return { type: 'video', src: '/images/clear.mp4' };
    }
    if (/(cloud|clouds|cloudy)/.test(condition)) {
      return { type: 'video', src: '/images/clouds.mp4' };
    }
    if (/(rain|rainy|drizzle)/.test(condition)) {
      return { type: 'video', src: '/images/rain.mp4' };
    }
    if (/snow/.test(condition)) {
      return { type: 'video', src: '/images/snow.mp4' };
    }
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

  // Calculate if it's night at the location
  let isNight = false;
  if (weatherData?.sys?.sunrise && weatherData?.sys?.sunset && weatherData?.dt) {
    const now = weatherData.dt; // UTC seconds
    const sunrise = weatherData.sys.sunrise;
    const sunset = weatherData.sys.sunset;
    // Night if now is after sunset or before sunrise
    isNight = now < sunrise || now > sunset;
  }

  const backgroundMedia = getBackgroundMedia(currentCondition, isNight);

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
            key={backgroundMedia.src}
            src={backgroundMedia.src}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              zIndex: 0,
            }}
            ref={videoRef => {
              if (videoRef) videoRef.playbackRate = 0.25;
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