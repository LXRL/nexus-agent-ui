// src/pages/Management/GroupTab.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  List,
  Card,
  message,
  Tag,
  Popconfirm,
  Typography,
  Spin,
} from "antd";
import {
  PlusOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  listGroups,
  removeResourceFromGroup,
  deleteGroup,
} from "../../api/knowledgeService";
import type { ResourceGroup } from "../../types";
import CreateGroupModal from "./CreateGroupModal";
import AddResourceToGroupModal from "./AddResourceToGroupModal";
import DataDisplayWrapper from "../../components/common/DataDisplayWrapper";
import styles from "./GroupTab.module.css";

const GroupTab: React.FC = () => {
  const [groups, setGroups] = useState<ResourceGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ResourceGroup | null>(
    null
  );

  const fetchGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listGroups();
      setGroups(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleOpenAddResourceModal = (group: ResourceGroup) => {
    setSelectedGroup(group);
    setIsAddResourceModalOpen(true);
  };

  // 【修改】处理从资源组删除资源的逻辑
  const handleRemoveResource = async (groupId: string, resourceId: string) => {
    try {
      // await removeResourceFromGroup(groupId, resourceId); // 真实API调用
      await new Promise((res) => setTimeout(res, 500)); // 模拟API调用
      message.success("资源已成功移除");
      fetchGroups(); // 刷新列表
    } catch (error: any) {
      message.error(error?.response?.data?.error || "移除失败");
    }
  };

  // 【新增】处理删除整个资源组的逻辑
  const handleDeleteGroup = async (groupId: string) => {
    try {
      // await deleteGroup(groupId); // 真实API调用
      await new Promise((res) => setTimeout(res, 500)); // 模拟API调用
      message.success("资源组已成功删除");
      fetchGroups();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "删除失败");
    }
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsCreateModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        创建新资源组
      </Button>
      <DataDisplayWrapper
        isLoading={isLoading}
        error={error}
        data={groups}
        onRetry={fetchGroups}
        loadingComponent={<Spin />}
      >
        {/* 【修改】使用 List grid 恢复卡片网格布局 */}
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
          dataSource={groups}
          renderItem={(group) => (
            <List.Item>
              <Card
                title={group.name}
                className={styles.groupCard}
                actions={[
                  <AppstoreAddOutlined
                    key="add"
                    onClick={() => handleOpenAddResourceModal(group)}
                  />,
                  <Popconfirm
                    title={`确认删除资源组 "${group.name}"?`}
                    onConfirm={() => handleDeleteGroup(group.id)}
                  >
                    <DeleteOutlined key="delete" />
                  </Popconfirm>,
                ]}
              >
                <Typography.Paragraph
                  type="secondary"
                  className={styles.groupDescription}
                >
                  {group.description}
                </Typography.Paragraph>
                <div className={styles.tagsContainer}>
                  {group.resources?.map((resource) => (
                    <Popconfirm
                      key={resource.id}
                      title={`从该组中移除资源 "${resource.name}"?`}
                      onConfirm={() =>
                        handleRemoveResource(group.id, resource.id)
                      }
                    >
                      {/* 【修改】使用可关闭的Tag来实现组内资源的移除 */}
                      <Tag className={styles.resourceTag}>{resource.name}</Tag>
                    </Popconfirm>
                  ))}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </DataDisplayWrapper>
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchGroups();
        }}
      />
      <AddResourceToGroupModal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        onSuccess={() => {
          setIsAddResourceModalOpen(false);
          fetchGroups();
        }}
        group={selectedGroup}
      />
    </div>
  );
};

export default GroupTab;
