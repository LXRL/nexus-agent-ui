// src/components/layout/Sidebar.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Divider } from "antd"; // 【新增】Divider
import { PlusOutlined, SettingOutlined } from "@ant-design/icons"; // 【新增】SettingOutlined
import { useNavigate, useLocation } from "react-router-dom"; // 【新增】useNavigate, useLocation
import type { RootState, AppDispatch } from "../../store/store";
import { setActiveConvId } from "../../store/slices/conversationSlice";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { conversations, activeConvId } = useSelector(
    (state: RootState) => state.conversation
  );

  const handleNewChat = () => {
    // 如果当前不在聊天页，先跳转
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.newChatButton}
          onClick={handleNewChat}
        >
          新建对话
        </Button>
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
              <div className={styles.convTitle}>{conv.title || "新对话"}</div>
              <div className={styles.convDate}>
                {new Date(conv.updated_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 【新增】底部设置入口 */}
      <div className={styles.sidebarFooter}>
        <Divider
          style={{ margin: "8px 0", borderColor: "rgba(255, 255, 255, 0.2)" }}
        />
        <Button
          type="text"
          icon={<SettingOutlined />}
          style={{ color: "white", width: "100%", textAlign: "left" }}
          onClick={() => navigate("/management")}
        >
          知识库管理
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
