// src/pages/Management/GrantPermissionModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Button, message } from "antd";
import {
  listUsers,
  listResources,
  listGroups,
  grantPermission,
  updatePermission,
} from "../../api/knowledgeService";
import type {
  User,
  Resource,
  ResourceGroup,
  PermissionGrant,
} from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // 【修改】新增 mode 和 initialData props
  mode: "create" | "edit";
  initialData: PermissionGrant | null;
}

const { Option } = Select;

const GrantPermissionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  mode,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [groups, setGroups] = useState<ResourceGroup[]>([]);

  const resourceType = Form.useWatch("resource_type", form);

  useEffect(() => {
    // 在创建模式下，才需要加载这些数据
    if (isOpen && mode === "create") {
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

    // 在编辑模式下，填充表单
    if (isOpen && mode === "edit" && initialData) {
      form.setFieldsValue({
        target_user_id: initialData.target_user_id,
        resource_type: initialData.resource_type,
        resource_id: initialData.resource_id,
        permission_level: initialData.permission_level,
      });
    }
  }, [isOpen, mode, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (mode === "create") {
        const permissionData = {
          target_user_id: values.target_user_id,
          resource_id: values.resource_id,
          resource_type: values.resource_type,
          permission_level: values.permission_level,
        };
        console.log("Granting permission:", permissionData);
        // await grantPermission(permissionData);
        await new Promise((res) => setTimeout(res, 500));
        message.success("权限授予成功！");
      } else if (mode === "edit" && initialData) {
        // 在编辑模式下，我们只更新权限级别
        const permissionData = {
          permission_level: values.permission_level,
        };
        console.log(`Updating permission ${initialData.id}:`, permissionData);
        // await updatePermission(initialData.id, permissionData);
        await new Promise((res) => setTimeout(res, 500));
        message.success("权限更新成功！");
      }
      onSuccess();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "操作失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceTypeChange = () => {
    form.setFieldsValue({ resource_id: undefined });
  };

  const isEditMode = mode === "edit";

  return (
    <Modal
      // 【修改】根据模式显示不同标题
      title={isEditMode ? "编辑权限" : "授予新权限"}
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ permission_level: "view" }}
      >
        <Form.Item name="target_user_id" label="目标用户">
          {/* 【修改】编辑模式下禁用选择 */}
          <Select
            placeholder="选择一个用户"
            loading={isLoading}
            disabled={isEditMode}
          >
            {isEditMode && initialData ? (
              <Option
                key={initialData.target_user_id}
                value={initialData.target_user_id}
              >
                {initialData.target_user_name}
              </Option>
            ) : (
              users.map((u) => (
                <Option key={u.id} value={u.id}>
                  {u.name}
                </Option>
              ))
            )}
          </Select>
        </Form.Item>
        <Form.Item name="resource_type" label="资源类型">
          <Select
            placeholder="选择资源类型"
            onChange={handleResourceTypeChange}
            disabled={isEditMode}
          >
            <Option value="group">资源组</Option>
            <Option value="datatable">数据表</Option>
          </Select>
        </Form.Item>
        {resourceType && (
          <Form.Item name="resource_id" label="选择资源">
            <Select
              placeholder={`选择一个${
                resourceType === "group" ? "资源组" : "数据表"
              }`}
              showSearch
              optionFilterProp="children"
              disabled={isEditMode}
            >
              {isEditMode && initialData ? (
                <Option
                  key={initialData.resource_id}
                  value={initialData.resource_id}
                >
                  {initialData.resource_name}
                </Option>
              ) : resourceType === "group" ? (
                groups.map((g) => (
                  <Option key={g.id} value={g.id}>
                    {g.name}
                  </Option>
                ))
              ) : (
                resources
                  .filter((r) => r.resource_type === "datatable")
                  .map((r) => (
                    <Option key={r.id} value={r.id}>
                      {r.name}
                    </Option>
                  ))
              )}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          name="permission_level"
          label="权限级别"
          rules={[{ required: true, message: "请选择权限级别" }]}
        >
          <Select placeholder="选择权限级别">
            <Option value="view">查看 (View)</Option>
            <Option value="edit">编辑 (Edit)</Option>
            <Option value="grant">授权 (Grant)</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GrantPermissionModal;
