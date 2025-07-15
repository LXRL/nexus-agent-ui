// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/global.css"; // 引入全局样式

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
