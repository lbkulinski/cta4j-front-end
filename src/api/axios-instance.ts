import axios, {AxiosError} from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACK_END_URL
});

export function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
}

export default axiosInstance;
