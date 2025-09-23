import axios from "axios";
import logger from "../utils/logger.js";

const getBaseURL = () => {
    return import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';
}


const instance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        logger.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        logger.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default instance;