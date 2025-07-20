// src/api/knowledgeService.ts
import apiClient from './index';
import type { Resource, ResourceGroup, PermissionGrant, User } from '../types';

/**
 * 资源相关API
 */
export const listResources = async (): Promise<Resource[]> => {
  // 假设存在 GET /knowledge/resources 接口
  // const response = await apiClient.get<Resource[]>('/knowledge/resources');
  // return response.data;
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    { id: 'dt-123', resource_type: 'datatable', name: 'customers', description: '客户信息主表', content: { data_source_id: 'ds-mysql-1', columns: [{ name: 'customer_id', type: 'BIGINT' }, { name: 'country', type: 'VARCHAR' }] }, created_at: new Date().toISOString() },
    { id: 'dt-456', resource_type: 'datatable', name: 'sales_data_2024_q3', description: '2024年第三季度核心销售数据表', content: { data_source_id: 'ds-mysql-1', columns: [{ name: 'amount', type: 'DECIMAL' }, { name: 'region', type: 'VARCHAR' }] }, created_at: new Date().toISOString() },
    { id: 'dt-789', resource_type: 'datatable', name: 'products', description: '产品信息表', content: { data_source_id: 'ds-mysql-1', columns: [{ name: 'product_id', type: 'BIGINT' }, { name: 'category', type: 'VARCHAR' }] }, created_at: new Date().toISOString() }
  ];
};

export const registerResource = async (resourceData: Omit<Resource, 'id' | 'created_at'>): Promise<Resource> => {
  const response = await apiClient.post<Resource>('/knowledge/resources', resourceData);
  return response.data;
};

// 【新增】更新资源
export const updateResource = async (id: string, resourceData: Partial<Omit<Resource, 'id' | 'created_at'>>): Promise<Resource> => {
  // 假设存在 PUT /knowledge/resources/{id} 接口
  const response = await apiClient.put<Resource>(`/knowledge/resources/${id}`, resourceData);
  return response.data;
};

// 【新增】删除资源
export const deleteResource = async (id: string): Promise<{ message: string }> => {
  // 假设存在 DELETE /knowledge/resources/{id} 接口
  const response = await apiClient.delete<{ message: string }>(`/knowledge/resources/${id}`);
  return response.data;
};


/**
 * 资源组相关API
 */
export const listGroups = async (): Promise<ResourceGroup[]> => {
  // 假设存在 GET /knowledge/groups 接口
  // const response = await apiClient.get<ResourceGroup[]>('/knowledge/groups');
  // return response.data;
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 'group-xyz', name: 'Q3销售数据集合', description: '包含了所有与第三季度销售相关的报表和数据源', owner_id: 'user-a', created_at: new Date().toISOString(), resources: [{ id: 'dt-456', name: 'sales_data_2024_q3', resource_type: 'datatable' }] },
    { id: 'group-abc', name: '客户数据资产', description: '所有关于客户维度的数据表', owner_id: 'user-a', created_at: new Date().toISOString(), resources: [{ id: 'dt-123', name: 'customers', resource_type: 'datatable' }] }
  ];
};

export const createGroup = async (groupData: Pick<ResourceGroup, 'name' | 'description'>): Promise<ResourceGroup> => {
  const response = await apiClient.post<ResourceGroup>('/knowledge/groups', groupData);
  return response.data;
};

export const addResourceToGroup = async (groupId: string, resourceId: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(`/knowledge/groups/${groupId}/resources`, { resource_id: resourceId });
  return response.data;
};


/**
 * 【新增】权限与用户相关API
 */

// 假设存在获取用户列表的接口
export const listUsers = async (): Promise<User[]> => {
  // const response = await apiClient.get<User[]>('/users');
  // return response.data;

  // --- Mock Data ---
  await new Promise(resolve => setTimeout(resolve, 100));
  return [
    { id: 'user-a', name: 'Alice (Admin)' },
    { id: 'user-b', name: 'Bob (Analyst)' },
    { id: 'user-c', name: 'Charlie (Viewer)' },
  ];
  // --- End Mock Data ---
};

// 假设存在获取权限列表的接口
export const listPermissions = async (): Promise<PermissionGrant[]> => {
  // const response = await apiClient.get<PermissionGrant[]>('/knowledge/permissions');
  // return response.data;

  // --- Mock Data ---
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    { id: 'perm-1', target_user_id: 'user-b', resource_id: 'group-xyz', resource_type: 'group', permission_level: 'view', granted_at: new Date().toISOString(), target_user_name: 'Bob (Analyst)', resource_name: 'Q3销售数据集合' },
    { id: 'perm-2', target_user_id: 'user-c', resource_id: 'dt-123', resource_type: 'datatable', permission_level: 'view', granted_at: new Date().toISOString(), target_user_name: 'Charlie (Viewer)', resource_name: 'customers' },
  ];
  // --- End Mock Data ---
};

// 根据 API 文档实现: POST /api/v1/knowledge/permissions
export const grantPermission = async (permissionData: Omit<PermissionGrant, 'id' | 'granted_at'>): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/knowledge/permissions', permissionData); //
  return response.data;
};

export const updatePermission = async (id: string, permissionData: Pick<PermissionGrant, 'permission_level'>): Promise<{ message: string }> => {
    // 假设存在 PUT /knowledge/permissions/{id} 接口
    const response = await apiClient.put<{ message: string }>(`/knowledge/permissions/${id}`, permissionData);
    return response.data;
};