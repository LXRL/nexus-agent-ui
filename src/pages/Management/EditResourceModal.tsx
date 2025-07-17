// src/pages/Management/EditResourceModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Space, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { updateResource } from "../../api/knowledgeService";
import type { Resource, ResourceColumn } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  resource: Resource | null; // 接收要编辑的资源
}

const { Option } = Select;

const EditResourceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  resource,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const resourceType = Form.useWatch("resource_type", form);

  useEffect(() => {
    // 当模态框打开且有资源数据时，填充表单
    if (isOpen && resource) {
      form.setFieldsValue({
        ...resource,
        data_source_id: resource.content.data_source_id,
        columns: resource.content.columns,
      });
    }
  }, [isOpen, resource, form]);

  const handleSubmit = async () => {
    if (!resource) return;

    try {
      const values = await form.validateFields();
      setIsLoading(true);
      const resourceData = {
        ...values,
        content: {
          data_source_id: values.data_source_id,
          columns: values.columns,
        },
      };
      delete resourceData.data_source_id;

      console.log("Updating resource:", resource.id, resourceData);
      // await updateResource(resource.id, resourceData);
      await new Promise((res) => setTimeout(res, 1000));

      message.success("资源更新成功！");
      onSuccess();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "更新失败");
    } finally {
      setIsLoading(false);
    }
  };

  const renderDataTableFields = () => (
    <>
      <Form.Item
        name="data_source_id"
        label="数据源ID"
        rules={[{ required: true }]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.List name="columns">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, "name"]}
                  rules={[{ required: true, message: "请输入列名" }]}
                >
                  <Input placeholder="列名" autoComplete="off" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "type"]}
                  rules={[{ required: true, message: "请输入类型" }]}
                >
                  <Input placeholder="列类型 (如 VARCHAR)" autoComplete="off" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加数据列
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );

  return (
    <Modal
      title="编辑资源"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="资源名称" rules={[{ required: true }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="description" label="描述" rules={[{ required: true }]}>
          <Input.TextArea autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="resource_type"
          label="资源类型"
          rules={[{ required: true }]}
        >
          <Select disabled>
            <Option value="datatable">数据表 (DataTable)</Option>
            <Option value="api" disabled>
              API接口 (待支持)
            </Option>
          </Select>
        </Form.Item>
        {resourceType === "datatable" && renderDataTableFields()}
      </Form>
    </Modal>
  );
};

export default EditResourceModal;
