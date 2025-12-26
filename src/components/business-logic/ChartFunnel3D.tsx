import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import { Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip } from "recharts";

export interface FunnelStage {
  name: string;
  value: number;
  color?: string;
}

export interface ChartFunnel3DProps {
  data: FunnelStage[];
  title?: string;
  showPercentage?: boolean;
}

/**
 * 3D 漏斗图 (使用 Recharts)
 * 立体漏斗，展示转化率流失，带有层级厚度
 * 适用场景：销售漏斗、用户转化、流程分析
 */
export const ChartFunnel3D: React.FC<ChartFunnel3DProps> = ({
  data = [],
  title = "转化漏斗",
  showPercentage = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  if (data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: theme.colors.error || "#ef4444",
          fontSize: 24,
          fontFamily: theme.fonts.body,
        }}
      >
        ⚠️ 请提供漏斗数据
      </div>
    );
  }

  const scale = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const colors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.success,
    theme.colors.warning,
  ];

  // 转换数据格式为 Recharts 需要的格式
  const chartData = data.map((stage, index) => ({
    name: stage.name,
    value: stage.value,
    fill: stage.color || colors[index % colors.length],
  }));

  // 计算百分比
  const maxValue = data[0]?.value || 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        fontFamily: theme.fonts.body,
        backgroundColor: theme.colors.background,
        opacity,
      }}
    >
      <h2
        style={{
          fontSize: 48,
          fontWeight: "bold",
          color: theme.colors.text,
          marginBottom: 40,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      <div style={{ width: 800, height: 600, transform: `scale(${scale})` }}>
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip
              contentStyle={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.surfaceLight}`,
                borderRadius: 8,
                fontFamily: theme.fonts.body,
              }}
            />
            <Funnel
              dataKey="value"
              data={chartData}
              isAnimationActive={false}
            >
              <LabelList
                position="center"
                fill="white"
                stroke="none"
                dataKey="name"
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  fontFamily: theme.fonts.body,
                }}
                content={(props: any) => {
                  const { x, y, width, height, value } = props;
                  const entry = chartData.find(d => d.name === value);
                  if (!entry) return null;
                  
                  const text = showPercentage
                    ? `${value}: ${entry.value.toLocaleString()} (${((entry.value / maxValue) * 100).toFixed(1)}%)`
                    : `${value}: ${entry.value.toLocaleString()}`;
                  
                  return (
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        fontFamily: theme.fonts.body,
                      }}
                    >
                      {text}
                    </text>
                  );
                }}
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: 20,
          fontSize: 18,
          color: theme.colors.textSecondary,
        }}
      >
        漏斗展示转化流失情况
      </div>
    </div>
  );
};
