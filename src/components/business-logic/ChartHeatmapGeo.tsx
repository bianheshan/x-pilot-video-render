import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import * as d3 from "d3";

export interface GeoDataPoint {
  x: number;
  y: number;
  value: number;
  label?: string;
}

export interface ChartHeatmapGeoProps {
  data: GeoDataPoint[];
  title?: string;
  width?: number;
  height?: number;
}

/**
 * 地理热力图 (使用 D3.js 颜色插值)
 * 地图上的热力分布，颜色随数值动态呼吸
 * 适用场景：地理数据分布、热点区域分析、密度可视化
 */
export const ChartHeatmapGeo: React.FC<ChartHeatmapGeoProps> = ({
  data = [],
  title = "热力分布图",
  width = 1000,
  height = 600,
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
        ⚠️ 请提供地理数据点
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const breathe = interpolate(frame % 60, [0, 30, 60], [0.7, 1, 0.7]);

  // 使用 D3 颜色比例尺
  const colorScale = d3
    .scaleSequential(d3.interpolateYlOrRd)
    .domain([0, maxValue]);

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

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

      <svg width={width} height={height}>
        <defs>
          {data.map((point, i) => {
            const color = colorScale(point.value);
            return (
              <radialGradient key={i} id={`heat-${i}`}>
                <stop
                  offset="0%"
                  stopColor={color}
                  stopOpacity={0.8 * breathe}
                />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </radialGradient>
            );
          })}
        </defs>

        {/* 背景网格 */}
        <rect
          width={width}
          height={height}
          fill={theme.colors.surface}
          opacity={0.1}
        />
        {Array.from({ length: 20 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={(i * height) / 20}
            x2={width}
            y2={(i * height) / 20}
            stroke={theme.colors.surfaceLight}
            strokeWidth={1}
            opacity={0.2}
          />
        ))}
        {Array.from({ length: 20 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={(i * width) / 20}
            y1={0}
            x2={(i * width) / 20}
            y2={height}
            stroke={theme.colors.surfaceLight}
            strokeWidth={1}
            opacity={0.2}
          />
        ))}

        {/* 热力点 */}
        {data.map((point, index) => {
          const radius = (point.value / maxValue) * 100 + 30;
          const color = colorScale(point.value);

          return (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={radius}
                fill={`url(#heat-${index})`}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r={8}
                fill={color}
                stroke="white"
                strokeWidth={2}
              />
              {point.label && (
                <>
                  <text
                    x={point.x}
                    y={point.y - radius - 10}
                    fill={theme.colors.text}
                    fontSize={14}
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {point.label}
                  </text>
                  <text
                    x={point.x}
                    y={point.y - radius - 28}
                    fill={theme.colors.textSecondary}
                    fontSize={12}
                    textAnchor="middle"
                    style={{ fontFamily: theme.fonts.mono }}
                  >
                    {point.value.toLocaleString()}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <div
        style={{
          marginTop: 20,
          fontSize: 18,
          color: theme.colors.textSecondary,
        }}
      >
        热力颜色动态呼吸，展示数据分布
      </div>
    </div>
  );
};
