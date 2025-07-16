// src/pages/Management/ResourceTab.tsx
import React, { useState, useEffect } from "react";
import { Button, Table, message, Space, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { listResources } from "../../api/knowledgeService";
import type { Resource } from "../../types";
import RegisterResourceModal from "./RegisterResourceModal";

const columns = [
  { title: "名称", dataIndex: "name", key: "name" },
  { title: "描述", dataIndex: "description", key: "description" },
  {
    title: "类型",
    dataIndex: "resource_type",
    key: "resource_type",
    render: (type: string) => <Tag color="cyan">{type.toUpperCase()}</Tag>,
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    key: "created_at",
    render: (date: string) => new Date(date).toLocaleString(),
  },
  {
    title: "操作",
    key: "action",
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const data = await listResources();
      setResources(data);
    } catch (error) {
      message.error("获取资源列表失败");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleRegisterSuccess = () => {
    setIsModalOpen(false);
    fetchResources(); // 注册成功后刷新列表
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
      <Table
        columns={columns}
        dataSource={resources.map((r) => ({ ...r, key: r.id }))}
        loading={isLoading}
      />
      <RegisterResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
};

export default ResourceTab;
