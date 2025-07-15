// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ChatPage from "../pages/Chat";
// 未来会在这里引入管理页面
// import ManagementPage from '../pages/Management';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    // errorElement: <ErrorPage />, // 可选的错误边界页面
    children: [
      {
        index: true, // 默认子路由
        element: <ChatPage />,
      },
      // {
      //   path: 'management',
      //   element: <ManagementPage />,
      // },
    ],
  },
]);
