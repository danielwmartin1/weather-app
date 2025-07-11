// --- Imports ---
import React, { useEffect, useRef } from 'react';
import { useAppContext } from './context/AppContext';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Search from './components/Search';
import Footer from './components/Footer';
import Header from './components/Header';
import { getBackgroundMedia } from './utils/getBackgroundMedia';
import './index.css';
import './App.css';

// --- Helper: Check if it's Night ---
/**
 * Determines if it's currently night based on weather data.
 * @param {Object} weatherData - Weather data object.
 * @returns {boolean} - True if it's night, false otherwise.
 */
function isNight(weatherData) {
  if (!weatherData || !weatherData.sys) return false;
  const { dt: now, sys: { sunrise, sunset } } = weatherData;
  return now < sunrise || now > sunset;
}

// --- Preload Media Files (runs once, client-side) ---
/**
 * Preloads media files (images, videos, gifs) for weather backgrounds.
 * Sets a global flag to avoid reloading.
 */
function preloadMedia() {
  if (typeof window === 'undefined' || window.__MEDIA_EXISTS__) return;
  window.__MEDIA_EXISTS__ = {};
  const conditions = [
    'clear', 'clouds', 'cloudy', 'cloud', 'snow', 'rain', 'drizzle', 'thunderstorm', 'overcast', 'mist',
    'night-clear', 'night-clouds', 'night-cloudy', 'night-cloud', 'night-snow', 'night-rain', 'night-drizzle',
    'night-thunderstorm', 'night-overcast', 'night-mist', 'night'
  ];
  const exts = ['mp4', 'gif', 'jpg', 'png'];
  conditions.forEach(cond => {
    exts.forEach(ext => {
      const url = `/images/${cond}.${ext}`;
      if (ext === 'mp4') {
        const v = document.createElement('video');
        v.src = url;
        v.onloadeddata = () => { window.__MEDIA_EXISTS__[`${cond}.mp4`] = true; };
        v.onerror = () => { window.__MEDIA_EXISTS__[`${cond}.mp4`] = false; };
      } else {
        const img = new window.Image();
        img.onload = () => { window.__MEDIA_EXISTS__[`${cond}.${ext}`] = true; };
        img.onerror = () => { window.__MEDIA_EXISTS__[`${cond}.${ext}`] = false; };
        img.src = url;
      }
    });
  });
}

// --- Main App Component ---
const App = () => {
  // --- Context and State ---
  const { state, dispatch, fetchWeatherAndForecast } = useAppContext();
  const { weatherData, forecastData, background, showImage } = state;

  // --- Refs ---
  const hasFetched = useRef(false); // Prevents multiple fetches on mount
  const videoRef = useRef(null);    // Ref for background video
  const gifVideoRef = useRef(null); // Ref for background gif video

  // --- Preload Media on First Render ---
  preloadMedia();

  // --- Fetch Weather Data on Mount ---
  useEffect(() => {
    /**
     * Fetches weather and forecast for user's location or defaults to New York.
     */
    const fetchUserLocationWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async ({ coords: { latitude, longitude } }) => {
            await fetchWeatherAndForecast(`${latitude},${longitude}`);
          },
          async () => {
            await fetchWeatherAndForecast('New York');
          }
        );
      } else {
        await fetchWeatherAndForecast('New York');
      }
    };

    if (!hasFetched.current) {
      fetchUserLocationWeather();
      hasFetched.current = true;
    }
  }, [fetchWeatherAndForecast]);

  // --- Set Background Image/Video based on Weather ---
  useEffect(() => {
    if (weatherData && weatherData.weather) {
      const currentCondition = weatherData.weather[0]?.main?.toLowerCase();
      const media = getBackgroundMedia(currentCondition, isNight(weatherData));
      if (media.type === 'image') {
        const backgroundImage = `url('${media.src}')`;
        if (background !== backgroundImage) {
          dispatch({ type: 'SET_BACKGROUND', payload: backgroundImage });
        }
      } else if (background !== '') {
        dispatch({ type: 'SET_BACKGROUND', payload: '' });
      }
    }
  }, [weatherData, background, dispatch]);

  // --- Set US Location Flag ---
  useEffect(() => {
    if (weatherData) {
      dispatch({
        type: 'SET_IS_US_LOCATION',
        payload: weatherData.sys?.country === 'US'
      });
    }
  }, [weatherData, dispatch]);

  // --- Prepare Media for Rendering ---
  const isNightTime = isNight(weatherData);
  const currentCondition = weatherData?.weather?.[0]?.main?.toLowerCase();
  const backgroundMedia = getBackgroundMedia(currentCondition, isNightTime);

  // --- Adjust Playback Rate for Video/GIF ---
  useEffect(() => {
    if (backgroundMedia.type === 'video' && videoRef.current) {
      videoRef.current.playbackRate = 0.25;
    }
    if (backgroundMedia.type === 'gif' && gifVideoRef.current) {
      gifVideoRef.current.playbackRate = 0.25;
    }
  }, [backgroundMedia, currentCondition]);

  // --- Handle Search ---
  /**
   * Handles search input from user.
   * If input is a 5-digit zip, appends ',us' for US search.
   * @param {string} searchTerm
   */
  const handleSearch = (searchTerm) => {
    if (/^\d{5}$/.test(searchTerm)) {
      fetchWeatherAndForecast(`${searchTerm},us`);
    } else {
      fetchWeatherAndForecast(searchTerm);
    }
  };

  // --- Render ---
  return (
    <div className="app-container">
      <Header />
      <div
        className="app"
        style={{
          height: '100vh',
          width: '100vw',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="content" style={{ position: 'relative', zIndex: 1 }}>
          {showImage && (
            <div id="picture">
              {/* SVG logo or image */}
              <svg width="176" height="79" viewBox="0 0 176 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG content */}
              </svg>
            </div>
          )}
          <Search onSearch={handleSearch} />
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
