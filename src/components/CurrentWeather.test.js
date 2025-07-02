import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CurrentWeather from './CurrentWeather';

const mockWeatherData = {
  main: { temp: 72, feels_like: 70, humidity: 50, pressure: 1013 },
  sys: { sunrise: 1600000000, sunset: 1600040000, country: 'US' },
  weather: [{ description: 'clear sky', icon: '01d' }],
  wind: { speed: 5, deg: 90 },
  clouds: { all: 10 },
  visibility: 10000,
  pop: 0.1,
  rain: { '1h': 0.2 },
  snow: undefined,
  uvi: 5,
  dt: 1600010000,
  units: 'imperial'
};

const mockForecastData = {
  list: Array(8).fill({
    main: { temp: 72 },
    dt: 1600010000,
  }),
};

describe('CurrentWeather', () => {
  it('renders weather details', () => {
    render(<CurrentWeather weatherData={mockWeatherData} forecastData={mockForecastData} location="New York, US" />);
    expect(screen.getByText(/Current Temp/i)).toBeInTheDocument();
    expect(screen.getByText(/Feels like/i)).toBeInTheDocument();
    expect(screen.getByText(/Humidity/i)).toBeInTheDocument();
    expect(screen.getByAltText(/clear sky/i)).toBeInTheDocument();
  });

  it('returns null if required data is missing', () => {
    render(<CurrentWeather weatherData={null} forecastData={null} location="" />);
    expect(screen.queryByText(/Current Temp/i)).not.toBeInTheDocument();
  });
});