// src/api/conversationService.ts
import apiClient from './index';
import type { Message, MessageContentBlock } from '../types';

// API 文档中定义了获取指定会话历史的接口
interface ConversationHistoryResponse {
    id: string;
    user_id: string;
    title: string;
    messages: Array<{
        id: number;
        conversation_id: string;
        role: "user" | "assistant";
        content: string; // 后端返回的是JSON字符串，前端需要解析
        created_at: string;
    }>
    created_at: string;
    updated_at: string;
}

// API 文档中定义了创建图卡的成功响应体
interface CreateCardResponse {
    card_id: string;
    message: string;
}

// 获取单个会话的完整历史记录
export const getConversationHistory = async (convId: string): Promise<Message[]> => {
    const response = await apiClient.get<ConversationHistoryResponse>(`/conversations/${convId}`);

    // 后端消息的 content 是一个 JSON 字符串，需要解析成我们的 MessageContentBlock[] 结构
    const parsedMessages: Message[] = response.data.messages.map(msg => {
        let contentBlocks: MessageContentBlock[] = [];
        try {
            // 用户消息的 content 是纯文本
            if (msg.role === 'user') {
                contentBlocks = [{ type: 'text', text: msg.content }];
            } else {
                // 助手的消息 content 是一个包含完整 AnalysisResult 的 JSON 字符串
                const parsedContent = JSON.parse(msg.content);
                // 我们需要从中提取出需要的块
                if (parsedContent.text_response) {
                    contentBlocks.push({ type: 'text', text: parsedContent.text_response });
                }
                if (parsedContent.sql) {
                    contentBlocks.push({ type: 'sql', sql: parsedContent.sql });
                }
                if (parsedContent.query_result) {
                    contentBlocks.push({ type: 'table', query_result: parsedContent.query_result });
                }
                if (parsedContent.chart_recommendation) {
                    contentBlocks.push({ type: 'chart', chart_recommendation: parsedContent.chart_recommendation });
                }
            }
        } catch (error) {
            console.error("Failed to parse message content:", error);
            contentBlocks = [{ type: 'error', error: '无法解析此条消息内容。' }];
        }

        return {
            id: msg.id,
            role: msg.role,
            content: contentBlocks,
        };
    });

    return parsedMessages;
};

// 【新增】根据会话最新结果创建图卡
export const createCardFromConversation = async (convId: string, cardName: string): Promise<CreateCardResponse> => {
    const response = await apiClient.post<CreateCardResponse>(
        `/conversations/${convId}/actions/create_card`,
        { card_name: cardName } // 根据 API 文档，请求体需要 card_name 字段
    );
    return response.data;
};