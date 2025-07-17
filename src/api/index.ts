// src/api/index.ts
import axios from 'axios';
import { store } from '../store/store';

// 使用 Vite 提供的 import.meta.env 来访问环境变量
const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从 Redux store 中获取当前的用户ID
    const userId = store.getState().auth.userId;
    if (userId) {
      // 从 API 文档得知需要 X-User-ID Header
      config.headers['X-User-ID'] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;