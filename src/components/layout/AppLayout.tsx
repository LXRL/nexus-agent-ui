// src/components/layout/AppLayout.tsx
import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // 引入 Sidebar 组件

const { Sider, Content } = Layout;

const layoutStyle: React.CSSProperties = {
  minHeight: "100vh",
};

const AppLayout: React.FC = () => {
  return (
    <Layout style={layoutStyle}>
      <Sider width="260">
        <Sidebar /> {/* 使用 Sidebar 组件替换占位符 */}
      </Sider>
      <Layout>
        <Content>
          {/* Outlet 会渲染当前匹配的子路由组件，例如 ChatPage */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
