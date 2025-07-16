// src/pages/Management/PermissionTab.tsx
import React, { useState, useEffect } from "react";
import { Button, Table, message, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { listPermissions } from "../../api/knowledgeService";
import type { PermissionGrant } from "../../types";
import GrantPermissionModal from "./GrantPermissionModal";
import DataDisplayWrapper from "../../components/common/DataDisplayWrapper";

const columns = [
  {
    title: "用户",
    dataIndex: "target_user_name",
    key: "target_user_name",
    width: 150,
  },
  {
    title: "授权资源",
    dataIndex: "resource_name",
    key: "resource_name",
    width: 200,
  },
  {
    title: "资源类型",
    dataIndex: "resource_type",
    key: "resource_type",
    width: 120,
    render: (type: string) => <Tag color="purple">{type.toUpperCase()}</Tag>,
  },
  {
    title: "权限级别",
    dataIndex: "permission_level",
    key: "permission_level",
    width: 120,
    render: (level: string) => <Tag color="gold">{level.toUpperCase()}</Tag>,
  },
  {
    title: "授权时间",
    dataIndex: "granted_at",
    key: "granted_at",
    width: 200,
    render: (date: string) => new Date(date).toLocaleString(),
  },
  {
    title: "操作",
    key: "action",
    width: 100,
    fixed: "right", // 固定操作列
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
  const [error, setError] = useState<Error | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPermissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listPermissions();
      setPermissions(data);
    } catch (err: any) {
      setError(err);
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
      <DataDisplayWrapper
        isLoading={isLoading}
        error={error}
        data={permissions}
        onRetry={fetchPermissions}
      >
        <Table
          columns={columns}
          dataSource={permissions.map((p) => ({ ...p, key: p.id }))}
          // 【新增】x轴滚动
          scroll={{ x: 890 }}
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
