// src/types/index.ts

// 从 API 文档 GET /api/v1/conversations/{convId} 响应中得知会话的完整结构
// 但在列表中，我们通常只需要部分元信息。
export type ConversationMeta = {
    id: string;
    title: string;
    updated_at: string;
};

// 【新增】归因分析因子类型
export type AttributionFactor = {
    dimension_value: string;
    change_value: number;
    contribution: string;
    description: string;
};

// 【新增】归因分析结果类型
export type AttributionResult = {
    summary: string;
    factors: AttributionFactor[];
};

// 【新增】归因分析内容块类型
export type AttributionContent = { type: 'attribution'; data: AttributionResult };

// 单个内容块的类型
export type TextContent = { type: 'text'; text: string };
export type SqlContent = { type: 'sql'; sql: string };
export type TableContent = {
    type: 'table';
    query_result: {
        columns: Array<{ name: string; type: string; role: 'dimension' | 'metric' }>;
        rows: Array<Array<string | number>>;
    };
};
export type ChartContent = {
    type: 'chart';
    chart_recommendation: {
        chart_type: string;
        x_axis_field: string;
        y_axis_fields: string[];
        description: string;
    };
};
export type ErrorContent = { type: 'error'; error: string };

export type MessageContentBlock =
    | TextContent
    | SqlContent
    | TableContent
    | ChartContent
    | ErrorContent
    | AttributionContent; // 【新增】

// 单条完整消息的结构 (来自 API 文档)
export interface Message {
    id: string | number;
    role: 'user' | 'assistant';
    content: MessageContentBlock[];
    conversation_id?: string;
    created_at?: string;
}