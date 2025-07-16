// src/components/layout/AppLayout.tsx
import React, { useState } from "react"; // 【新增】useState
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const { Sider, Content } = Layout;

const layoutStyle: React.CSSProperties = {
  minHeight: "100vh",
};

const AppLayout: React.FC = () => {
  // 【新增】状态来控制侧边栏的折叠
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={layoutStyle}>
      <Sider
        width="260"
        theme="dark" // 确保Sider主题与Sidebar组件背景色一致
        // 【新增】响应式断点，当屏幕宽度小于 'lg' (992px) 时，侧边栏会自动折叠
        breakpoint="lg"
        // 【新增】断点触发时的回调函数
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        // 【新增】允许用户手动收起/展开
        collapsible
        // 【新增】受控的折叠状态
        collapsed={collapsed}
        // 【新增】手动触发折叠时的回调
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
