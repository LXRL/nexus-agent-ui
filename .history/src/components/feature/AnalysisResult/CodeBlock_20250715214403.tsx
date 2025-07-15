// src/components/feature/AnalysisResult/CodeBlock.tsx
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card } from "antd";

interface Props {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<Props> = ({ code, language = "sql" }) => {
  return (
    <Card size="small" style={{ marginTop: 12 }}>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, padding: "12px", borderRadius: "6px" }}
      >
        {code}
      </SyntaxHighlighter>
    </Card>
  );
};

export default CodeBlock;
