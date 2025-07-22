// src/components/Forecast.js
import React, { useState, useRef } from 'react';
import '../index.css';
import '../App.css';
import '../utils/api.js';
import DayForecast from './DateForecast.js';
import { getBackgroundMedia } from '../utils/getBackgroundMedia.js';
import './Forecast.css';

// Utility functions
const getDayName = (timestamp) => new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};
const getHighLowTemps = (day) => {
    const temps = day.map(part => part.main.temp);
    return { high: Math.max(...temps), low: Math.min(...temps) };
};
const formatDateWithSuffix = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).replace(/(\d+)(?=,)/, (match) => `${match}${suffix}`);
};
const getWeatherIconUrl = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;
const getDayParts = (list) => {
    const dayParts = [];
    for (let i = 0; i < list.length; i += 8) {
        dayParts.push(list.slice(i, i + 8));
    }
    return dayParts.slice(0, 8);
};
const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
};

// Reusable forecast part fields
const forecastPartFields = [
    {
        key: 'time',
        render: part => (
            <p style={{ fontWeight: 'bold', fontSize: '1.05rem' }} className="part">
                {new Date(part.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </p>
        )
    },
    {
        key: 'temp',
        render: part => <p className="part">{Math.round(part.main.temp)}°F</p>
    },
    {
        key: 'condition',
        render: part => (
            <p className="part condition">
                {capitalizeFirstLetter(part.weather[0].description)}
            </p>
        )
    },
    {
        key: 'icon',
        render: part => (
            <img
                className="small-icon"
                src={getWeatherIconUrl(part.weather[0].icon)}
                alt={part.weather[0].description}
            />
        )
    },
    {
        key: 'pop',
        render: part => (
            <p className="part">
                💧 {Math.round((part.pop || 0) * 100)}%
            </p>
        )
    },
    {
        key: 'rain',
        render: part => (
            <p className="part">
                🌧️ {part.rain?.['3h']
                    ? `${(part.rain['3h'] * 0.0393701).toFixed(2)} in`
                    : '0 in'}
            </p>
        )
    },
    {
        key: 'wind',
        render: part => (
            <p className="part">
                🌬️ {Math.round(part.wind.speed)} mph {getWindDirection(part.wind.deg)}
            </p>
        )
    },
    {
        key: 'snow',
        condition: part => part.weather[0].main.toLowerCase().includes('snow'),
        render: part => (
            <p className="part">
                ❄️ {part.snow?.['3h']
                    ? `${(part.snow['3h'] * 0.0393701).toFixed(2)} in`
                    : '0 in'}
            </p>
        )
    }
];

const ForecastDay = ({ day, dayIndex, handleDayClick, videoRefs }) => {
    const mainPart = day[0];
    const isNightTime = false;
    const condition = mainPart?.weather?.[0]?.main?.toLowerCase() || '';
    const backgroundMedia = getBackgroundMedia(condition, isNightTime);

    return (
        <div
            key={dayIndex}
            className="forecast-day background-media"
            style={{
                position: 'relative',
                overflow: 'hidden',
                ...(backgroundMedia.type !== 'video'
                    ? {
                        backgroundImage: `url(${backgroundMedia.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }
                    : {})
            }}
            onClick={() => handleDayClick(day)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${getDayName(day[0].dt)}, ${formatDateWithSuffix(day[0].dt)}`}
        >
            {backgroundMedia.type === 'video' && (
                <video
                    ref={el => {
                        videoRefs.current[dayIndex] = el;
                        if (el) el.playbackRate = 0.5;
                    }}
                    className="background-video"
                    src={backgroundMedia.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            )}
            <div className="forecast-day-content">
                <div className="headerContainer">
                    <h3 className="dateHeader">
                        {dayIndex === 0
                            ? "Today"
                            : `${getDayName(day[0].dt)} - ${formatDateWithSuffix(day[0].dt)}`}
                    </h3>
                    <h4 className="high-low">
                        High: {Math.round(getHighLowTemps(day).high)}°F&nbsp;|&nbsp;
                        Low: {Math.round(getHighLowTemps(day).low)}°F
                    </h4>
                </div>
                <div className="forecast-parts">
                    {day.map((part) => (
                        <div key={part.dt} className="forecast-part">
                            {forecastPartFields.map(field =>
                                !field.condition || field.condition(part)
                                    ? <React.Fragment key={field.key}>{field.render(part)}</React.Fragment>
                                    : null
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Forecast = React.memo(({ forecastData }) => {
    const [selectedDay, setSelectedDay] = useState(null);
    const videoRefs = useRef([]);

    if (!forecastData) {
        return null;
    }

    const dayParts = getDayParts(forecastData.list);

    const handleDayClick = (dayData) => setSelectedDay(dayData);
    const handleBackClick = () => setSelectedDay(null);

    return (
        <div className="forecast">
            {selectedDay ? (
                <div className="selected-day-forecast" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <DayForecast dayData={selectedDay} />
                    <button
                        className="backButton"
                        onClick={handleBackClick}
                        style={{ margin: '1rem' }}
                    >
                        Back to Overview
                    </button>
                </div>
            ) : (
                dayParts.map((day, dayIndex) => (
                    <ForecastDay
                        key={dayIndex}
                        day={day}
                        dayIndex={dayIndex}
                        handleDayClick={handleDayClick}
                        videoRefs={videoRefs}
                    />
                ))
            )}
        </div>
    );
});

export default Forecast;
