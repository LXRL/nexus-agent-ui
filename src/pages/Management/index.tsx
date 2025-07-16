// src/pages/Management/index.tsx
import React from "react";
import { Card, Tabs, Typography } from "antd";
import type { TabsProps } from "antd";
import ResourceTab from "./ResourceTab";
import GroupTab from "./GroupTab"; // 【新增】
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
    children: <GroupTab />, // 【修改】
    disabled: false, // 【修改】
  },
  {
    key: "3",
    label: "权限管理",
    children: "权限管理功能待开发。",
    disabled: true,
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
