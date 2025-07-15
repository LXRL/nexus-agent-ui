// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    userId: string | null;
}

const initialState: AuthState = {
    // 模拟一个默认用户ID，后续可以从登录或本地存储获取
    userId: 'user-a',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserId(state, action: PayloadAction<string>) {
            state.userId = action.payload;
        },
    },
});

export const { setUserId } = authSlice.actions;
export default authSlice.reducer;