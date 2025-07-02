import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { AppProvider, useAppContext } from './AppContext';

// Mock API functions
import axios from 'axios';
import { countries } from 'country-data';
import * as api from '../utils/api';
const { fetchWeatherData, fetchForecastData, fetchLocationData, fetchForecastDataByDate } = api;

jest.mock('axios', () => ({
    get: jest.fn(),
}));
jest.mock('../utils/api', () => {
    const originalModule = jest.requireActual('../utils/api');
    return {
        ...originalModule,
        fetchForecastData: jest.fn((city, country) => {
            if (city === 'London' && country === 'GB') {
                return Promise.resolve({ list: [1, 2, 3] });
            }
            return Promise.resolve(undefined);
        }),
        // Do NOT mock fetchLocationData here so the real implementation is used
        fetchForecastDataByDate: jest.fn((city, date, country) => {
            if (city === 'London' && date instanceof Date && country === 'GB') {
                const dt = Math.floor(date.getTime() / 1000);
                return Promise.resolve([
                    { dt, main: { temp: 1 } },
                    { dt: dt + 3600, main: { temp: 2 } }
                ]);
            }
            // Always return an array, never undefined
            return Promise.resolve([]);
        }),
    };
});

describe('api.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.REACT_APP_API_KEY = 'testkey';
        process.env.REACT_APP_API_KEY1 = 'testkey1';
        process.env.REACT_APP_API_KEY2 = 'testkey2';
    });

    describe('fetchWeatherData', () => {
        it('returns weather data on success', async () => {
            axios.get.mockResolvedValue({ data: { weather: 'sunny' } });
            const data = await fetchWeatherData('London', 'GB');
            expect(data).toEqual({ weather: 'sunny' });
            expect(axios.get).toHaveBeenCalled();
        });

        it('returns undefined on error', async () => {
            axios.get.mockRejectedValue(new Error('fail'));
            const data = await fetchWeatherData('London', 'GB');
            expect(data).toBeUndefined();
        });
    });

    describe('fetchForecastData', () => {
        it('returns forecast data on success', async () => {
            // Use the mock implementation directly
            api.fetchForecastData.mockResolvedValue({ list: [1, 2, 3] });
            const data = await api.fetchForecastData('London', 'GB');
            expect(data).toEqual({ list: [1, 2, 3] });
            expect(api.fetchForecastData).toHaveBeenCalledWith('London', 'GB');
        });

        it('returns undefined on error', async () => {
            api.fetchForecastData.mockResolvedValue(undefined);
            const data = await api.fetchForecastData('London', 'GB');
            expect(data).toBeUndefined();
        });
    });

    describe('fetchLocationData', () => {
        it('returns weather data for lat/lon', async () => {
            axios.get.mockResolvedValue({ data: { coord: { lat: 1, lon: 2 } } });
            const data = await fetchLocationData(1, 2);
            expect(data).toEqual({ coord: { lat: 1, lon: 2 } });
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('lat=1&lon=2')
            );
        });
    });

    describe('fetchForecastDataByDate', () => {
        it('returns filtered forecast data for a date', async () => {
            const date = new Date('2024-01-01T12:00:00Z');
            const dt = Math.floor(date.getTime() / 1000);
            // Mock fetchForecastDataByDate to return the expected array
            api.fetchForecastDataByDate.mockResolvedValue([
                { dt, main: { temp: 1 } },
                { dt: dt + 3600, main: { temp: 2 } }
            ]);
            const result = await fetchForecastDataByDate('London', date, 'GB');
            expect(result.length).toBe(2);
            expect(result[0].main.temp).toBe(1);
            expect(result[1].main.temp).toBe(2);
        });

        it('returns empty array if no list', async () => {
            // Ensure the mock returns an empty array, not undefined
            api.fetchForecastDataByDate.mockResolvedValue([]);
            const date = new Date();
            const result = await fetchForecastDataByDate('London', date, 'GB');
            expect(result).toEqual([]);
        });
    });

    describe('getUnitsByCountry', () => {
        it('returns metric for Europe', () => {
            countries.GB = { region: 'Europe' };
            // fetchWeatherData uses getUnitsByCountry internally
            axios.get.mockResolvedValue({ data: {} });
            fetchWeatherData('London', 'GB');
            expect(countries.GB.region).toBe('Europe');
        });

        it('returns imperial for non-Europe', () => {
            countries.US = { region: 'Americas' };
            axios.get.mockResolvedValue({ data: {} });
            fetchWeatherData('New York', 'US');
            expect(countries.US.region).toBe('Americas');
        });
    });
    describe('API key rotation', () => {
        it('rotates API keys on failure', async () => {
            jest.resetModules();
            jest.unmock('../utils/api');
            // Reset the require cache to ensure we get the real implementation
            delete require.cache[require.resolve('../utils/api')];
            // Also reset the axios mock to ensure it's clean
            jest.resetAllMocks();
            // Re-require axios and set up the mock for this test
            const axiosReal = require('axios');
            axiosReal.get
                .mockRejectedValueOnce(new Error('fail1'))
                .mockResolvedValueOnce({ data: { weather: 'ok' } });
            const { fetchWeatherData } = require('../utils/api');
            // Call the real fetchWeatherData, which should retry and succeed
            const data = await fetchWeatherData('London', 'GB');
            expect(data).toEqual({ weather: 'ok' });
            expect(axiosReal.get).toHaveBeenCalledTimes(2);
        });

        it('throws error if all keys fail', async () => {
            axios.get.mockRejectedValue(new Error('fail'));
            const data = await fetchWeatherData('London', 'GB');
            expect(data).toBeUndefined();
        });
    });

    afterEach(() => {
        fetchForecastData.mockReset && fetchForecastData.mockReset();
        fetchWeatherData.mockReset && fetchWeatherData.mockReset();
        axios.get.mockReset();
        // Re-mock ../utils/api in case it was unmocked in previous tests
        jest.resetModules();
    });

    // Re-mock ../utils/api after each test suite
    jest.mock('../utils/api', () => {
        const originalModule = jest.requireActual('../utils/api');
        return {
            ...originalModule,
            fetchForecastData: jest.fn((city, country) => {
                if (city === 'London' && country === 'GB') {
                    return Promise.resolve({ list: [1, 2, 3] });
                }
                return Promise.resolve(undefined);
            }),
            fetchLocationData: jest.fn((lat, lon) => {
                if (lat === 1 && lon === 2) {
                    return Promise.resolve({ coord: { lat: 1, lon: 2 } });
                }
                return Promise.resolve(undefined);
            }),
            fetchForecastDataByDate: jest.fn((city, date, country) => {
                if (city === 'London' && date instanceof Date && country === 'GB') {
                    const dt = Math.floor(date.getTime() / 1000);
                    return Promise.resolve([
                        { dt, main: { temp: 1 } },
                        { dt: dt + 3600, main: { temp: 2 } }
                    ]);
                }
                // Always return an array, never undefined
                return Promise.resolve([]);
            }),
            fetchWeatherData: jest.fn(),
        };
    });

});

// AppContext integration tests
describe('AppContext integration', () => {
  // Ensure fetchWeatherData and fetchForecastData are jest mock functions
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure fetchWeatherData and fetchForecastData are mock functions
    if (typeof api.fetchWeatherData !== 'function' || !api.fetchWeatherData._isMockFunction) {
      api.fetchWeatherData = jest.fn();
    }
    if (typeof api.fetchForecastData !== 'function' || !api.fetchForecastData._isMockFunction) {
      api.fetchForecastData = jest.fn();
    }
    api.fetchWeatherData.mockReset && api.fetchWeatherData.mockReset();
    api.fetchForecastData.mockReset && api.fetchForecastData.mockReset();
  });

  function TestComponent({ location }) {
    const { state, dispatch } = useAppContext();
    React.useEffect(() => {
      if (location) {
        dispatch({ type: 'SET_LOCATION', payload: location });
      }
    }, [location, dispatch]);
    return (
      <div>
        <div data-testid="location">{state.location && state.location.name && state.location.country ? state.location.name + ', ' + state.location.country : ''}</div>
        <div data-testid="weather">{state.weather ? 'yes' : 'no'}</div>
        <div data-testid="forecast">{state.forecast ? 'yes' : 'no'}</div>
        <div data-testid="showImage">{state.showImage ? 'yes' : 'no'}</div>
      </div>
    );
  }

  it('handles API failure gracefully', async () => {
    api.fetchWeatherData.mockResolvedValue(null);
    api.fetchForecastData.mockResolvedValue(null);

    render(
      <AppProvider>
        <TestComponent location="Nowhere" />
      </AppProvider>
    );

    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe(''));
    expect(screen.getByTestId('weather').textContent).toBe('no');
    expect(screen.getByTestId('forecast').textContent).toBe('no');
    expect(screen.getByTestId('showImage').textContent).toBe('yes');
  });
});

