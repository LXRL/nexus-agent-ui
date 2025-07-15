// src/components/feature/AnalysisResult/index.tsx
import React from "react";
import { Message, MessageContentBlock, TableContent } from "../../../types";
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
