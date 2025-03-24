import axios from "axios";
import { countries } from "country-data";

const API_KEY = process.env.REACT_APP_API_KEY; // Use the API key from .env
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getUnitsByCountry = (countryCode) => {
  const country = countries[countryCode];
  return country && country.region === "Europe" ? "metric" : "imperial";
};

// Fetches weather data from the OpenWeatherMap API
export const fetchWeatherData = async (location, countryCode) => {
  const units = getUnitsByCountry(countryCode);
  try {
    const response = await axios.get(`${BASE_URL}weather?q=${location}&appid=${API_KEY}&units=${units}`);
    console.log('fetchWeatherData response:', response.data); // Log the response for debugging
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetches forecast data from the OpenWeatherMap API
export const fetchForecastData = async (location, countryCode) => {
  const units = getUnitsByCountry(countryCode);
  try {
    const response = await axios.get(`${BASE_URL}forecast?q=${location}&appid=${API_KEY}&units=${units}`);
    console.log('fetchForecastData response:', response.data); // Log the response for debugging
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetches location data from the OpenWeatherMap API
export const fetchLocationData = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    console.log('fetchLocationData response:', response.data); // Log the response for debugging
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetches forecast data from the OpenWeatherMap API by date
export const fetchForecastDataByDate = async (location, date, countryCode) => {
  const units = getUnitsByCountry(countryCode);
  try {
    const response = await axios.get(`${BASE_URL}forecast?q=${location}&appid=${API_KEY}&units=${units}`);
    const forecastData = response.data.list || [];
    const filteredData = forecastData.filter((data) => {
      const dataDate = new Date(data.dt * 1000);
      return dataDate.toDateString() === date.toDateString();
    });
    console.log('fetchForecastDataByDate filteredData:', filteredData); // Log the filtered data for debugging
    return filteredData;
  } catch (error) {
    console.error(error);
    return null;
  }
};