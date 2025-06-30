import axios from "axios";
import { countries } from "country-data";

// --- Constants ---
const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const API_KEYS = [
  process.env.REACT_APP_API_KEY,
  process.env.REACT_APP_API_KEY1,
  process.env.REACT_APP_API_KEY2,
].filter(Boolean);

// --- API Key Rotation ---
let currentKeyIndex = 0;

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
 */
function getUnitsByCountry(countryCode) {
  const country = countries[countryCode];
  return country && country.region === "Europe" ? "metric" : "imperial";
}

/**
 * Builds the weather API URL based on endpoint and location format.
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
 */
export async function fetchLocationData(lat, lon) {
  const url = `${BASE_URL}weather?lat=${lat}&lon=${lon}`;
  return await makeApiRequest(url);
}

/**
 * Fetches forecast data for a specific date.
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
