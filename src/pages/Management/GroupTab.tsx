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
import DataDisplayWrapper from "../../components/common/DataDisplayWrapper"; // 【新增】

const GroupTab: React.FC = () => {
  const [groups, setGroups] = useState<ResourceGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null); // 【新增】

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ResourceGroup | null>(
    null
  );

  const fetchGroups = async () => {
    setIsLoading(true);
    setError(null); // 【新增】
    try {
      const data = await listGroups();
      setGroups(data);
    } catch (err: any) {
      setError(err); // 【修改】
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

  // 【新增】为List组件定制一个骨架屏
  const ListLoadingSkeleton = (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={[1, 2, 3]} // 渲染3个骨架卡片
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
      {/* 【修改】使用DataDisplayWrapper包裹 */}
      <DataDisplayWrapper
        isLoading={isLoading}
        error={error}
        data={groups}
        onRetry={fetchGroups}
        loadingComponent={ListLoadingSkeleton} // 使用自定义的加载组件
      >
        <List
          grid={{ gutter: 16, column: 3 }}
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
