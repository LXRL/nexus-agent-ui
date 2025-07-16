// src/components/feature/AnalysisResult/index.tsx
import React from "react";
import { Alert, Button, Divider, Space, Typography } from "antd";
import { SaveOutlined, BulbOutlined } from "@ant-design/icons"; // 新增 BulbOutlined 图标
import type { Message, TableContent } from "../../../types";
import CodeBlock from "./CodeBlock";
import TableBlock from "./TableBlock";
import ChartBlock from "./ChartBlock";

interface Props {
  message: Message;
  onSaveCard: () => void;
  onPerformAttribution: () => void; // 【新增】归因分析回调
}

const AnalysisResult: React.FC<Props> = ({
  message,
  onSaveCard,
  onPerformAttribution,
}) => {
  const tableContent = message.content.find(
    (block) => block.type === "table"
  ) as TableContent | undefined;

  const isSaveable = message.content.some(
    (block) => block.type === "chart" || block.type === "table"
  );

  return (
    <div>
      {message.content.map((block, index) => {
        switch (block.type) {
          case "text":
            return (
              <Typography.Paragraph key={index}>
                {block.text}
              </Typography.Paragraph>
            );
          case "sql":
            return <CodeBlock key={index} code={block.sql} />;
          case "table":
            return <TableBlock key={index} data={block.query_result} />;
          case "chart":
            if (tableContent) {
              return (
                <ChartBlock
                  key={index}
                  chartData={block.chart_recommendation}
                  tableData={tableContent.query_result}
                />
              );
            }
            return null;
          case "error":
            return (
              <Alert key={index} message={block.error} type="error" showIcon />
            );
          default:
            return null;
        }
      })}

      {isSaveable && (
        <>
          <Divider style={{ marginTop: "16px", marginBottom: "12px" }} />
          <Space>
            <Button
              type="link"
              icon={<SaveOutlined />}
              onClick={onSaveCard}
              style={{ padding: 0 }}
            >
              存为图卡
            </Button>
            {/* 【新增】归因分析按钮 */}
            <Button
              type="link"
              icon={<BulbOutlined />}
              onClick={onPerformAttribution}
              style={{ padding: 0, marginLeft: 16 }}
            >
              归因分析
            </Button>
          </Space>
        </>
      )}
    </div>
  );
};

export default AnalysisResult;
