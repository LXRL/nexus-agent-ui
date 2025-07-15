// src/pages/Chat/index.tsx
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Input, Button, Form, Spin, Avatar, Empty } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";
import { type RootState } from "../../store/store";
import { Message, type MessageContentBlock } from "../../types";
import AnalysisResult from "../../components/feature/AnalysisResult";
import styles from "./Chat.module.css";

const ChatPage: React.FC = () => {
  const [form] = Form.useForm();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [convId, setConvId] = useState("new"); // 'new' 用于开启新对话
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async ({ question }: { question: string }) => {
    if (!question.trim()) return;

    // 1. 添加用户消息到列表
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: [{ type: "text", text: question }],
    };
    setMessages((prev) => [...prev, userMessage]);
    form.resetFields();
    setIsLoading(true);

    // 2. 准备并添加一个空的助手消息，用于后续填充
    const assistantMessageId = (Date.now() + 1).toString();
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: [],
    };
    setMessages((prev) => [...prev, initialAssistantMessage]);

    // 3. 建立 SSE 连接
    const query = encodeURIComponent(question);
    const url = `http://localhost:8080/api/v1/conversations/${convId}/messages/stream?question=${query}`;
    const eventSource = new EventSource(url, { withCredentials: true }); // withCredentials can be omitted if not needed

    let fullTableData: any = null;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { type, payload } = data;

      // 如果是第一次接收到消息，设置新的会话ID
      // (这个逻辑需要和后端确认，通常ID会在第一个事件或header中返回)
      // if (type === 'start' && payload.conversation_id) {
      //   setConvId(payload.conversation_id);
      // }

      if (type === "done") {
        eventSource.close();
        setIsLoading(false);
        return;
      }

      const newBlock: MessageContentBlock | null = payload
        ? JSON.parse(payload)
        : null;
      if (!newBlock) return;

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMessageId) {
            // 对于'text'类型，我们追加内容而不是创建新块
            if (newBlock.type === "text") {
              const lastContent = msg.content[msg.content.length - 1];
              if (lastContent && lastContent.type === "text") {
                lastContent.text += newBlock.text;
                return { ...msg };
              }
            }
            // 否则，添加一个新内容块
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
        {messages.length === 0 ? (
          <Empty description="开始对话吧！" style={{ marginTop: "20vh" }} />
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
        {isLoading && <Spin style={{ alignSelf: "center", marginTop: 12 }} />}
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
              placeholder="请输入你的问题，例如：分析每个国家的客户数量"
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
