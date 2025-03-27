import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Forecast from './Forecast';

const mockForecastData = {
  list: [
    {
      dt: 1620000000,
      main: { temp: 72, humidity: 50 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 5, deg: 200 },
      clouds: { all: 10 },
      visibility: 10000,
    },
  ],
};

test('renders Forecast component', () => {
  render(<Forecast forecastData={mockForecastData} />);
  expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
});

test('handles day click', () => {
  render(<Forecast forecastData={mockForecastData} />);
  fireEvent.click(screen.getByText(/clear sky/i));
  // Add assertions to verify the behavior after clicking a day
  expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
});