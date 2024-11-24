import axiosInstance from './axiosInstance';
import { LoginCredentials, RegisterCredentials, IUser } from '../types';
import { API_ENDPOINTS } from '../config/api';

export const userActions = {
  login: async (credentials: LoginCredentials): Promise<IUser> => {
    try {
      console.log('Login credentials:', credentials);
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
      console.log('Full login response:', response);
      console.log('Response data structure:', {
        keys: Object.keys(response.data),
        fullData: response.data
      });

      const { access_token, refresh_token, userName, userId } = response.data;

      if (!access_token) {
        throw new Error('No access token in response');
      }

      // Зберігаємо токени
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);

      // Налаштовуємо заголовки для axios інстансу
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Повертаємо об'єкт користувача
      return {
        id: userId,
        username: userName
      };

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<IUser> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, credentials);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      return user;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      delete axiosInstance.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: async (): Promise<IUser> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Отримуємо збережені дані користувача
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');

      if (!userId || !userName) {
        throw new Error('User data not found');
      }

      return {
        id: parseInt(userId),
        username: userName
      };
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      throw error;
    }
  }
};
