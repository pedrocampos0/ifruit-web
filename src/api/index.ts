import axios, { AxiosInstance } from 'axios';

const apiUrls = {
    development: 'http://localhost:3000',
};

const environment = process.env.NODE_ENV || 'development';

const baseURL = apiUrls[environment as keyof typeof apiUrls] || apiUrls.development;

const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
});

export default api;