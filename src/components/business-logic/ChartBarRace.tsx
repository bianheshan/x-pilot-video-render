import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface BarRaceItem {
  name: string;
  value: number;
  color?: string;
}

export interface ChartBarRaceProps {
  /** 数据数组，每个元素代表一个时间点的数据快照 */
  data: BarRaceItem[][];
  /** 图表标题 */
  title?: string;
  /** 显示的条形数量 */
  topN?: number;
  /** 每个数据快照的持续帧数 */
  framesPerSnapshot?: number;
  /** 是否显示数值 */
  showValue?: boolean;
  /** 自定义颜色 */
  color?: string;
}

/**
 * 动态条形竞赛图
 * 
 * 展示排名随时间的变化，条形自动排序上下移动
 * 适用场景：销售排名、国家GDP对比、品牌价值变化等
 * 
 * 教学要点：
 * - 动态排序算法的可视化
 * - 时间序列数据的对比展示
 * - 平滑过渡动画的实现
 */
export const ChartBarRace: React.FC<ChartBarRaceProps> = ({
  data = [],
  title = "排名变化",
  topN = 10,
  framesPerSnapshot = 60,
  showValue = true,
  color,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 错误处理：数据验证
  if (!data || data.length === 0) {
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
        ⚠️ 数据为空，请提供有效的数据数组
      </div>
    );
  }

  // 计算当前应该显示哪个数据快照
  const currentSnapshotIndex = Math.min(
    Math.floor(frame / framesPerSnapshot),
    data.length - 1
  );
  const nextSnapshotIndex = Math.min(currentSnapshotIndex + 1, data.length - 1);

  // 计算当前快照内的进度 (0-1)
  const progress = (frame % framesPerSnapshot) / framesPerSnapshot;

  // 获取当前和下一个快照的数据
  const currentSnapshot = data[currentSnapshotIndex] || [];
  const nextSnapshot = data[nextSnapshotIndex] || currentSnapshot;

  // 对数据进行排序（降序）
  const sortedCurrent = [...currentSnapshot]
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
  const sortedNext = [...nextSnapshot]
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);

  // 找到最大值用于归一化
  const maxValue = Math.max(
    ...sortedCurrent.map((item) => item.value),
    ...sortedNext.map((item) => item.value),
    1 // 避免除以0
  );

  // 为每个条目创建插值数据
  const interpolatedData = sortedCurrent.map((currentItem, currentIndex) => {
    // 在下一个快照中找到相同名称的项
    const nextIndex = sortedNext.findIndex((item) => item.name === currentItem.name);
    const nextItem = nextIndex >= 0 ? sortedNext[nextIndex] : currentItem;

    // 插值位置（排名）
    const targetIndex = nextIndex >= 0 ? nextIndex : sortedNext.length;
    const interpolatedIndex = interpolate(
      progress,
      [0, 1],
      [currentIndex, targetIndex],
      { extrapolateRight: "clamp" }
    );

    // 插值数值
    const interpolatedValue = interpolate(
      progress,
      [0, 1],
      [currentItem.value, nextItem.value],
      { extrapolateRight: "clamp" }
    );

    return {
      name: currentItem.name,
      value: interpolatedValue,
      index: interpolatedIndex,
      color: currentItem.color || color || theme.colors.primary,
    };
  });

  // 添加新出现的项目
  sortedNext.forEach((nextItem, nextIndex) => {
    if (!interpolatedData.find((item) => item.name === nextItem.name)) {
      const interpolatedValue = interpolate(
        progress,
        [0, 1],
        [0, nextItem.value],
        { extrapolateRight: "clamp" }
      );

      interpolatedData.push({
        name: nextItem.name,
        value: interpolatedValue,
        index: nextIndex,
        color: nextItem.color || color || theme.colors.secondary,
      });
    }
  });

  // 按插值后的索引排序
  interpolatedData.sort((a, b) => a.index - b.index);

  const barHeight = 50;
  const barGap = 10;
  const chartWidth = 800;
  const chartHeight = (barHeight + barGap) * topN;

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
      <div
        style={{
          position: "relative",
          width: chartWidth,
          height: chartHeight,
        }}
      >
        {interpolatedData.slice(0, topN).map((item, index) => {
          const barWidth = (item.value / maxValue) * (chartWidth - 200);
          const yPosition = index * (barHeight + barGap);

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
                transition: "top 0.3s ease-out",
              }}
            >
              {/* 排名 */}
              <div
                style={{
                  width: 50,
                  fontSize: 32,
                  fontWeight: "bold",
                  color: theme.colors.textSecondary,
                  textAlign: "right",
                  marginRight: 15,
                }}
              >
                {index + 1}
              </div>

              {/* 名称 */}
              <div
                style={{
                  width: 120,
                  fontSize: 20,
                  color: theme.colors.text,
                  marginRight: 15,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.name}
              </div>

              {/* 条形 */}
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
                  transition: "width 0.3s ease-out",
                }}
              >
                {showValue && (
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
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

      {/* 时间指示器 */}
      <div
        style={{
          marginTop: 40,
          fontSize: 32,
          fontWeight: "bold",
          color: theme.colors.primary,
        }}
      >
        快照 {currentSnapshotIndex + 1} / {data.length}
      </div>
    </div>
  );
};
