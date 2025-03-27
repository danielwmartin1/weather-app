import axios from "axios";
import { countries } from "country-data";

const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const API_KEYS = [
  process.env.REACT_APP_API_KEY,
  process.env.REACT_APP_API_KEY1,
  process.env.REACT_APP_API_KEY2,
].filter(Boolean); // Filter out undefined keys
let currentKeyIndex = 0;

// Utility function to get the current API key and cycle to the next one if needed
const getApiKey = () => {
  if (API_KEYS.length === 0) {
    console.error("No API keys available. Please check your .env file.");
    return null;
  }
  const apiKey = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length; // Cycle to the next key
  return apiKey;
};

// Utility function to make API requests with key rotation
const makeApiRequest = async (url, retries = API_KEYS.length) => {
  for (let i = 0; i < retries; i++) {
    const apiKey = getApiKey();
    const requestUrl = `${url}&appid=${apiKey}`;
    try {
      const response = await axios.get(requestUrl);
      return response.data; // Return the response if successful
    } catch (error) {
      console.error(`API request failed with key: ${apiKey}`, error.message);
      if (i === retries - 1) {
        throw new Error("All API keys have failed.");
      }
    }
  }
};

const getUnitsByCountry = (countryCode) => {
  const country = countries[countryCode];
  return country && country.region === "Europe" ? "metric" : "imperial";
};

// Fetches weather data from the OpenWeatherMap API
export const fetchWeatherData = async (location, countryCode) => {
  const units = getUnitsByCountry(countryCode);
  let url;

  if (location.includes(',')) {
    // If location is latitude and longitude
    const [lat, lon] = location.split(',');
    url = `${BASE_URL}weather?lat=${lat}&lon=${lon}&units=${units}`;
  } else {
    // If location is a city name
    url = `${BASE_URL}weather?q=${location}&units=${units}`;
  }

  return await makeApiRequest(url);
};

// Fetches forecast data from the OpenWeatherMap API
export const fetchForecastData = async (location, countryCode) => {
  const units = getUnitsByCountry(countryCode);
  let url;

  if (location.includes(',')) {
    // If location is latitude and longitude
    const [lat, lon] = location.split(',');
    url = `${BASE_URL}forecast?lat=${lat}&lon=${lon}&units=${units}`;
  } else {
    // If location is a city name
    url = `${BASE_URL}forecast?q=${location}&units=${units}`;
  }

  return await makeApiRequest(url);
};

// Fetches location data from the OpenWeatherMap API
export const fetchLocationData = async (lat, lon) => {
  const url = `${BASE_URL}weather?lat=${lat}&lon=${lon}`;
  return await makeApiRequest(url);
};

// Fetches forecast data from the OpenWeatherMap API by date
export const fetchForecastDataByDate = async (location, date, countryCode) => {
  const units = getUnitsByCountry(countryCode);
  const url = `${BASE_URL}forecast?q=${location}&units=${units}`;
  const forecastData = await makeApiRequest(url);
  const filteredData = forecastData.list.filter((data) => {
    const dataDate = new Date(data.dt * 1000);
    return dataDate.toDateString() === date.toDateString();
  });
  return filteredData;
};