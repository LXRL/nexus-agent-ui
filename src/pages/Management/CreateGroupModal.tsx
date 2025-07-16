// src/pages/Management/CreateGroupModal.tsx
import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { createGroup } from "../../api/knowledgeService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateGroupModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      console.log("Creating group with:", values);
      // await createGroup(values); // 真实API调用
      await new Promise((res) => setTimeout(res, 1000)); // 模拟API调用

      message.success("资源组创建成功！");
      onSuccess();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "创建失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="创建新资源组"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="组名称"
          rules={[{ required: true, message: "请输入组名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: "请输入描述" }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGroupModal;
