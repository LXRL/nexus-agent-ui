// src/pages/Chat/index.tsx
// 【修改】从 React 引入 useRef 和 useEffect
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// 【修改】从 antd 引入 InputRef 类型
import {
  Input,
  Button,
  Form,
  Spin,
  Empty,
  message as antdMessage,
  type InputRef,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import type { RootState, AppDispatch } from "../../store/store";
import type { Message, MessageContentBlock } from "../../types";
import {
  setActiveConvId,
  updateConversation,
} from "../../store/slices/conversationSlice";
import {
  getConversationHistory,
  performAttributionAnalysis,
} from "../../api/conversationService";
import AnalysisResult from "../../components/feature/AnalysisResult";
import AttributionReport from "../../components/feature/AttributionReport";
import CreateCardModal from "../../components/feature/CreateCardModal";
import styles from "./Chat.module.css";

const ChatPage: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const activeConvId = useSelector(
    (state: RootState) => state.conversation.activeConvId
  );

  // 【新增】创建一个 ref 来引用输入框组件
  const inputRef = useRef<InputRef>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadConversation = async () => {
      if (activeConvId === "new") {
        setMessages([]);
        form.resetFields();
        // 切换到新对话时也自动聚焦
        inputRef.current?.focus();
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

  // 【新增】一个 Effect 来监听 isLoading 状态的变化
  useEffect(() => {
    // 当加载结束时（即 AI 响应完成），重新聚焦到输入框
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handlePerformAttribution = async () => {
    if (activeConvId === "new") {
      antdMessage.info("请先完成当前分析再进行归因。");
      return;
    }
    setIsLoading(true);
    try {
      const result = await performAttributionAnalysis(
        activeConvId,
        "请详细分析一下原因"
      );
      const attributionMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: [{ type: "attribution", data: result }],
      };
      setMessages((prev) => [...prev, attributionMessage]);
    } catch (error: any) {
      antdMessage.error(error?.response?.data?.error || "归因分析失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async ({ question }: { question: string }) => {
    if (!question?.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: [{ type: "text", text: question }],
    };
    setMessages((prev) => [...prev, userMessage]);
    form.resetFields();
    // 注意：我们不再在这里调用 focus()，而是通过上面的 useEffect 来处理

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
    const eventSource = new EventSource(url);

    let newConvId: string | null = null;
    let newConvTitle: string | null = null;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { type, payload } = data;

      if (type === "start" && payload) {
        const parsedPayload = JSON.parse(payload);
        if (parsedPayload.conversation_id && currentConvId === "new") {
          newConvId = parsedPayload.conversation_id;
          newConvTitle = parsedPayload.title || question.substring(0, 20);
        }
      }

      if (type === "done") {
        eventSource.close();
        setIsLoading(false);
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

  const renderMessageContent = (message: Message) => {
    if (message.role === "user") {
      return message.content[0].type === "text"
        ? message.content[0].text
        : null;
    }

    const firstBlock = message.content[0];
    if (firstBlock && firstBlock.type === "attribution") {
      return <AttributionReport data={firstBlock.data} />;
    }

    return (
      <AnalysisResult
        message={message}
        onSaveCard={() => setIsCreateCardModalOpen(true)}
        onPerformAttribution={handlePerformAttribution}
      />
    );
  };

  return (
    <>
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
                <div className={styles.messageContent}>
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))
          )}
          {isLoading && messages.length > 0 && (
            <Spin style={{ alignSelf: "center", marginTop: 12 }} />
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
                // 【修改】将 ref 附加到 Input 组件上
                ref={inputRef}
                size="large"
                placeholder="请输入你的问题..."
                disabled={isLoading}
                autoComplete="off"
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

      <CreateCardModal
        isOpen={isCreateCardModalOpen}
        onClose={() => setIsCreateCardModalOpen(false)}
        convId={activeConvId === "new" ? null : activeConvId}
      />
    </>
  );
};

export default ChatPage;
