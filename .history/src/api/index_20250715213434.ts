// src/api/index.ts
import axios from 'axios';
import { store } from '../store/store';

const apiClient = axios.create({
    // 从 API 文档获取根 URL
    baseURL: 'http://localhost:8080/api/v1',
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