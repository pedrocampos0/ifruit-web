import api from '../api';
import { AxiosInstance } from 'axios';

export const useApi = (): AxiosInstance => {
    return api;
};