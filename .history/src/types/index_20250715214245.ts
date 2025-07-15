// src/types/index.ts

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
    | ErrorContent;

// 单条完整消息的结构
export interface Message {
    id: string; // 使用 nanoid 或时间戳生成
    role: 'user' | 'assistant';
    content: MessageContentBlock[];
}