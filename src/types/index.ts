// src/types/index.ts

export type ResourceColumn = {
    name: string;
    type: string;
};

export type DataTableContent = {
    data_source_id: string;
    columns: ResourceColumn[];
};

export type Resource = {
    id: string;
    resource_type: 'datatable' | 'api';
    name: string;
    description: string;
    content: DataTableContent;
    created_at: string;
};

// 【新增】资源组类型定义
export type ResourceGroup = {
    id: string;
    name: string;
    description: string;
    owner_id: string;
    created_at: string;
    // 假设获取列表时，会附带组内资源的部分信息
    resources?: Array<Pick<Resource, 'id' | 'name' | 'resource_type'>>;
};

export type ConversationMeta = {
    id: string;
    title: string;
    updated_at: string;
};

export type AttributionFactor = {
    dimension_value: number;
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