// src/api/knowledgeService.ts
import apiClient from './index';
import type { Resource } from '../types';

/**
 * 注意：API文档中未明确提供获取资源列表的GET接口。
 * 此处我们假设存在一个 GET /knowledge/resources 的接口用于获取列表，
 * 这是任何管理类UI的必备功能。
 */
export const listResources = async (): Promise<Resource[]> => {
    // 模拟返回数据，实际应替换为真实API调用
    // const response = await apiClient.get<Resource[]>('/knowledge/resources');
    // return response.data;

    // --- Mock Data ---
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
    return [
        {
            id: 'dt-123',
            resource_type: 'datatable',
            name: 'customers',
            description: '客户信息主表',
            content: {
                data_source_id: 'ds-mysql-1',
                columns: [{ name: 'customer_id', type: 'BIGINT' }, { name: 'country', type: 'VARCHAR' }]
            },
            created_at: new Date().toISOString()
        },
        {
            id: 'dt-456',
            resource_type: 'datatable',
            name: 'sales_data_2024_q3',
            description: '2024年第三季度核心销售数据表',
            content: {
                data_source_id: 'ds-mysql-1',
                columns: [{ name: 'amount', type: 'DECIMAL' }, { name: 'region', type: 'VARCHAR' }]
            },
            created_at: new Date().toISOString()
        }
    ];
    // --- End Mock Data ---
};


// 根据 API 文档实现资源注册接口: POST /api/v1/knowledge/resources
export const registerResource = async (resourceData: Omit<Resource, 'id' | 'created_at'>): Promise<Resource> => {
    const response = await apiClient.post<Resource>('/knowledge/resources', resourceData);
    return response.data;
};