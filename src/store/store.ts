// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import conversationReducer from './slices/conversationSlice'; // 引入新的 reducer

export const store = configureStore({
    reducer: {
        auth: authReducer,
        conversation: conversationReducer, // 注册 reducer
    },
});

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;