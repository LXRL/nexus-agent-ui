// src/components/feature/AttributionReport/index.tsx
import React from "react";
import { Card, Typography, Table, Tag, Statistic, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import type { AttributionResult, AttributionFactor } from "../../../types";

interface Props {
  data: AttributionResult;
}

const columns = [
  {
    title: "关键维度",
    dataIndex: "dimension_value",
    key: "dimension_value",
  },
  {
    title: "变化值",
    dataIndex: "change_value",
    key: "change_value",
    render: (value: number) => (
      <Statistic
        value={value}
        precision={2}
        valueStyle={{
          color: value > 0 ? "#3f8600" : "#cf1322",
          fontSize: "1em",
        }}
        prefix={value > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      />
    ),
  },
  {
    title: "贡献度",
    dataIndex: "contribution",
    key: "contribution",
    render: (value: string) => <Tag color="blue">{value}</Tag>,
  },
  {
    title: "详细描述",
    dataIndex: "description",
    key: "description",
  },
];

const AttributionReport: React.FC<Props> = ({ data }) => {
  return (
    <Card bordered={false} style={{ backgroundColor: "#f6f8fa" }}>
      <Typography.Title level={5}>归因分析报告</Typography.Title>
      <Typography.Paragraph type="secondary">
        {data.summary}
      </Typography.Paragraph>
      <Table
        columns={columns}
        dataSource={data.factors.map((f) => ({ ...f, key: f.dimension_value }))}
        pagination={false}
        size="middle"
      />
    </Card>
  );
};

export default AttributionReport;
