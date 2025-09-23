import axios from "axios";

const getBaseURL = () => {
    return import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';
}

const instance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true
});

export default instance;