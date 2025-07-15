// src/components/feature/AnalysisResult/TableBlock.tsx
import React from "react";
import { Card, Table } from "antd";
import { TableContent } from "../../../types";

interface Props {
  data: TableContent["query_result"];
}

const TableBlock: React.FC<Props> = ({ data }) => {
  const columns = data.columns.map((col) => ({
    title: col.name,
    dataIndex: col.name,
    key: col.name,
  }));

  const dataSource = data.rows.map((row, rowIndex) => {
    const rowObj: { [key: string]: any } = { key: rowIndex };
    data.columns.forEach((col, colIndex) => {
      rowObj[col.name] = row[colIndex];
    });
    return rowObj;
  });

  return (
    <Card size="small" title="查询结果" style={{ marginTop: 12 }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
        size="small"
      />
    </Card>
  );
};

export default TableBlock;
