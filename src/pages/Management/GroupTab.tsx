// src/pages/Management/GroupTab.tsx
import React, { useState, useEffect } from "react";
import { Button, List, Card, message, Tag, Popconfirm, Skeleton } from "antd";
import {
  PlusOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { listGroups } from "../../api/knowledgeService";
import type { ResourceGroup } from "../../types";
import CreateGroupModal from "./CreateGroupModal";
import AddResourceToGroupModal from "./AddResourceToGroupModal";
import DataDisplayWrapper from "../../components/common/DataDisplayWrapper";

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

  const ListLoadingSkeleton = (
    <List
      // 【修改】骨架屏也使用响应式布局
      grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
      dataSource={[1, 2, 3]}
      renderItem={() => (
        <List.Item>
          <Card>
            <Skeleton active />
          </Card>
        </List.Item>
      )}
    />
  );

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
        loadingComponent={ListLoadingSkeleton}
      >
        <List
          // 【修改】grid属性设为响应式对象
          // 在特小/小屏幕上为1列，中等屏幕为2列，大屏幕及以上为3列
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
          dataSource={groups}
          renderItem={(group) => (
            <List.Item>
              <Card
                title={group.name}
                actions={[
                  <AppstoreAddOutlined
                    key="add"
                    onClick={() => handleOpenAddResourceModal(group)}
                  />,
                  <Popconfirm
                    title="确认删除？"
                    onConfirm={() => message.info("删除功能待实现")}
                  >
                    <DeleteOutlined key="delete" />
                  </Popconfirm>,
                ]}
              >
                <p>{group.description}</p>
                <div>
                  {group.resources?.map((r) => (
                    <Tag key={r.id}>{r.name}</Tag>
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
