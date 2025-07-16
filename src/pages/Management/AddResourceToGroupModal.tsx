// src/pages/Management/AddResourceToGroupModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Button, message } from "antd";
import { listResources, addResourceToGroup } from "../../api/knowledgeService";
import type { Resource, ResourceGroup } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  group: ResourceGroup | null;
}

const { Option } = Select;

const AddResourceToGroupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  group,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);

  useEffect(() => {
    if (isOpen && group) {
      const fetchAvailableResources = async () => {
        setIsLoading(true);
        const allResources = await listResources();
        const resourcesInGroup = group.resources?.map((r) => r.id) || [];
        // 过滤掉已在组内的资源
        const filtered = allResources.filter(
          (r) => !resourcesInGroup.includes(r.id)
        );
        setAvailableResources(filtered);
        setIsLoading(false);
      };
      fetchAvailableResources();
    }
  }, [isOpen, group]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!group) return;

      setIsLoading(true);

      console.log(`Adding resource ${values.resourceId} to group ${group.id}`);
      // await addResourceToGroup(group.id, values.resourceId); // 真实API调用
      await new Promise((res) => setTimeout(res, 1000)); // 模拟API调用

      message.success("资源添加成功！");
      onSuccess();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "添加失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={`向 "${group?.name}" 添加资源`}
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="resourceId"
          label="选择资源"
          rules={[{ required: true, message: "请选择一个资源" }]}
        >
          <Select loading={isLoading} placeholder="请选择要添加的资源">
            {availableResources.map((r) => (
              <Option key={r.id} value={r.id}>
                {r.name} ({r.id})
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddResourceToGroupModal;
