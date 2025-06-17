import axios, { AxiosInstance } from 'axios';

const apiUrls = {
    development: 'http://localhost:3000',
    production: 'https://sua-api.com',
    uat: 'https://uat.sua-api.com',
    dev: 'https://dev.sua-api.com',
};

const environment = process.env.NODE_ENV || 'development';

const baseURL = apiUrls[environment as keyof typeof apiUrls] || apiUrls.development;

const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
});

// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('authToken');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
//
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             console.error('Acesso não autorizado. Redirecionando para o login...');
//         }
//         return Promise.reject(error);
//     }
// );

export default api;