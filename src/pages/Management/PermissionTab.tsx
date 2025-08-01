// src/pages/Management/PermissionTab.tsx
import React, { useState, useEffect } from "react";
import { Button, Table, message, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { listPermissions } from "../../api/knowledgeService";
import type { PermissionGrant } from "../../types";
import GrantPermissionModal from "./GrantPermissionModal";
import DataDisplayWrapper from "../../components/common/DataDisplayWrapper";

const getPermissionTagColor = (level: PermissionGrant["permission_level"]) => {
  switch (level) {
    case "view":
      return "blue";
    case "edit":
      return "orange";
    case "grant":
      return "red";
    default:
      return "default";
  }
};

const PermissionTab: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionGrant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 【修改】统一管理模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPermission, setEditingPermission] =
    useState<PermissionGrant | null>(null);

  const fetchPermissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listPermissions();
      setPermissions(data);
    } catch (error) {
      message.error("获取权限列表失败");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // 【新增】打开创建模态框的处理函数
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingPermission(null);
    setIsModalOpen(true);
  };

  // 【新增】打开编辑模态框的处理函数
  const handleOpenEditModal = (permission: PermissionGrant) => {
    setModalMode("edit");
    setEditingPermission(permission);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchPermissions();
  };

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
      render: (level: PermissionGrant["permission_level"]) => (
        <Tag color={getPermissionTagColor(level)}>{level.toUpperCase()}</Tag>
      ),
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
      // 【修改】为操作列添加“编辑”链接
      render: (_: any, record: PermissionGrant) => (
        <Space size="middle">
          <a onClick={() => handleOpenEditModal(record)}>编辑</a>
          <Popconfirm
            title="确认撤销权限？"
            onConfirm={() => message.info("撤销功能待实现")}
          >
            <a>撤销</a>
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
        // 【修改】使用新的处理函数
        onClick={handleOpenCreateModal}
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
        />
      </DataDisplayWrapper>
      {/* 【修改】为模态框传递新的props */}
      <GrantPermissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={editingPermission}
      />
    </div>
  );
};

export default PermissionTab;
