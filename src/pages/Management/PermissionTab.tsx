// src/pages/Management/PermissionTab.tsx
import React, { useState, useEffect } from "react";
import { Button, Table, message, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { listPermissions } from "../../api/knowledgeService";
import type { PermissionGrant } from "../../types";
import GrantPermissionModal from "./GrantPermissionModal";
import DataDisplayWrapper from "../../components/common/DataDisplayWrapper"; // 【新增】

const columns = [
  { title: "用户", dataIndex: "target_user_name", key: "target_user_name" },
  { title: "授权资源", dataIndex: "resource_name", key: "resource_name" },
  {
    title: "资源类型",
    dataIndex: "resource_type",
    key: "resource_type",
    render: (type: string) => <Tag color="purple">{type.toUpperCase()}</Tag>,
  },
  {
    title: "权限级别",
    dataIndex: "permission_level",
    key: "permission_level",
    render: (level: string) => <Tag color="gold">{level.toUpperCase()}</Tag>,
  },
  {
    title: "授权时间",
    dataIndex: "granted_at",
    key: "granted_at",
    render: (date: string) => new Date(date).toLocaleString(),
  },
  {
    title: "操作",
    key: "action",
    render: () => (
      <Popconfirm
        title="确认撤销权限？"
        onConfirm={() => message.info("撤销功能待实现")}
      >
        <a>撤销</a>
      </Popconfirm>
    ),
  },
];

const PermissionTab: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionGrant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null); // 【新增】
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPermissions = async () => {
    setIsLoading(true);
    setError(null); // 【新增】
    try {
      const data = await listPermissions();
      setPermissions(data);
    } catch (err: any) {
      setError(err); // 【修改】
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleGrantSuccess = () => {
    setIsModalOpen(false);
    fetchPermissions();
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        授予新权限
      </Button>
      {/* 【修改】使用DataDisplayWrapper包裹 */}
      <DataDisplayWrapper
        isLoading={isLoading}
        error={error}
        data={permissions}
        onRetry={fetchPermissions}
      >
        <Table
          columns={columns}
          dataSource={permissions.map((p) => ({ ...p, key: p.id }))}
        />
      </DataDisplayWrapper>
      <GrantPermissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleGrantSuccess}
      />
    </div>
  );
};

export default PermissionTab;
