import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import CurrentWeather from './CurrentWeather';

const mockWeatherData = {
  weather: [{ main: 'Clear', description: 'clear sky' }],
  main: { temp: 72 },
  wind: { speed: 5, deg: 200 },
};

afterEach(() => {
  cleanup(); // Ensure the DOM is cleaned up after each test
});

test('renders CurrentWeather component with location from API', () => {
  render(<CurrentWeather weatherData={mockWeatherData} location="Los Angeles, US" />);
  expect(screen.getByRole('heading', { level: 2, name: /Los Angeles, US/i })).toBeInTheDocument();
  // Update the expected text to match the actual rendered output if necessary
  expect(screen.getByText(/Conditions: clear sky/i)).toBeInTheDocument();
  expect(screen.getByText(/Temperature: 72°F/i)).toBeInTheDocument();
});