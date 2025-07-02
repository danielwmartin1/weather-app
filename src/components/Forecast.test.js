import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Forecast from './Forecast';

const mockForecastData = {
  list: Array(16).fill().map((_, i) => ({
    dt: 1600010000 + i * 10800,
    main: { temp: 70 + i },
    weather: [{ description: 'clear sky', icon: '01d' }],
    wind: { speed: 5, deg: 90 },
    clouds: { all: 10 },
    visibility: 10000,
    pop: 0.1,
    rain: { '1h': 0.2 },
    snow: undefined,
    units: 'imperial'
  })),
};

describe('Forecast', () => {
  it('renders forecast overview', () => {
    render(<Forecast forecastData={mockForecastData} />);
    expect(screen.getAllByText(/High:/i).length).toBeGreaterThan(0);
  });

  it('shows day details when a day is clicked', () => {
    render(<Forecast forecastData={mockForecastData} />);
    // Select the first forecast day by its heading text
    const dayHeaders = screen.getAllByRole('heading', { level: 3 });
    fireEvent.click(dayHeaders[0]);
    expect(screen.getByText(/Overall Conditions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Overview/i })).toBeInTheDocument();
  });

  it('returns null if no forecastData', () => {
    render(<Forecast forecastData={null} />);
    expect(screen.queryByText(/High:/i)).not.toBeInTheDocument();
  });
});