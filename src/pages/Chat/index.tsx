// src/pages/Chat/index.tsx
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Input,
  Button,
  Form,
  Spin,
  Avatar,
  Empty,
  message as antdMessage,
} from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";
import type { RootState, AppDispatch } from "../../store/store";
import type { Message, MessageContentBlock } from "../../types";
import {
  setActiveConvId,
  updateConversation,
} from "../../store/slices/conversationSlice";
import { getConversationHistory } from "../../api/conversationService";
import AnalysisResult from "../../components/feature/AnalysisResult";
import styles from "./Chat.module.css";

const ChatPage: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const activeConvId = useSelector(
    (state: RootState) => state.conversation.activeConvId
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect to handle conversation switching
  useEffect(() => {
    const loadConversation = async () => {
      if (activeConvId === "new") {
        setMessages([]);
        form.resetFields();
      } else {
        setIsLoading(true);
        try {
          const historyMessages = await getConversationHistory(activeConvId);
          setMessages(historyMessages);
        } catch (error) {
          antdMessage.error("加载会话历史失败！");
          setMessages([]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadConversation();
  }, [activeConvId]);

  const handleSendMessage = async ({ question }: { question: string }) => {
    if (!question?.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: [{ type: "text", text: question }],
    };
    setMessages((prev) => [...prev, userMessage]);
    form.resetFields();
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: [],
    };
    setMessages((prev) => [...prev, initialAssistantMessage]);

    const currentConvId = activeConvId;
    const query = encodeURIComponent(question);
    const url = `http://localhost:8080/api/v1/conversations/${currentConvId}/messages/stream?question=${query}`;
    const eventSource = new EventSource(url); // Removed withCredentials as it's not standard for SSE unless CORS is configured for it

    let newConvId: string | null = null;
    let newConvTitle: string | null = null;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { type, payload } = data;

      // 假设后端在 'start' 事件中返回新会话ID和标题
      if (type === "start" && payload) {
        const parsedPayload = JSON.parse(payload);
        if (parsedPayload.conversation_id && currentConvId === "new") {
          newConvId = parsedPayload.conversation_id;
          newConvTitle = parsedPayload.title || question.substring(0, 20); // Use a part of question as title if not provided
        }
      }

      if (type === "done") {
        eventSource.close();
        setIsLoading(false);
        // 如果这是一个新创建的会话, 更新store
        if (newConvId && newConvTitle) {
          dispatch(
            updateConversation({
              id: newConvId,
              title: newConvTitle,
              updated_at: new Date().toISOString(),
            })
          );
          dispatch(setActiveConvId(newConvId));
        }
        return;
      }

      const newBlock: MessageContentBlock | null = payload
        ? JSON.parse(payload)
        : null;
      if (!newBlock) return;

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMessageId) {
            if (newBlock.type === "text") {
              const lastContent = msg.content[msg.content.length - 1];
              if (lastContent && lastContent.type === "text") {
                lastContent.text += newBlock.text;
                return { ...msg };
              }
            }
            return { ...msg, content: [...msg.content, newBlock] };
          }
          return msg;
        })
      );
    };

    eventSource.onerror = () => {
      const errorBlock: MessageContentBlock = {
        type: "error",
        error: "与服务器的连接发生错误。",
      };
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: [...msg.content, errorBlock] }
            : msg
        )
      );
      eventSource.close();
      setIsLoading(false);
    };
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.messagesContainer}>
        {messages.length === 0 && !isLoading ? (
          <Empty
            description="开始一段新的分析对话吧！"
            style={{ marginTop: "20vh" }}
          />
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageWrapper} ${
                msg.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage
              }`}
            >
              <Avatar
                icon={
                  msg.role === "user" ? <UserOutlined /> : <RobotOutlined />
                }
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              />
              <div className={styles.messageContent}>
                {msg.role === "user" ? (
                  msg.content[0].type === "text" && msg.content[0].text
                ) : (
                  <AnalysisResult message={msg} />
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <Spin style={{ position: "absolute", top: "50%", left: "50%" }} />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <Form
          form={form}
          onFinish={handleSendMessage}
          layout="inline"
          style={{ width: "100%" }}
        >
          <Form.Item name="question" style={{ flex: 1 }}>
            <Input
              size="large"
              placeholder="请输入你的问题..."
              disabled={isLoading}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SendOutlined />}
              disabled={isLoading}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChatPage;
