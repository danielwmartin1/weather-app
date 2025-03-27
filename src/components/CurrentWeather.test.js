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

test('renders CurrentWeather component', () => {
  render(<CurrentWeather weatherData={mockWeatherData} location="New York" />);
  expect(screen.getByRole('heading', { level: 2, name: /New York/i })).toBeInTheDocument();
  expect(screen.getByText(/Conditions: clear sky/i)).toBeInTheDocument();
  expect(screen.getByText(/Temperature: 72°F/i)).toBeInTheDocument();
});