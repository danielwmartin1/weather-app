// src/utils/api.js

import axios from "axios";

const API_KEY = "d41e3da09b3eaeb051becd162da6e929";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

export const fetchWeatherData = async (city, units = "imperial") => {
    try {
      const response = await axios.get(`${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=${units}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
export const fetchForecastData = async (city, units = "imperial") => {
    try {
      const response = await axios.get(`${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=${units}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
