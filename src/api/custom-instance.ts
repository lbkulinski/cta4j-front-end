import axios, {AxiosRequestConfig} from 'axios';

declare const __API_BASE_URL__: string;

const instance = axios.create({
    baseURL: __API_BASE_URL__,
});

export const customInstance = <T>(config: AxiosRequestConfig) => {
    return instance.request<T>(config);
};
