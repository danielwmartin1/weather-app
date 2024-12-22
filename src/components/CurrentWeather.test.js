import React from 'react';
import { render, screen } from '@testing-library/react';
import CurrentWeather from './CurrentWeather';

const mockWeatherData = {
  main: { temp: 72, feels_like: 70, temp_max: 75, temp_min: 68, humidity: 50, pressure: 1012 },
  sys: { sunrise: 1600000000, sunset: 1600040000 },
  weather: [{ description: 'clear sky', icon: '01d' }],
  wind: { speed: 5, deg: 180 },
  clouds: { all: 0 },
  visibility: 10000,
  units: 'metric'
};

test('renders CurrentWeather component', () => {
  render(<CurrentWeather weatherData={mockWeatherData} location="New York" />);
  expect(screen.getByText('New York')).toBeInTheDocument();
  expect(screen.getByText('Conditions: Clear Sky')).toBeInTheDocument();
});