// src/components/feature/AnalysisResult/ChartBlock.tsx
import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";
import { ChartContent, TableContent } from "../../../types";

interface Props {
  chartData: ChartContent["chart_recommendation"];
  tableData: TableContent["query_result"];
}

const ChartBlock: React.FC<Props> = ({ chartData, tableData }) => {
  const { chart_type, x_axis_field, y_axis_fields } = chartData;

  const getOption = () => {
    const xIndex = tableData.columns.findIndex((c) => c.name === x_axis_field);
    const yIndices = y_axis_fields.map((yField) =>
      tableData.columns.findIndex((c) => c.name === yField)
    );

    if (xIndex === -1 || yIndices.includes(-1)) return {};

    const source = [tableData.columns.map((c) => c.name), ...tableData.rows];

    return {
      legend: {},
      tooltip: {},
      dataset: {
        source,
      },
      xAxis: { type: "category" },
      yAxis: {},
      series: y_axis_fields.map(() => ({ type: chart_type, smooth: true })),
    };
  };

  return (
    <Card size="small" title="推荐图表" style={{ marginTop: 12 }}>
      <p>{chartData.description}</p>
      <ReactECharts option={getOption()} style={{ height: 300 }} />
    </Card>
  );
};

export default ChartBlock;
