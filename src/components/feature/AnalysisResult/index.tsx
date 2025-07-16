// src/components/feature/AnalysisResult/index.tsx
import React from "react";
import type {
  Message,
  MessageContentBlock,
  TableContent,
} from "../../../types";
import CodeBlock from "./CodeBlock";
import TableBlock from "./TableBlock";
import ChartBlock from "./ChartBlock";
import { Alert, Typography } from "antd";

interface Props {
  message: Message;
}

const AnalysisResult: React.FC<Props> = ({ message }) => {
  // 某些组件(如图表)需要表格数据作为参考
  const tableContent = message.content.find(
    (block) => block.type === "table"
  ) as TableContent | undefined;

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
    </div>
  );
};

export default AnalysisResult;
// src/components/feature/AnalysisResult/index.tsx
import React from "react";
import { Alert, Button, Divider, Space, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import type { Message, TableContent } from "../../../types";
import CodeBlock from "./CodeBlock";
import TableBlock from "./TableBlock";
import ChartBlock from "./ChartBlock";

interface Props {
  message: Message;
  onSaveCard: () => void; // 新增一个回调函数用于触发保存动作
}

const AnalysisResult: React.FC<Props> = ({ message, onSaveCard }) => {
  const tableContent = message.content.find(
    (block) => block.type === "table"
  ) as TableContent | undefined;

  // 仅当消息中包含图表或表格时，才认为是可以保存的有效分析结果
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

      {/* 【新增】操作栏 */}
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
          </Space>
        </>
      )}
    </div>
  );
};

export default AnalysisResult;
