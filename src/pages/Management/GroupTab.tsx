// src/pages/Management/GroupTab.tsx
import React, { useState, useEffect } from "react";
import { Button, List, Card, message, Tag, Popconfirm } from "antd";
import {
  PlusOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { listGroups } from "../../api/knowledgeService";
import type { ResourceGroup } from "../../types";
import CreateGroupModal from "./CreateGroupModal";
import AddResourceToGroupModal from "./AddResourceToGroupModal";

const GroupTab: React.FC = () => {
  const [groups, setGroups] = useState<ResourceGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ResourceGroup | null>(
    null
  );

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const data = await listGroups();
      setGroups(data);
    } catch (error) {
      message.error("获取资源组列表失败");
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
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={groups}
        loading={isLoading}
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
