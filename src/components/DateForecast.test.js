import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateForecast from './DateForecast';

const mockDayData = [
  {
    dt: 1600010000,
    main: { temp: 70, pressure: 1013, humidity: 60 },
    weather: [{ description: 'clear sky', icon: '01d' }],
    wind: { speed: 5, deg: 90 },
    clouds: { all: 10 },
    visibility: 10000,
    pop: 0.1,
    rain: { '1h': 0.2 },
    snow: undefined,
    units: 'imperial'
  }
];

describe('DateForecast', () => {
  it('renders forecast details', () => {
    render(<DateForecast dayData={mockDayData} />);
    expect(screen.getByText(/Overall Conditions/i)).toBeInTheDocument();
    expect(screen.getByAltText(/clear sky/i)).toBeInTheDocument();
  });

  it('returns null if no data', () => {
    render(<DateForecast dayData={[]} />);
    expect(screen.queryByText(/Overall Conditions/i)).not.toBeInTheDocument();
  });
});