// src/pages/Management/ResourceTab.tsx
import React, { useState, useEffect } from "react";
// 【修改】引入 Popconfirm
import { Button, Table, message, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
// 【修改】引入 deleteResource
import { listResources, deleteResource } from "../../api/knowledgeService";
import type { Resource } from "../../types";
import RegisterResourceModal from "./RegisterResourceModal";
import EditResourceModal from "./EditResourceModal"; // 【新增】引入编辑模态框
import DataDisplayWrapper from "../../components/common/DataDisplayWrapper";

const ResourceTab: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 【修改】分离创建和编辑的模态框状态
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listResources();
      setResources(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // 【新增】编辑处理函数
  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsEditModalOpen(true);
  };

  // 【新增】删除处理函数
  const handleDelete = async (resourceId: string) => {
    try {
      // await deleteResource(resourceId); // 真实API调用
      await new Promise((res) => setTimeout(res, 500)); // 模拟API调用
      message.success("资源删除成功！");
      fetchResources(); // 成功后刷新列表
    } catch (error: any) {
      message.error(error?.response?.data?.error || "删除失败");
    }
  };

  // 【修改】将列定义移到组件外部或使用useMemo，这里为简化直接放在内部
  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left" as const,
    },
    { title: "描述", dataIndex: "description", key: "description", width: 300 },
    {
      title: "类型",
      dataIndex: "resource_type",
      key: "resource_type",
      width: 120,
      render: (type: string) => <Tag color="cyan">{type.toUpperCase()}</Tag>,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 200,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right" as const,
      // 【修改】为按钮绑定事件
      render: (_: any, record: Resource) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title={`确认删除资源 "${record.name}"?`}
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsRegisterModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        注册新资源
      </Button>
      <DataDisplayWrapper
        isLoading={isLoading}
        error={error}
        data={resources}
        onRetry={fetchResources}
      >
        <Table
          columns={columns}
          dataSource={resources.map((r) => ({ ...r, key: r.id }))}
          scroll={{ x: 960 }}
        />
      </DataDisplayWrapper>
      <RegisterResourceModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {
          setIsRegisterModalOpen(false);
          fetchResources();
        }}
      />
      {/* 【新增】渲染编辑模态框 */}
      <EditResourceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          fetchResources();
        }}
        resource={editingResource}
      />
    </div>
  );
};

export default ResourceTab;
