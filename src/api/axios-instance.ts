import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.VITE_BACK_END_URL
});

export default axiosInstance;
