// src/components/layout/AppLayout.tsx
import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const { Sider, Content } = Layout;

const layoutStyle: React.CSSProperties = {
  minHeight: "100vh",
};

const siderStyle: React.CSSProperties = {
  background: "none",
};

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={layoutStyle}>
      <Sider
        width="260"
        style={siderStyle}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        // 【修改】隐藏 Sider 自带的底部触发器
        trigger={null}
      >
        {/* 【修改】将状态和控制函数作为 props 传递给 Sidebar */}
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </Sider>
      <Layout>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
