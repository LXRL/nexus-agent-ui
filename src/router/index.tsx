// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ChatPage from "../pages/Chat";
import ManagementPage from "../pages/Management"; // 【新增】引入管理页面

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ChatPage />,
      },
      // 【新增】管理页面路由
      {
        path: "management",
        element: <ManagementPage />,
      },
    ],
  },
]);
