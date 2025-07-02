import axios from "axios";
import { countries } from "country-data";

// --- Constants ---
// Base URL for OpenWeatherMap API
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Collect API keys from environment variables and filter out any undefined values
const API_KEYS = [
  process.env.REACT_APP_API_KEY,
  process.env.REACT_APP_API_KEY1,
  process.env.REACT_APP_API_KEY2,
].filter(Boolean);

// --- API Key Rotation ---
// Keeps track of the current API key index for rotation
let currentKeyIndex = 0;

/**
 * Rotates and returns the next available API key.
 * If no keys are available, logs an error and returns null.
 */
function getApiKey() {
  if (API_KEYS.length === 0) {
    console.error("No API keys available. Please check your .env file.");
    return null;
  }
  const apiKey = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return apiKey;
}

// --- API Request Helper ---

/**
 * Makes an API request with automatic API key rotation and retry logic.
 * @param {string} url - The API endpoint URL (without the appid param).
 * @param {number} retries - Number of retries (defaults to number of API keys).
 * @returns {Promise<any>} - The API response data.
 */
async function makeApiRequest(url, retries = API_KEYS.length) {
  for (let i = 0; i < retries; i++) {
    const apiKey = getApiKey();
    const requestUrl = `${url}&appid=${apiKey}`;
    try {
      const response = await axios.get(requestUrl);
      return response.data;
    } catch (error) {
      console.error(`API request failed with key: ${apiKey}`, error.message);
      if (i === retries - 1) throw new Error("All API keys have failed.");
    }
  }
}

// --- Utility Functions ---

/**
 * Returns units based on country code.
 * Europe uses "metric", others use "imperial".
 * @param {string} countryCode - The ISO country code.
 * @returns {string} - "metric" or "imperial"
 */
function getUnitsByCountry(countryCode) {
  const country = countries[countryCode];
  return country && country.region === "Europe" ? "metric" : "imperial";
}

/**
 * Builds the weather API URL based on endpoint and location format.
 * Supports US ZIP code, latitude/longitude, or city name.
 * @param {string} endpoint - API endpoint ("weather" or "forecast").
 * @param {string} location - Location string (ZIP, "lat,lon", or city).
 * @param {string} units - Units ("metric" or "imperial").
 * @returns {string} - The constructed API URL.
 */
function buildWeatherUrl(endpoint, location, units) {
  // US ZIP code
  if (/^\d{5},us$/i.test(location)) {
    return `${BASE_URL}${endpoint}?zip=${location}&units=${units}`;
  }
  // Latitude,Longitude
  if (location.includes(',')) {
    const [lat, lon] = location.split(',');
    return `${BASE_URL}${endpoint}?lat=${lat}&lon=${lon}&units=${units}`;
  }
  // City name
  return `${BASE_URL}${endpoint}?q=${location}&units=${units}`;
}

// --- Main API Functions ---

/**
 * Fetches current weather data for a location.
 * @param {string} location - Location string.
 * @param {string} countryCode - ISO country code.
 * @returns {Promise<any|undefined>} - Weather data or undefined on error.
 */
export async function fetchWeatherData(location, countryCode) {
  const units = getUnitsByCountry(countryCode);
  const url = buildWeatherUrl("weather", location, units);

  try {
    console.info('fetchWeatherData url:', url);
    const data = await makeApiRequest(url);
    console.info('fetchWeatherData result:', data);
    return data;
  } catch (error) {
    console.error('fetchWeatherData error:', error);
    return undefined;
  }
}

/**
 * Fetches forecast data for a location.
 * @param {string} location - Location string.
 * @param {string} countryCode - ISO country code.
 * @returns {Promise<any|undefined>} - Forecast data or undefined on error.
 */
export async function fetchForecastData(location, countryCode) {
  const units = getUnitsByCountry(countryCode);
  const url = buildWeatherUrl("forecast", location, units);

  try {
    console.info('fetchForecastData url:', url);
    const data = await makeApiRequest(url);
    console.info('fetchForecastData result:', data);
    return data;
  } catch (error) {
    console.error('fetchForecastData error:', error);
    return undefined;
  }
}

/**
 * Fetches weather data by latitude and longitude.
 * @param {number|string} lat - Latitude.
 * @param {number|string} lon - Longitude.
 * @returns {Promise<any>} - Weather data.
 */
export async function fetchLocationData(lat, lon) {
  const url = `${BASE_URL}weather?lat=${lat}&lon=${lon}`;
  return await makeApiRequest(url);
}

/**
 * Fetches forecast data for a specific date.
 * Filters the forecast list to only include entries matching the given date.
 * @param {string} location - Location string.
 * @param {Date} date - JavaScript Date object.
 * @param {string} countryCode - ISO country code.
 * @returns {Promise<Array>} - Array of forecast items for the date.
 */
export async function fetchForecastDataByDate(location, date, countryCode) {
  const units = getUnitsByCountry(countryCode);
  const url = buildWeatherUrl("forecast", location, units);
  const forecastData = await makeApiRequest(url);

  if (!forecastData?.list) return [];

  return forecastData.list.filter(item => {
    const dataDate = new Date(item.dt * 1000);
    return dataDate.toDateString() === date.toDateString();
  });
}

