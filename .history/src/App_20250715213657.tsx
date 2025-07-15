// src/App.tsx
import { ConfigProvider, theme } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return (
    <ConfigProvider
      theme={{
        // 使用 Design Token 将 CSS 变量与 AntD 主题连接
        token: {
          colorPrimary: "var(--primary-color)",
          colorBgLayout: "var(--layout-background-color)",
          colorBgContainer: "var(--component-background-color)",
          borderRadius: 6,
        },
        // 算法可以用于暗黑模式等
        // algorithm: theme.darkAlgorithm,
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
