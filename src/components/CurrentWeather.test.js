import React from 'react';
import { render, screen } from '@testing-library/react';
import CurrentWeather from './CurrentWeather';

// Mock weather data for testing
const mockWeatherData = {
  main: { temp: 72, feels_like: 70, temp_max: 75, temp_min: 68, humidity: 50, pressure: 1012 },
  sys: { sunrise: 1600000000, sunset: 1600040000 },
  weather: [{ description: 'clear sky', icon: '01d' }],
  wind: { speed: 5, deg: 180 },
  clouds: { all: 0 },
  visibility: 10000,
  units: 'metric'
};

// Test to render the CurrentWeather component
test('renders CurrentWeather component', () => {
  // Render the CurrentWeather component with mock data
  render(<CurrentWeather weatherData={mockWeatherData} location="New York" />);
  // Check if the location is displayed
  expect(screen.getByText('New York')).toBeInTheDocument();
  // Check if the weather conditions are displayed
  expect(screen.getByText('Conditions: Clear Sky')).toBeInTheDocument();
});