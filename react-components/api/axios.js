

import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL

const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.interceptors.request.use(
    function (config) {
        config.headers['Authorization'] = localStorage.getItem('AUTH_TOKEN');
        return config;
    },
    null,
    { synchronous: true },
);

export const fetcher = url => axiosInstance.get(url).then(response => response.data);

export default axiosInstance
