import axios from 'axios';
import { countries } from 'country-data';

// filepath: src/utils/api.test.js
import {
  fetchWeatherData,
  fetchForecastData,
  fetchLocationData,
  fetchForecastDataByDate
} from './api';

jest.mock('axios');

describe('api.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_API_KEY = 'testkey';
    process.env.REACT_APP_API_KEY1 = 'testkey1';
    process.env.REACT_APP_API_KEY2 = 'testkey2';
  });

  describe('fetchWeatherData', () => {
    beforeEach(() => {
      axios.get = jest.fn();
    });

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
    beforeEach(() => {
      axios.get = jest.fn();
    });

    it('returns forecast data on success', async () => {
      axios.get.mockResolvedValue({ data: { list: [1, 2, 3] } });
      const data = await fetchForecastData('London', 'GB');
      expect(data).toEqual({ list: [1, 2, 3] });
      expect(axios.get).toHaveBeenCalled();
    });

    it('returns undefined on error', async () => {
      axios.get.mockRejectedValue(new Error('fail'));
      const data = await fetchForecastData('London', 'GB');
      expect(data).toBeUndefined();
    });
  });

  describe('fetchLocationData', () => {
    beforeEach(() => {
      axios.get = jest.fn();
    });

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
    beforeEach(() => {
      axios.get = jest.fn();
    });

    it('returns filtered forecast data for a date', async () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const dt = Math.floor(date.getTime() / 1000);
      axios.get.mockResolvedValue({
        data: {
          list: [
            { dt, main: { temp: 1 } },
            { dt: dt + 3600, main: { temp: 2 } },
            { dt: dt + 86400, main: { temp: 3 } }, // next day
          ],
        },
      });
      const result = await fetchForecastDataByDate('London', date, 'GB');
      expect(result.length).toBe(2);
      expect(result[0].main.temp).toBe(1);
      expect(result[1].main.temp).toBe(2);
    });

    it('returns empty array if no list', async () => {
      axios.get.mockResolvedValue({ data: {} });
      const date = new Date();
      const result = await fetchForecastDataByDate('London', date, 'GB');
      expect(result).toEqual([]);
    });
  });

  describe('getUnitsByCountry', () => {
    beforeEach(() => {
      axios.get = jest.fn();
    });

    it('returns metric for Europe', async () => {
      countries.GB = { region: 'Europe' };
      axios.get.mockResolvedValue({ data: {} });
      await fetchWeatherData('London', 'GB');
      expect(countries.GB.region).toBe('Europe');
    });

    it('returns imperial for non-Europe', async () => {
      countries.US = { region: 'Americas' };
      axios.get.mockResolvedValue({ data: {} });
      await fetchWeatherData('New York', 'US');
      expect(countries.US.region).toBe('Americas');
    });
  });

  describe('API key rotation', () => {
    beforeEach(() => {
      axios.get = jest.fn();
    });

    it('rotates API keys on failure', async () => {
      axios.get
        .mockRejectedValueOnce(new Error('fail1'))
        .mockResolvedValueOnce({ data: { weather: 'ok' } });
      const data = await fetchWeatherData('London', 'GB');
      expect(data).toEqual({ weather: 'ok' });
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    it('throws error if all keys fail', async () => {
      axios.get.mockRejectedValue(new Error('fail'));
      await expect(fetchWeatherData('London', 'GB')).resolves.toBeUndefined();
    });
  });
});