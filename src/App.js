import React, { useEffect, useRef } from 'react';
import { useAppContext } from './context/AppContext';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Search from './components/Search';
import './index.css';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import { getBackgroundMedia } from './utils/getBackgroundMedia';

const App = () => {
  const { state, dispatch, fetchWeatherAndForecast } = useAppContext();
  const { weatherData, forecastData, background, showImage } = state;
  const hasFetched = useRef(false); // Track if the fetch has already been executed
  const videoRef = useRef(null);
  const gifVideoRef = useRef(null);

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

  // Helper to check if it's night at the location
  function isNight(weatherData) {
    if (!weatherData || !weatherData.sys) return false;
    const now = weatherData.dt; // current time (UTC seconds)
    const sunrise = weatherData.sys.sunrise;
    const sunset = weatherData.sys.sunset;
    // Night is after sunset or before sunrise
    return now < sunrise || now > sunset;
  }

  // Preload and check for file existence (client-side, runs once)
  if (typeof window !== 'undefined' && !window.__MEDIA_EXISTS__) {
    window.__MEDIA_EXISTS__ = {};
    const conditions = [
      'clear', 'clouds', 'cloudy', 'cloud', 'snow', 'rain', 'drizzle', 'thunderstorm', 'overcast', 'mist',
      'night-clear', 'night-clouds', 'night-cloudy', 'night-cloud', 'night-snow', 'night-rain', 'night-drizzle', 'night-thunderstorm', 'night-overcast', 'night-mist', 'night'
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

  // Update background image based on current weather condition
  useEffect(() => {
    if (weatherData && weatherData.weather) {
      const currentCondition = weatherData.weather[0]?.main?.toLowerCase();
      const media = getBackgroundMedia(currentCondition, isNight(weatherData));
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

  const isNightTime = isNight(weatherData);
  const currentCondition = weatherData?.weather?.[0]?.main?.toLowerCase();
  const backgroundMedia = getBackgroundMedia(currentCondition, isNightTime);

  useEffect(() => {
    if (backgroundMedia.type === 'video' && videoRef.current) {
      videoRef.current.playbackRate = 0.25;
    }
    if (backgroundMedia.type === 'gif' && gifVideoRef.current) {
      gifVideoRef.current.playbackRate = 0.25;
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
                document.querySelector('.app').style.backgroundImage = `url('/images/clear.jpg')`;
              }
            }}
          />
        )}
        {backgroundMedia.type === 'gif' && (
          <video
            ref={gifVideoRef}
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
            type="video/mp4,video/webm,video/ogg"
            onError={e => {
              if (e.target.src !== window.location.origin + '/images/clear.jpg') {
                e.target.style.display = 'none';
                document.querySelector('.app').style.backgroundImage = `url('/images/clear.jpg')`;
              }
            }}
          />
        )}
        {backgroundMedia.type === 'image' && (
          <img
            src={backgroundMedia.src}
            alt="background"
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