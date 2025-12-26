import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface CandlestickData {
  time: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume?: number;
}

export interface ChartCandlestickLiveProps {
  data: CandlestickData[];
  title?: string;
  showVolume?: boolean;
}

/**
 * 实时K线图 (使用 Recharts)
 * 模拟股市波动，带有红绿闪烁和成交量柱
 * 适用场景：股票分析、价格走势、交易数据
 */
export const ChartCandlestickLive: React.FC<ChartCandlestickLiveProps> = ({
  data = [],
  title = "股票K线图",
  showVolume = true,
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
        ⚠️ 请提供K线数据
      </div>
    );
  }

  const visibleCount = Math.min(
    Math.floor(
      interpolate(frame, [0, 60], [1, data.length], {
        extrapolateRight: "clamp",
      })
    ),
    data.length
  );
  const visibleData = data.slice(0, visibleCount);

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 自定义 K 线渲染
  const CustomCandlestick = (props: any) => {
    const { x, y, width, height, payload, index } = props;
    const isRising = payload.close >= payload.open;
    const color = isRising ? "#10b981" : "#ef4444";

    const prices = [payload.open, payload.close, payload.high, payload.low];
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const highY = y + ((maxPrice - payload.high) / priceRange) * height;
    const lowY = y + ((maxPrice - payload.low) / priceRange) * height;
    const openY = y + ((maxPrice - payload.open) / priceRange) * height;
    const closeY = y + ((maxPrice - payload.close) / priceRange) * height;

    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.abs(closeY - openY) || 2;

    // 最新K线闪烁效果
    const flash =
      index === visibleCount - 1
        ? interpolate(frame % 20, [0, 10, 20], [1, 0.5, 1])
        : 1;

    return (
      <g opacity={flash}>
        {/* 上下影线 */}
        <line
          x={x + width / 2}
          y1={highY}
          x2={x + width / 2}
          y2={lowY}
          stroke={color}
          strokeWidth={2}
        />
        {/* K线实体 */}
        <rect
          x={x}
          y={bodyTop}
          width={width}
          height={bodyHeight}
          fill={color}
          stroke={color}
          strokeWidth={1}
        />
      </g>
    );
  };

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

      <div style={{ width: 1200, height: showVolume ? 700 : 550 }}>
        {/* K线图 */}
        <ResponsiveContainer width="100%" height={showVolume ? "70%" : "100%"}>
          <ComposedChart data={visibleData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.colors.surfaceLight}
              opacity={0.3}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: theme.colors.textSecondary, fontSize: 12 }}
              stroke={theme.colors.surfaceLight}
            />
            <YAxis
              domain={["dataMin", "dataMax"]}
              tick={{ fill: theme.colors.textSecondary, fontSize: 12 }}
              stroke={theme.colors.surfaceLight}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.surfaceLight}`,
                borderRadius: 8,
                fontFamily: theme.fonts.body,
              }}
              formatter={(value: any) => value.toFixed(2)}
            />
            <Bar
              dataKey="high"
              shape={<CustomCandlestick />}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* 成交量图 */}
        {showVolume && (
          <ResponsiveContainer width="100%" height="30%">
            <ComposedChart data={visibleData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.colors.surfaceLight}
                opacity={0.3}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: theme.colors.textSecondary, fontSize: 12 }}
                stroke={theme.colors.surfaceLight}
              />
              <YAxis
                tick={{ fill: theme.colors.textSecondary, fontSize: 12 }}
                stroke={theme.colors.surfaceLight}
              />
              <Bar dataKey="volume" isAnimationActive={false}>
                {visibleData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.close >= entry.open ? "#10b981" : "#ef4444"}
                    opacity={0.6}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div
        style={{
          marginTop: 20,
          fontSize: 18,
          color: theme.colors.textSecondary,
        }}
      >
        红涨绿跌，实时波动模拟
      </div>
    </div>
  );
};
