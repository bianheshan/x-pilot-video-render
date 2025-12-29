import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface BarRaceItem {
  name: string;
  value: number;
  color?: string;
}

export interface ChartBarRaceProps {
  /** 数据数组，可以是多快照二维数组，或是一维的时间序列 */
  data: BarRaceItem[][] | BarRaceItem[];
  /** 图表标题 */
  title?: string;
  /** 显示的条形数量 */
  topN?: number;
  /** @deprecated Use snapshotDurationInFrames instead. */
  framesPerSnapshot?: number;
  /** 每个快照的持续帧数 */
  snapshotDurationInFrames?: number;
  /** 是否显示数值 */
  showValue?: boolean;
  /** 自定义颜色 */
  color?: string;
  /** 图表宽度（px）。默认根据视频宽度推导。 */
  chartWidth?: number;
  barHeight?: number;
  barGap?: number;
  nameColumnWidth?: number;
  rankColumnWidth?: number;
}

/**
 * 动态条形竞赛图（帧驱动、可组合）
 * - 排名/位置由 frame 计算（不依赖 CSS transition 时间驱动）
 * - 支持快照数据插值，适合教学“排序/比较/时间序列”讲解
 */
export const ChartBarRace: React.FC<ChartBarRaceProps> = ({
  data = [],
  title = "排名变化",
  topN = 10,
  framesPerSnapshot,
  snapshotDurationInFrames,
  showValue = true,
  color,
  chartWidth,
  barHeight = 50,
  barGap = 10,
  nameColumnWidth = 140,
  rankColumnWidth = 60,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const { width: videoW } = useVideoConfig();

  const safeFramesPerSnapshot = Math.max(
    1,
    Math.floor(snapshotDurationInFrames ?? framesPerSnapshot ?? 60)
  );

  const normalizeSnapshot = (snapshot?: BarRaceItem[] | null): BarRaceItem[] =>
    Array.isArray(snapshot) ? snapshot.filter(Boolean) : [];

  const normalizedSnapshots: BarRaceItem[][] =
    data.length === 0
      ? []
      : Array.isArray(data[0])
        ? (data as (BarRaceItem[] | null | undefined)[]).map((snapshot) => normalizeSnapshot(snapshot))
        : (data as (BarRaceItem | null | undefined)[])
            .filter((item): item is BarRaceItem => Boolean(item))
            .map((item) => [item]);

  if (normalizedSnapshots.length === 0) {
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
          backgroundColor: theme.colors.background,
        }}
      >
        数据为空，请提供有效的数据数组
      </div>
    );
  }

  const lastSnapshotIndex = normalizedSnapshots.length - 1;

  const currentSnapshotIndex = Math.min(
    Math.floor(frame / safeFramesPerSnapshot),
    lastSnapshotIndex
  );
  const nextSnapshotIndex = Math.min(currentSnapshotIndex + 1, lastSnapshotIndex);

  const progress = (frame % safeFramesPerSnapshot) / safeFramesPerSnapshot;

  const currentSnapshot = normalizedSnapshots[currentSnapshotIndex];
  const nextSnapshot = normalizedSnapshots[nextSnapshotIndex] ?? currentSnapshot;

  const sortedCurrent = [...currentSnapshot].sort((a, b) => b.value - a.value).slice(0, topN);
  const sortedNext = [...nextSnapshot].sort((a, b) => b.value - a.value).slice(0, topN);

  const maxValue = Math.max(
    ...sortedCurrent.map((item) => item.value),
    ...sortedNext.map((item) => item.value),
    1
  );

  const interpolatedData = sortedCurrent.map((currentItem, currentIndex) => {
    const nextIndex = sortedNext.findIndex((item) => item.name === currentItem.name);
    const nextItem = nextIndex >= 0 ? sortedNext[nextIndex] : currentItem;

    const targetIndex = nextIndex >= 0 ? nextIndex : sortedNext.length;

    const interpolatedIndex = interpolate(progress, [0, 1], [currentIndex, targetIndex], {
      extrapolateRight: "clamp",
    });

    const interpolatedValue = interpolate(progress, [0, 1], [currentItem.value, nextItem.value], {
      extrapolateRight: "clamp",
    });

    return {
      name: currentItem.name,
      value: interpolatedValue,
      index: interpolatedIndex,
      color: currentItem.color || color || theme.colors.primary,
    };
  });

  sortedNext.forEach((nextItem, nextIndex) => {
    if (!interpolatedData.find((item) => item.name === nextItem.name)) {
      const interpolatedValue = interpolate(progress, [0, 1], [0, nextItem.value], {
        extrapolateRight: "clamp",
      });

      interpolatedData.push({
        name: nextItem.name,
        value: interpolatedValue,
        index: nextIndex,
        color: nextItem.color || color || theme.colors.secondary,
      });
    }
  });

  const resolvedChartWidth =
    chartWidth ?? Math.min(1000, Math.max(760, Math.floor(videoW - 280)));

  const chartHeight = (barHeight + barGap) * topN;
  const barMaxWidth = Math.max(100, resolvedChartWidth - rankColumnWidth - nameColumnWidth - 20);

  const visible = interpolatedData
    .filter((d) => d.index < topN + 0.5)
    .sort((a, b) => a.index - b.index)
    .slice(0, topN);

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
      }}
    >
      <h2
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: theme.colors.text,
          marginBottom: 40,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      <div style={{ position: "relative", width: resolvedChartWidth, height: chartHeight }}>
        {visible.map((item, rankIdx) => {
          const barWidth = (item.value / maxValue) * barMaxWidth;
          const yPosition = item.index * (barHeight + barGap);

          return (
            <div
              key={item.name}
              style={{
                position: "absolute",
                left: 0,
                top: yPosition,
                width: "100%",
                height: barHeight,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: rankColumnWidth,
                  fontSize: 30,
                  fontWeight: 800,
                  color: theme.colors.textSecondary,
                  textAlign: "right",
                  marginRight: 14,
                }}
              >
                {rankIdx + 1}
              </div>

              <div
                style={{
                  width: nameColumnWidth,
                  fontSize: 20,
                  color: theme.colors.text,
                  marginRight: 14,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.name}
              </div>

              <div
                style={{
                  width: barWidth,
                  height: "100%",
                  backgroundColor: item.color,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 15,
                  boxShadow: `0 4px 12px ${item.color}40`,
                }}
              >
                {showValue && (
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "white",
                    }}
                  >
                    {Math.round(item.value).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 40,
          fontSize: 28,
          fontWeight: 800,
          color: theme.colors.primary,
        }}
      >
        快照 {currentSnapshotIndex + 1} / {normalizedSnapshots.length}
      </div>
    </div>
  );
};
