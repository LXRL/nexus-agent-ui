// src/components/layout/Sidebar.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RootState, AppDispatch } from "../../store/store";
import { setActiveConvId } from "../../store/slices/conversationSlice";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, activeConvId } = useSelector(
    (state: RootState) => state.conversation
  );

  const handleNewChat = () => {
    dispatch(setActiveConvId("new"));
  };

  const handleSelectConv = (id: string) => {
    dispatch(setActiveConvId(id));
  };

  return (
    <div className={styles.sidebar}>
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
              activeConvId === conv.id ? styles.convItemActive : ""
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
      {/* 未来可以在这里添加用户头像、设置等 */}
    </div>
  );
};

export default Sidebar;
