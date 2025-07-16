// src/pages/Management/ResourceTab.tsx
import React, { useState, useEffect } from "react";
import { Button, Table, message, Space, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { listResources } from "../../api/knowledgeService";
import type { Resource } from "../../types";
import RegisterResourceModal from "./RegisterResourceModal";
import DataDisplayWrapper from "../../components/common/DataDisplayWrapper";

const columns = [
  { title: "名称", dataIndex: "name", key: "name", width: 200, fixed: "left" }, // 【新增】固定列
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
    fixed: "right", // 【新增】固定列
    render: () => (
      <Space size="middle">
        <a>编辑</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const ResourceTab: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleRegisterSuccess = () => {
    setIsModalOpen(false);
    fetchResources();
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
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
          // 【新增】x轴滚动，当表格内容宽度超过容器时出现滚动条
          scroll={{ x: 960 }}
        />
      </DataDisplayWrapper>
      <RegisterResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
};

export default ResourceTab;
