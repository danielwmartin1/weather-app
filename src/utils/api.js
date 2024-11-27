// src/utils/api.js

import axios from "axios";

const API_KEY = "d41e3da09b3eaeb051becd162da6e929";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Fetches weather data from the OpenWeatherMap API
export const fetchWeatherData = async (location, units = "imperial") => {
    try {
      const response = await axios.get(`${BASE_URL}weather?q=${location}&appid=${API_KEY}&units=${units}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

// Fetches forecast data from the OpenWeatherMap API
export const fetchForecastData = async (location, units = "imperial") => {
    try {
      const response = await axios.get(`${BASE_URL}forecast?q=${location}&appid=${API_KEY}&units=${units}`);
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
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

// Fetches forecast data from the OpenWeatherMap API by date
export const fetchForecastDataByDate = async (location, date, units = "imperial") => {
    try {
      const response = await axios.get(`${BASE_URL}forecast?q=${location}&appid=${API_KEY}&units=${units}`);
      const forecastData = response.data.list || [];
      const filteredData = forecastData.filter((data) => {
        const dataDate = new Date(data.dt * 1000);
        return dataDate.toDateString() === date.toDateString();
      });
      return filteredData;
    } catch (error) {
      console.error(error);
      return null;
    }
  };