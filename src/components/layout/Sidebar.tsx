// src/components/layout/Sidebar.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Divider } from "antd";
// 【修改】引入新的图标
import { PlusOutlined, SettingOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import { setActiveConvId } from "../../store/slices/conversationSlice";
import styles from "./Sidebar.module.css";

// 【新增】定义组件的 Props 类型
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
        {/* 【新增】侧边栏顶部，用于放置折叠按钮和新建对话按钮 */}
        <div className={styles.sidebarHeader}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onToggle}
            style={{ color: "var(--foreground)" }}
          />
          {/* 【修改】当侧边栏折叠时，只显示图标 */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.newChatButton}
            onClick={handleNewChat}
            style={{ width: collapsed ? "auto" : "100%" }}
          >
            {!collapsed && "新建对话"}
          </Button>
        </div>
        <div className={styles.convList}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`${styles.convItem} ${
                activeConvId === conv.id && location.pathname === "/"
                  ? styles.convItemActive
                  : ""
              }`}
              onClick={() => handleSelectConv(conv.id)}
            >
              {/* 【修改】当折叠时，只显示标题的第一个字 */}
              <div className={styles.convTitle}>
                {collapsed ? conv.title.charAt(0) : conv.title || "新对话"}
              </div>
              {!collapsed && (
                <div className={styles.convDate}>
                  {new Date(conv.updated_at).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <Divider style={{ margin: "8px 0", borderColor: "var(--border)" }} />
        <Button
          type="text"
          icon={<SettingOutlined />}
          style={{
            color: "var(--foreground)",
            width: "100%",
            textAlign: collapsed ? "center" : "left",
          }}
          onClick={() => navigate("/management")}
        >
          {!collapsed && "知识库管理"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
