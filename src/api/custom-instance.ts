import axiosInstance from './axios-instance';
import { AxiosRequestConfig } from 'axios';

export const customInstance = async <T>(
    config: AxiosRequestConfig
): Promise<T> => {
    const response = await axiosInstance.request<T>(config);
    return response.data;
};
