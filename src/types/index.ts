// src/types/index.ts

// 【新增】资源栏定义
export type ResourceColumn = {
    name: string;
    type: string;
};

// 【新增】资源内容定义
export type DataTableContent = {
    data_source_id: string;
    columns: ResourceColumn[];
};

// 【新增】资源主类型
export type Resource = {
    id: string;
    resource_type: 'datatable' | 'api'; // 目前只支持datatable
    name: string;
    description: string;
    content: DataTableContent; // 未来可扩展为联合类型
    created_at: string;
};

export type ConversationMeta = {
    id: string;
    title: string;
    updated_at: string;
};

export type AttributionFactor = {
    dimension_value: string;
    change_value: number;
    contribution: string;
    description: string;
};

export type AttributionResult = {
    summary: string;
    factors: AttributionFactor[];
};

export type AttributionContent = { type: 'attribution'; data: AttributionResult };

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
    | AttributionContent;

export interface Message {
    id: string | number;
    role: 'user' | 'assistant';
    content: MessageContentBlock[];
    conversation_id?: string;
    created_at?: string;
}