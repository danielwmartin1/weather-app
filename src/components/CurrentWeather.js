import { useState, useEffect, useMemo, useRef } from 'react';
import '../index.css';
import '../App.css';
import './Search.js';
import { getHighLowTemps } from '../utils/weatherUtils';
import { getBackgroundMedia } from '../utils/getBackgroundMedia';
import './CurrentWeather.css';

// --- Helper Functions ---

// Converts wind degree to compass direction (e.g., 90° -> E)
const getWindDirection = (deg) => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(deg / 22.5) % 16;
  const result = `${Math.round(deg)}° ${directions[index]}`;
  return result;
};

// Capitalizes the first letter of each word in a string
const capitalizeFirstLetter = (str) => {
  const result = str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  return result;
};

// Returns the short weekday name from a UNIX timestamp
const getDayName = (timestamp) => {
  const result = new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
  return result;
};

// Returns the day of the month with the appropriate suffix (e.g., 1st, 2nd)
const getDayWithSuffix = (date) => {
  const day = date.getDate();
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = day % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  const result = `${day}${suffix}`;
  return result;
};

// Formats the location header based on location and weather data
const getLocationHeader = (location, weatherData) => {
  if (typeof location === 'object' && location !== null) {
    const city = location.name;
    const state = location.state && location.country === 'US' ? location.state : (location.state || '');
    const country = location.country || '';
    const result = `${city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
    return result;
  }

  if (typeof location === 'string' && location.includes(',')) {
    const [city, country] = location.split(',').map(s => s.trim());
    let state = '';
    // Special case for Huntertown, US
    if (weatherData?.sys?.country === 'US' && city === 'Huntertown') state = 'IN';
    const result = `${city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
    return result;
  }

  const result = location || '';
  return result;
};


// --- Main Component ---

/**
 * Displays the current weather and details for a given location.
 * @param {Object} props
 * @param {Object} props.weatherData - Current weather data from API
 * @param {Object} props.forecastData - Forecast data from API
 * @param {Object|string} props.location - Location object or string
 */
const CurrentWeather = ({ weatherData, forecastData, location }) => {
  // State for current time (updates every second)
   // eslint-disable-next-line
  const [time, setTime] = useState(new Date());
  const videoRef = useRef(null);

  // Update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Background media based on weather condition and time of day
  const condition = weatherData && weatherData.weather && weatherData.weather[0] && weatherData.weather[0].main
    ? weatherData.weather[0].main.toLowerCase()
    : '';
  const isNightTime = weatherData && weatherData.weather && weatherData.weather[0] && weatherData.weather[0].icon
    ? weatherData.weather[0].icon.endsWith('n')
    : false;
  const backgroundMedia = getBackgroundMedia(condition, isNightTime);

  // Prepare weather details for display using useMemo to avoid unnecessary recalculations
  const weatherDetails = useMemo(() => {
    let units = 'imperial';
    let high = null;
    let low = null;
    let pressureInHg = null;
    let windSpeed = null;
    let windDirection = null;

    if (
      weatherData &&
      weatherData.main &&
      weatherData.sys &&
      weatherData.weather?.length &&
      weatherData.wind &&
      forecastData?.list
    ) {
      units = weatherData.units || 'imperial';
      const firstDayData = forecastData.list.slice(0, 8);
      ({ high, low } = getHighLowTemps(firstDayData));
      pressureInHg = (weatherData.main.pressure * 0.02953).toFixed(2);
      windSpeed = weatherData.wind.speed;
      windDirection = getWindDirection(weatherData.wind.deg);

      const details = [
        {
          label: 'Overall Conditions',
          value: capitalizeFirstLetter(weatherData.weather[0].description)
        },
        {
          label: 'Current Temp',
          value: `${Math.round(weatherData.main.temp)}°${units === 'metric' ? 'C' : 'F'}`
        },
        {
          label: 'Feels like',
          value: `${Math.round(weatherData.main.feels_like)}°${units === 'metric' ? 'C' : 'F'}`
        },
        {
          label: 'High',
          value: `${Math.round(high)}°${units === 'metric' ? 'C' : 'F'}`
        },
        {
          label: 'Low',
          value: `${Math.round(low)}°${units === 'metric' ? 'C' : 'F'}`
        },
        {
          label: 'Humidity',
          value: `${weatherData.main.humidity}%`
        },
        {
          label: 'Wind Speed',
          value: `${windSpeed} ${units === 'imperial' ? 'mph' : 'm/s'}`
        },
        {
          label: 'Wind Gust',
          value: weatherData.wind?.gust !== undefined ? `${Math.round(weatherData.wind.gust)} ${units === 'imperial' ? 'mph' : 'm/s'}` : 'N/A'
        },
        {
          label: 'Wind Direction',
          value: windDirection
        },
        {
          label: 'Cloud Cover',
          value: `${weatherData.clouds.all}%`
        },
        {
          label: 'Sunrise',
          value: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        },
        {
          label: 'Sunset',
          value: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        },
        {
          label: 'Visibility',
          value: `${weatherData.visibility / 1000} ${units === 'metric' ? 'km' : 'mi'}`
        },
        {
          label: 'Pressure',
          value: `${pressureInHg} inHg`
        },
        {
          label: 'Chance of Precipitation',
          value: `${weatherData.pop ? weatherData.pop * 100 : 0}%`
        },
        {
          label: 'Total Precipitation',
          value:
            weatherData.rain?.['1h']
              ? `${(weatherData.rain['1h'] * 0.0393701).toFixed(2)} in`
              : weatherData.rain?.['3h']
                ? `${(weatherData.rain['3h'] * 0.0393701).toFixed(2)} in`
                : weatherData.snow?.['1h']
                  ? `${(weatherData.snow['1h'] * 0.0393701).toFixed(2)} in`
                  : weatherData.snow?.['3h']
                    ? `${(weatherData.snow['3h'] * 0.0393701).toFixed(2)} in`
                    : '0.00 in'
        },
        {
          label: 'Snow',
          value: weatherData.snow?.['1h'] ? `${weatherData.snow['1h']} ${units === 'metric' ? 'mm' : 'in'}` : null
        },
        {
          label: 'UV Index',
          value: weatherData.uvi || 0
        },

      ].filter(detail => detail.value !== null);
      return details;
    }
    return [];
  }, [weatherData, forecastData]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, [backgroundMedia]);

  // Only log once on initial mount
  useEffect(() => {
    console.log('CurrentWeather:', {
      weatherData,
      forecastData,
      location,
      backgroundMedia,
      weatherDetails,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Early return if required data is missing
  if (
    !weatherData ||
    !weatherData.main ||
    !weatherData.sys ||
    !weatherData.weather?.length ||
    !weatherData.wind ||
    !forecastData?.list
  ) {
    console.warn('CurrentWeather: Missing required data', { weatherData, forecastData });
    return null;
  }

  // --- Render ---

  return (
    <div className="current-weather" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background media */}
      {backgroundMedia.type === 'video' && (
        <video
          className="background-video"
          src={backgroundMedia.src}
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
          ref={el => { if (el) el.playbackRate = 0.5; }}
        />
      )}
      {backgroundMedia.type === 'image' && (
        <img
          src={backgroundMedia.src}
          alt="background"
          className="background-image"
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

      {/* Foreground content */}
      <div className="current-weather-content" style={{ position: 'relative', zIndex: 1 }}>
        {/* Location and current time */}
        <div className="locationTimeContainer">
          <h2 className="locationHeader">
            {getLocationHeader(location, weatherData)}
          </h2>
          <div className="location-container">
            <h3 className='locationTime'>
              {/* Day name, date, and day with suffix */}
              {getDayName(time.getTime() / 1000)} - {time.toLocaleDateString([], {
                year: 'numeric',
                month: 'short'
              })} {getDayWithSuffix(time)}
            </h3>
            <h4 className='locationTime'>
              {/* Current time */}
              {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
            </h4>
                    </div>
                  </div>
                  {/* Weather details list */}
        <div className="weather-detail">
          {weatherDetails.map((detail, idx) => (
            <p className='details' key={idx}>
              <strong>{detail.label}:&nbsp;</strong> {detail.value}
            </p>
          ))}
        </div>
        {/* Weather icon */}
        <div className="icon-container">
          {weatherData.weather[0] && (
            <img
              className='large-icon'
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;