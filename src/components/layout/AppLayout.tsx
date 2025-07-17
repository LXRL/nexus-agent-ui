// src/components/layout/AppLayout.tsx
import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const { Sider, Content } = Layout;

const layoutStyle: React.CSSProperties = {
  minHeight: "100vh",
};

// 【新增】为Sider定义一个内联样式，使其背景透明，从而采用内部Sidebar组件的背景色
const siderStyle: React.CSSProperties = {
  background: "none",
};

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={layoutStyle}>
      <Sider
        width="260"
        // 【修改】移除 antd 的 theme，让我们的CSS变量完全控制样式
        // theme="dark"
        style={siderStyle} // 【新增】
        breakpoint="lg"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Sidebar />
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
