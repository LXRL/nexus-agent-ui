// src/components/common/DataDisplayWrapper/index.tsx
import React from "react";
import { Spin, Result, Button, Empty, Skeleton } from "antd";
import type { ReactNode } from "react";

interface Props {
  isLoading: boolean;
  error: Error | null;
  data: any[] | undefined;
  onRetry: () => void;
  children: ReactNode;
  loadingComponent?: ReactNode; // 可选的自定义加载组件
}

const DataDisplayWrapper: React.FC<Props> = ({
  isLoading,
  error,
  data,
  onRetry,
  children,
  loadingComponent,
}) => {
  if (isLoading) {
    return loadingComponent || <Skeleton active paragraph={{ rows: 5 }} />;
  }

  if (error) {
    return (
      <Result
        status="error"
        title="数据加载失败"
        subTitle={
          error.message || "抱歉，加载数据时遇到问题，请检查您的网络并重试。"
        }
        extra={
          <Button type="primary" onClick={onRetry}>
            重试
          </Button>
        }
      />
    );
  }

  if (!data || data.length === 0) {
    return <Empty description="暂无数据" />;
  }

  return <>{children}</>;
};

export default DataDisplayWrapper;
