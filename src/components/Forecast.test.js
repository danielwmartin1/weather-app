import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Forecast from './Forecast';

const mockForecastData = {
  list: [
    { dt: 1600000000, main: { temp: 72 }, weather: [{ description: 'clear sky', icon: '01d' }] },
    // Add more mock data as needed
  ]
};

test('renders Forecast component', () => {
  render(<Forecast forecastData={mockForecastData} />);
  expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
});

test('handles day click', () => {
  render(<Forecast forecastData={mockForecastData} />);
  fireEvent.click(screen.getByText(/clear sky/i));
  // Add assertions to verify the behavior after clicking a day
});