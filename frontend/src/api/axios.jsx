import axios from "axios";

const instance = axios.create({
    baseURL:process.env.BACKEND_API_URL || 'http://localhost:3000',
    withCredentials: true
})
export default instance;