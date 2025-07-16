import React, { useRef, useEffect } from 'react';
import '../index.css';
import '../App.css';
import '../utils/api.js';
import { getBackgroundMedia } from '../utils/getBackgroundMedia.js';

// Returns the short weekday name (e.g., "Mon") from a Unix timestamp
const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Returns wind direction as a string (e.g., "90° E")
const getWindDirection = (deg) => {
    const directions = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
    ];
    const index = Math.round(deg / 22.5) % 16;
    return `${Math.round(deg)}° ${directions[index]}`;
};

// Returns a formatted date string with ordinal suffix (e.g., "Jun 1st, 2024")
const getDateWithSuffix = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = day % 100;
    const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
        .replace(day, day + suffix);
};

// Helper to check if a timestamp is today
const isToday = (timestamp) => {
    const input = new Date(timestamp * 1000);
    const now = new Date();
    return (
        input.getDate() === now.getDate() &&
        input.getMonth() === now.getMonth() &&
        input.getFullYear() === now.getFullYear()
    );
};

// Main component to display the forecast for a specific date
const DateForecast = ({ dayData }) => {
    // Always call hooks first!
    const videoRef = useRef(null);

    // Use dummy values for hooks if no data, to keep order
    const overallData = dayData && dayData.length ? (dayData[0] || {}) : {};
    const condition = overallData.weather?.[0]?.main?.toLowerCase() || '';
    // Always use daytime backgrounds for DateForecast
    const backgroundMedia = getBackgroundMedia(condition, false);

    // Set playbackRate to 0.5 for video backgrounds (to match App.js)
    useEffect(() => {
        if (backgroundMedia.type === 'video' && videoRef.current) {
            videoRef.current.playbackRate = 0.5; // Set your global speed here
        }
    }, [backgroundMedia]);

    // Return nothing if no data is provided
    if (!dayData || !dayData.length) {
        console.warn('DateForecast: No dayData provided or empty array.');
        return null;
    }

    // Use the first entry as the overall data for the day
    // const overallData = dayData[0] || {};
    const units = overallData.units || 'imperial';

    // Debug: Log overallData and units
    console.debug('DateForecast: overallData:', overallData);
    console.debug('DateForecast: units:', units);

    // Calculate max and min temperatures for the day
    const temperatures = dayData.map(data => data.main.temp);
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);

    // Debug: Log temperatures, maxTemp, minTemp
    console.debug('DateForecast: temperatures:', temperatures);
    console.debug('DateForecast: maxTemp:', maxTemp, 'minTemp:', minTemp);

    // Convert pressure from hPa to inHg
    const pressureInHg = (overallData.main.pressure * 0.02953).toFixed(2);

    // Wind speed and direction
    const windSpeed = overallData.wind?.speed || 0;
    const windDirection = getWindDirection(overallData.wind?.deg || 0);

    // Debug: Log wind info
    console.debug('DateForecast: windSpeed:', windSpeed, 'windDirection:', windDirection);

    // Calculate total precipitation and average chance of precipitation for the day
    const totalRain = dayData.reduce((sum, d) => sum + (d.rain?.['3h'] || 0), 0);
    const totalSnow = dayData.reduce((sum, d) => sum + (d.snow?.['3h'] || 0), 0);
    const totalPrecip = totalRain + totalSnow;
    const totalPrecipInches = totalPrecip * 0.0393701; // Convert mm to inches
    const avgPop = (dayData.reduce((sum, d) => sum + (d.pop || 0), 0) / dayData.length) * 100;

    // Debug: Log precipitation and pop
    console.debug('DateForecast: totalPrecip:', totalPrecip, 'avgPop:', avgPop);

    // Prepare weather details for display
    // Helper to capitalize the first letter of each word
    function capitalizeWords(str) {
        if (!str) return '';
        return str.replace(/\b\w/g, c => c.toUpperCase());
    }

    const weatherDetails = [
        { label: capitalizeWords('overall conditions'), value: capitalizeWords(overallData.weather?.[0]?.description) || 'N/A' },
        { label: capitalizeWords('high temp'), value: `${Math.round(maxTemp)}°${units === 'metric' ? 'C' : 'F'}` },
        { label: capitalizeWords('low temp'), value: `${Math.round(minTemp)}°${units === 'metric' ? 'C' : 'F'}` },
        { label: capitalizeWords('humidity'), value: `${overallData.main?.humidity || 0}%` },
        { label: capitalizeWords('cloud cover'), value: `${overallData.clouds?.all || 0}%` },
        { label: capitalizeWords('visibility'), value: `${overallData.visibility ? overallData.visibility / 1000 : 0} ${units === 'metric' ? 'km' : 'mi'}` },
        { label: capitalizeWords('pressure'), value: `${pressureInHg} inHg` },
        { label: capitalizeWords('chance of precipitation'), value: `${avgPop.toFixed(0)}%` },
        { label: capitalizeWords('precipitation'), value: `${totalPrecipInches.toFixed(2)} in` },
        { label: capitalizeWords('snow'), value: overallData.snow?.['1h'] ? `${(overallData.snow['1h'] * 0.0393701).toFixed(2)} in` : null },
        { label: capitalizeWords('wind speed'), value: `${windSpeed} ${units === 'imperial' ? 'mph' : 'm/s'}` },
        { label: capitalizeWords('wind gust'), value: overallData.wind?.gust !== undefined ? `${Math.round(overallData.wind.gust)} ${units === 'imperial' ? 'mph' : 'm/s'}` : 'N/A' },
        { label: capitalizeWords('wind direction'), value: windDirection || 'N/A' },
    ].filter(detail => detail.value !== null);

    // Debug: Log weatherDetails
    console.debug('DateForecast: weatherDetails:', weatherDetails);

    return (
        <div className="current-weather">
            <div
                className="current-weather-content background-media"
                style={{
                    display: 'flex',
                    padding: 'var(--padding-medium)',
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    ...(backgroundMedia.type !== 'video'
                        ? {
                            backgroundImage: `url(${backgroundMedia.src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }
                        : {})
                }}
            >
                {backgroundMedia.type === 'video' && (
                    <video
                        ref={videoRef}
                        className="background-video"
                        src={backgroundMedia.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                )}
                <div style={{ position: backgroundMedia.type === 'video' ? 'relative' : 'static', zIndex: 1, width: '100%' }}>
                    {/* Date header with day name and formatted date */}
                    <h2
                        className="dateHeader"
                        style={{
                            width: 'fit-content',
                            margin: 'var(--margin-small) auto',
                            padding: 'var(--padding-small)',
                            textAlign: 'center',
                            fontSize: 'calc(var(--font-size-small) * 1.1)'
                        }}
                    >
                        {isToday(overallData.dt)
                            ? "Today"
                            : `${getDayName(overallData.dt)} - ${getDateWithSuffix(overallData.dt)}`}
                    </h2>
                    {/* Weather details grid */}
                    <div className="forecast-part">
                        {weatherDetails.map((detail, index) => (
                            <div className='details' key={index} style={{
                                borderRadius: '8px',
                                padding: 'var(--padding-small)',
                            }}>
                                <strong>{detail.label}:&nbsp;</strong>
                                {typeof detail.value === 'string' ? detail.value : null}
                            </div>
                        ))}
                    </div>
                    {/* Place the icon after the forecast-part */}
                    <div className="date-icon-container">
                        <img
                            className="small-icon date-icon"
                            src={`http://openweathermap.org/img/wn/${overallData.weather[0].icon}@2x.png`}
                            alt={overallData.weather[0].description}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateForecast;