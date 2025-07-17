// src/components/layout/Sidebar.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Divider } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
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
          // 【修改】确保这是一个主按钮，ConfigProvider会处理它的颜色
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

      <div className={styles.sidebarFooter}>
        <Divider style={{ margin: "8px 0", borderColor: "var(--border)" }} />
        <Button
          type="text"
          icon={<SettingOutlined />}
          style={{
            color: "var(--foreground)",
            width: "100%",
            textAlign: "left",
          }}
          onClick={() => navigate("/management")}
        >
          知识库管理
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
