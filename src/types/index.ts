// src/types/index.ts
export type User = {
  id: string;
  name: string;
};

export type PermissionGrant = {
  id: string;
  target_user_id: string;
  resource_id: string;
  resource_type: "datatable" | "api" | "group";
  // 【修改】包含所有权限级别
  permission_level: "view" | "edit" | "grant";
  granted_at: string;
  target_user_name?: string;
  resource_name?: string;
};

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
  resource_type: "datatable" | "api";
  name: string;
  description: string;
  content: DataTableContent;
  created_at: string;
};

export type ResourceGroup = {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  resources?: Array<Pick<Resource, "id" | "name" | "resource_type">>;
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

export type AttributionContent = {
  type: "attribution";
  data: AttributionResult;
};
export type TextContent = { type: "text"; text: string };
export type SqlContent = { type: "sql"; sql: string };
export type TableContent = {
  type: "table";
  query_result: {
    columns: Array<{
      name: string;
      type: string;
      role: "dimension" | "metric";
    }>;
    rows: Array<Array<string | number>>;
  };
};
export type ChartContent = {
  type: "chart";
  chart_recommendation: {
    chart_type: string;
    x_axis_field: string;
    y_axis_fields: string[];
    description: string;
  };
};
export type ErrorContent = { type: "error"; error: string };

export type MessageContentBlock =
  | TextContent
  | SqlContent
  | TableContent
  | ChartContent
  | ErrorContent
  | AttributionContent;

export interface Message {
  id: string | number;
  role: "user" | "assistant";
  content: MessageContentBlock[];
  conversation_id?: string;
  created_at?: string;
}
