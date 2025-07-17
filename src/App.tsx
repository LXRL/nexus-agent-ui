// src/App.tsx
import React from "react";
import { ConfigProvider, theme } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  React.useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: `var(--primary)`,
          colorInfo: `var(--primary)`,
          colorBgBase: `var(--background)`,
          colorBgContainer: `var(--card)`,
          colorBgLayout: `var(--background)`,
          colorBorder: `var(--border)`,
          colorText: `var(--foreground)`,
          colorTextSecondary: `var(--muted-foreground)`,
          borderRadius: 8, // 使用 0.5rem 对应的像素值，或直接设定
        },
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        // 【核心修改】针对特定组件进行样式覆盖
        // 【核心修改】针对特定组件进行样式覆盖
        components: {
          Button: {
            // 解决主按钮“黑底黑字”问题
            // colorTextLightSolid 是指在深色背景（Solid）按钮上的文字颜色
            colorTextLightSolid: "var(--primary-foreground)",
            defaultBg: "var(--secondary)",
            defaultColor: "var(--secondary-foreground)",
            defaultBorderColor: "var(--border)",
          },
          Table: {
            // 解决表格行“黑底黑字”问题
            // antd中，斑马纹/悬浮/选中行的背景色是基于 colorBgContainer 计算的
            // 我们需要确保文本颜色能覆盖默认计算值
            colorText: "var(--foreground)",
            headerColor: "var(--muted-foreground)",
            headerBg: "var(--background)",
            rowHoverBg: "var(--accent)",
          },
          Select: {
            // 解决下拉菜单“黑底黑字”问题
            // antd中下拉菜单这类浮层使用 colorBgElevated
            colorBgElevated: "var(--popover)",
            colorText: "var(--foreground)",
            optionSelectedBg: "var(--accent)",
          },
          Input: {
            // 解决输入框背景色问题
            colorBgContainer: "var(--card)", // 输入框背景
            colorText: "var(--foreground)",
            colorTextPlaceholder: "var(--muted-foreground)",
          },
          Modal: {
            colorBgElevated: "var(--popover)",
            colorText: "var(--foreground)",
            colorIcon: "var(--muted-foreground)",
            titleColor: "var(--foreground)",
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
