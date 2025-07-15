// src/components/layout/AppLayout.tsx
import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: 'var(--sidebar-background-color)',
};

const layoutStyle: React.CSSProperties = {
  minHeight: '100vh',
};

const AppLayout: React.FC = () => {
  return (
    <Layout style={layoutStyle}>
      <Sider width="260" style={siderStyle}>
        {/* 左侧边栏内容，如会话列表，将在这里构建 */}
        Sidebar Content
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