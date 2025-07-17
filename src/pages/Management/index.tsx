// src/pages/Management/index.tsx
import React from "react";
import { Card, Tabs, Typography } from "antd";
import type { TabsProps } from "antd";
import ResourceTab from "./ResourceTab";
import GroupTab from "./GroupTab";
import PermissionTab from "./PermissionTab"; // 确保 PermissionTab 已被正确引入
import styles from "./Management.module.css";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "资源管理",
    children: <ResourceTab />,
  },
  {
    key: "2",
    label: "资源组管理",
    children: <GroupTab />,
  },
  {
    key: "3",
    label: "权限管理",
    // 【核心修改】确保这里的 children 指向正确的 <PermissionTab /> 组件
    children: <PermissionTab />,
  },
];

const ManagementPage: React.FC = () => {
  return (
    <div className={styles.managementPage}>
      <Typography.Title level={3}>知识库管理</Typography.Title>
      <Typography.Text type="secondary">
        在这里注册和管理可供AI使用的资源，如数据表、API等。
      </Typography.Text>
      <Card className={styles.tabsCard}>
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default ManagementPage;
