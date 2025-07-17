// src/components/layout/Sidebar.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
// 【修改】引入 Tooltip 和新的 FormOutlined 图标
import { Button, Divider, Tooltip } from "antd";
import { FormOutlined, SettingOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import { setActiveConvId } from "../../store/slices/conversationSlice";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { conversations, activeConvId } = useSelector(
    (state: RootState) => state.conversation
  );

  const handleNewChat = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    dispatch(setActiveConvId("new"));
  };

  const handleSelectConv = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    dispatch(setActiveConvId(id));
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.sidebarHeader}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onToggle}
            style={{ color: "var(--foreground)" }}
          />
          {/* 【修改】将“新建对话”按钮改为带Tooltip的图标按钮 */}
          <Tooltip title="新建对话" placement="right">
            <Button
              type="text"
              icon={<FormOutlined />}
              onClick={handleNewChat}
              style={{ color: "var(--foreground)" }}
            />
          </Tooltip>
        </div>
        <div className={styles.convList}>
          {conversations.map((conv) => (
            // 【修改】为整个项目添加 Tooltip
            <Tooltip
              key={conv.id}
              title={collapsed ? conv.title : ""} // 仅在折叠时显示Tooltip
              placement="right"
            >
              <div
                className={`${styles.convItem} ${
                  activeConvId === conv.id && location.pathname === "/"
                    ? styles.convItemActive
                    : ""
                }`}
                onClick={() => handleSelectConv(conv.id)}
              >
                <div className={styles.convTitle}>
                  {collapsed ? conv.title.charAt(0) : conv.title || "新对话"}
                </div>
                {!collapsed && (
                  <div className={styles.convDate}>
                    {new Date(conv.updated_at).toLocaleString()}
                  </div>
                )}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <Divider style={{ margin: "8px 0", borderColor: "var(--border)" }} />
        {/* 【修改】为底部按钮也添加 Tooltip */}
        <Tooltip title={collapsed ? "知识库管理" : ""} placement="right">
          <Button
            type="text"
            icon={<SettingOutlined />}
            style={{
              color: "var(--foreground)",
              width: "100%",
              textAlign: "center",
            }} // 统一居中
            onClick={() => navigate("/management")}
          >
            {!collapsed && "知识库管理"}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
