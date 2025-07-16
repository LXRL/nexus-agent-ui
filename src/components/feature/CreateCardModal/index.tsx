// src/components/feature/CreateCardModal/index.tsx
import React, { useState } from "react";
import { Modal, Form, Input, Button, message as antdMessage } from "antd";
import { createCardFromConversation } from "../../../api/conversationService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  convId: string | null;
}

const CreateCardModal: React.FC<Props> = ({ isOpen, onClose, convId }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!convId) {
        antdMessage.error("无效的会话ID");
        return;
      }

      setIsLoading(true);
      const response = await createCardFromConversation(
        convId,
        values.cardName
      );
      antdMessage.success(response.message || "图卡创建成功！"); // 使用后端的成功信息
      handleClose();
    } catch (error: any) {
      antdMessage.error(error?.response?.data?.error || "创建失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="将分析结果存为图卡"
      open={isOpen}
      onCancel={handleClose}
      destroyOnClose
      footer={[
        <Button key="back" onClick={handleClose}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleOk}
        >
          创建
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="create_card_form"
        requiredMark={false}
      >
        <Form.Item
          name="cardName"
          label="图卡名称"
          rules={[{ required: true, message: "请输入图卡名称!" }]}
        >
          <Input placeholder="例如：Q3季度各国客户数分析" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCardModal;
