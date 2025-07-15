// src/store/slices/conversationSlice.ts
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ConversationMeta } from '../../types';

interface ConversationState {
    conversations: ConversationMeta[];
    activeConvId: string; // 'new' 或 具体的会话ID
}

const initialState: ConversationState = {
    // 模拟一些初始会话数据
    conversations: [
        { id: 'conv-abc-123', title: '分析各国客户数量', updated_at: '2025-07-15T10:00:00Z' },
        { id: 'conv-def-456', title: '上周销售额趋势', updated_at: '2025-07-14T18:30:00Z' },
    ],
    activeConvId: 'new',
};

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setConversations(state, action: PayloadAction<ConversationMeta[]>) {
            state.conversations = action.payload;
        },
        addConversation(state, action: PayloadAction<ConversationMeta>) {
            state.conversations.unshift(action.payload);
        },
        setActiveConvId(state, action: PayloadAction<string>) {
            state.activeConvId = action.payload;
        },
        updateConversation(state, action: PayloadAction<ConversationMeta>) {
            const index = state.conversations.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.conversations[index] = action.payload;
            } else {
                // 如果不存在，则添加到列表顶部
                state.conversations.unshift(action.payload);
            }
        }
    },
});

export const { setConversations, addConversation, setActiveConvId, updateConversation } = conversationSlice.actions;
export default conversationSlice.reducer;