// src/pages/Management/GrantPermissionModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Button, message } from "antd";
import {
  listUsers,
  listResources,
  listGroups,
  grantPermission,
} from "../../api/knowledgeService";
import type { User, Resource, ResourceGroup } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const { Option } = Select;

const GrantPermissionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [groups, setGroups] = useState<ResourceGroup[]>([]);

  const resourceType = Form.useWatch("resource_type", form);

  useEffect(() => {
    if (isOpen) {
      // 并行获取所有下拉列表所需的数据
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [usersData, resourcesData, groupsData] = await Promise.all([
            listUsers(),
            listResources(),
            listGroups(),
          ]);
          setUsers(usersData);
          setResources(resourcesData);
          setGroups(groupsData);
        } catch {
          message.error("加载基础数据失败");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      // 根据 API 文档，请求体需要 target_user_id, resource_id, resource_type, permission_level
      const permissionData = {
        target_user_id: values.target_user_id,
        resource_id: values.resource_id,
        resource_type: values.resource_type,
        permission_level: "view", // 目前API文档只明确了 view
      };

      console.log("Granting permission:", permissionData);
      // await grantPermission(permissionData); // 真实API调用
      await new Promise((res) => setTimeout(res, 1000)); // 模拟API调用

      message.success("权限授予成功！");
      onSuccess();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "授权失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceTypeChange = () => {
    // 切换资源类型时，清空已选择的资源ID
    form.setFieldsValue({ resource_id: undefined });
  };

  return (
    <Modal
      title="授予新权限"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="target_user_id"
          label="目标用户"
          rules={[{ required: true, message: "请选择用户" }]}
        >
          <Select placeholder="选择一个用户" loading={isLoading}>
            {users.map((u) => (
              <Option key={u.id} value={u.id}>
                {u.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="resource_type"
          label="资源类型"
          rules={[{ required: true, message: "请选择资源类型" }]}
        >
          <Select
            placeholder="选择资源类型"
            onChange={handleResourceTypeChange}
          >
            <Option value="group">资源组</Option>
            <Option value="datatable">数据表</Option>
          </Select>
        </Form.Item>
        {resourceType && (
          <Form.Item
            name="resource_id"
            label="选择资源"
            rules={[{ required: true, message: "请选择具体资源" }]}
          >
            <Select
              placeholder={`选择一个${
                resourceType === "group" ? "资源组" : "数据表"
              }`}
              showSearch
              optionFilterProp="children"
            >
              {resourceType === "group"
                ? groups.map((g) => (
                    <Option key={g.id} value={g.id}>
                      {g.name}
                    </Option>
                  ))
                : resources.map((r) => (
                    <Option key={r.id} value={r.id}>
                      {r.name}
                    </Option>
                  ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default GrantPermissionModal;
