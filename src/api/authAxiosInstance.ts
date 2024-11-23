import axios from 'axios';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const authAxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

authAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
    }
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        history.push('/login');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default authAxiosInstance;
