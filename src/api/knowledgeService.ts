// src/api/knowledgeService.ts
import apiClient from './index';
import type { Resource, ResourceGroup } from '../types';

/**
 * 资源相关API
 */
export const listResources = async (): Promise<Resource[]> => {
    // 假设存在 GET /knowledge/resources 接口
    // const response = await apiClient.get<Resource[]>('/knowledge/resources');
    // return response.data;

    // --- Mock Data ---
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
        { id: 'dt-123', resource_type: 'datatable', name: 'customers', description: '客户信息主表', content: { data_source_id: 'ds-mysql-1', columns: [{ name: 'customer_id', type: 'BIGINT' }, { name: 'country', type: 'VARCHAR' }] }, created_at: new Date().toISOString() },
        { id: 'dt-456', resource_type: 'datatable', name: 'sales_data_2024_q3', description: '2024年第三季度核心销售数据表', content: { data_source_id: 'ds-mysql-1', columns: [{ name: 'amount', type: 'DECIMAL' }, { name: 'region', type: 'VARCHAR' }] }, created_at: new Date().toISOString() },
        { id: 'dt-789', resource_type: 'datatable', name: 'products', description: '产品信息表', content: { data_source_id: 'ds-mysql-1', columns: [{ name: 'product_id', type: 'BIGINT' }, { name: 'category', type: 'VARCHAR' }] }, created_at: new Date().toISOString() }
    ];
    // --- End Mock Data ---
};

export const registerResource = async (resourceData: Omit<Resource, 'id' | 'created_at'>): Promise<Resource> => {
    const response = await apiClient.post<Resource>('/knowledge/resources', resourceData);
    return response.data;
};


/**
 * 【新增】资源组相关API
 */

// 假设存在 GET /knowledge/groups 接口
export const listGroups = async (): Promise<ResourceGroup[]> => {
    // const response = await apiClient.get<ResourceGroup[]>('/knowledge/groups');
    // return response.data;

    // --- Mock Data ---
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        {
            id: 'group-xyz',
            name: 'Q3销售数据集合',
            description: '包含了所有与第三季度销售相关的报表和数据源',
            owner_id: 'user-a',
            created_at: new Date().toISOString(),
            resources: [{ id: 'dt-456', name: 'sales_data_2024_q3', resource_type: 'datatable' }]
        },
        {
            id: 'group-abc',
            name: '客户数据资产',
            description: '所有关于客户维度的数据表',
            owner_id: 'user-a',
            created_at: new Date().toISOString(),
            resources: [{ id: 'dt-123', name: 'customers', resource_type: 'datatable' }]
        }
    ];
    // --- End Mock Data ---
};

// 根据 API 文档实现: POST /api/v1/knowledge/groups
export const createGroup = async (groupData: Pick<ResourceGroup, 'name' | 'description'>): Promise<ResourceGroup> => {
    const response = await apiClient.post<ResourceGroup>('/knowledge/groups', groupData);
    return response.data;
};

// 根据 API 文档实现: POST /api/v1/knowledge/groups/{groupId}/resources
export const addResourceToGroup = async (groupId: string, resourceId: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(`/knowledge/groups/${groupId}/resources`, { resource_id: resourceId });
    return response.data;
};