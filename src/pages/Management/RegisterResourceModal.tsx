// src/pages/Management/RegisterResourceModal.tsx
import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, Space, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { registerResource } from "../../api/knowledgeService";
import type { ResourceColumn } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const { Option } = Select;

const RegisterResourceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const resourceType = Form.useWatch("resource_type", form);

  const handleSubmit = async () => {
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

      console.log("Submitting:", resourceData);
      // await registerResource(resourceData);
      await new Promise((res) => setTimeout(res, 1000));

      message.success("资源注册成功！");
      onSuccess();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "注册失败");
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
        <Input
          placeholder="例如：ds-mysql-1"
          autoComplete="off" // 【修改】
        />
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
      title="注册新资源"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          resource_type: "datatable",
          columns: [{ name: "", type: "" }],
        }}
      >
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
          <Select>
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

export default RegisterResourceModal;
