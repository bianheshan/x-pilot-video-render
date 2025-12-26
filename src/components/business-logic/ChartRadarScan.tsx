import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export interface RadarDataPoint {
  label: string;
  value: number;
  maxValue?: number;
}

export interface ChartRadarScanProps {
  /** 数据点数组 */
  data: RadarDataPoint[];
  /** 图表标题 */
  title?: string;
  /** 是否显示扫描线 */
  showScanLine?: boolean;
  /** 自定义颜色 */
  color?: string;
}

/**
 * 雷达扫描图 (使用 Recharts)
 * 
 * 雷达图带有旋转的扫描线，适合展示能力评估
 * 适用场景：技能评估、产品对比、性能分析
 * 
 * 教学要点：
 * - 多维度数据的对比展示
 * - 极坐标系统的应用
 * - 动态扫描效果的实现
 */
export const ChartRadarScan: React.FC<ChartRadarScanProps> = ({
  data = [],
  title = "能力雷达图",
  showScanLine = true,
  color,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 错误处理
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
        ⚠️ 请提供数据点数组 (data)
      </div>
    );
  }

  // 扫描线旋转
  const scanRotation = interpolate(frame, [0, 120], [0, 360], {
    extrapolateRight: "wrap",
  });

  // 数据进入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const radarColor = color || theme.colors.primary;

  // 转换数据格式为 Recharts 需要的格式
  const chartData = data.map((point) => ({
    subject: point.label,
    value: point.value,
    fullMark: point.maxValue || 100,
  }));

  const centerX = 500;
  const centerY = 400;
  const maxRadius = 250;

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
      {/* 标题 */}
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

      {/* 图表容器 */}
      <div style={{ position: "relative", width: 1000, height: 700 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke={theme.colors.surfaceLight} strokeOpacity={0.3} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: theme.colors.text,
                fontSize: 16,
                fontFamily: theme.fonts.body,
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, "dataMax"]}
              tick={{
                fill: theme.colors.textSecondary,
                fontSize: 12,
              }}
            />
            <Radar
              name="能力值"
              dataKey="value"
              stroke={radarColor}
              fill={radarColor}
              fillOpacity={0.5}
              strokeWidth={3}
              dot={{
                r: 6,
                fill: radarColor,
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* 扫描线效果 */}
        {showScanLine && (
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <defs>
              <radialGradient id="scanGradient">
                <stop offset="0%" stopColor={radarColor} stopOpacity="0.6" />
                <stop offset="100%" stopColor={radarColor} stopOpacity="0" />
              </radialGradient>
            </defs>
            <g
              style={{
                transform: `rotate(${scanRotation}deg)`,
                transformOrigin: `${centerX}px ${centerY}px`,
              }}
            >
              <line
                x1={centerX}
                y1={centerY}
                x2={centerX + maxRadius}
                y2={centerY}
                stroke={radarColor}
                strokeWidth={2}
                opacity={0.8}
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={maxRadius}
                fill="url(#scanGradient)"
                opacity={0.3}
              />
            </g>
          </svg>
        )}
      </div>

      {/* 说明 */}
      <div
        style={{
          marginTop: 20,
          fontSize: 18,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
      >
        扫描线持续旋转，展示多维度能力评估
      </div>
    </div>
  );
};
