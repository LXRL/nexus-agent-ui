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
          colorTextSecondary: "var(--muted-foreground)",
          borderRadius: 8,
        },
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Button: {
            colorTextLightSolid: "var(--primary-foreground)",
            defaultBg: "var(--secondary)",
            defaultColor: "var(--secondary-foreground)",
            defaultBorderColor: "var(--border)",
          },
          Table: {
            colorText: "var(--foreground)",
            headerColor: "var(--muted-foreground)",
            headerBg: "var(--background)",
            rowHoverBg: "var(--accent)",
          },
          Select: {
            colorBgElevated: "var(--popover)",
            colorText: "var(--foreground)",
            optionSelectedBg: "var(--accent)",
          },
          Input: {
            colorBgContainer: "var(--card)",
            colorText: "var(--foreground)",
            colorTextPlaceholder: "var(--muted-foreground)",
          },
          Modal: {
            colorBgElevated: "var(--popover)",
            colorText: "var(--foreground)",
            colorIcon: "var(--muted-foreground)",
            titleColor: "var(--foreground)",
          },
          Tag: {
            defaultBg: "var(--secondary)",
            defaultColor: "var(--secondary-foreground)",
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
