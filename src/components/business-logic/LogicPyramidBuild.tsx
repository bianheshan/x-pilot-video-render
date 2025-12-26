import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface PyramidLevel {
  label: string;
  description?: string;
  color?: string;
  value?: number;
}

export interface LogicPyramidBuildProps {
  /** 金字塔层级数据（从上到下） */
  levels: PyramidLevel[];
  /** 图表标题 */
  title?: string;
  /** 是否显示数值 */
  showValues?: boolean;
  /** 金字塔类型 */
  type?: "normal" | "inverted";
}

/**
 * 金字塔构建组件
 * 
 * 层级结构逐层构建，展示层次关系
 * 适用场景：需求层次、组织结构、知识体系
 * 
 * 教学要点：
 * - 层级关系的可视化
 * - 从基础到高级的递进
 * - 马斯洛需求理论等
 */
export const LogicPyramidBuild: React.FC<LogicPyramidBuildProps> = ({
  levels = [],
  title = "层级金字塔",
  showValues = true,
  type = "normal",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  if (levels.length === 0) {
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
        ⚠️ 请提供金字塔层级数据
      </div>
    );
  }

  // 进入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const pyramidWidth = 800;
  const pyramidHeight = 600;
  const levelHeight = pyramidHeight / levels.length;

  // 反转顺序（如果是倒金字塔）
  const displayLevels = type === "inverted" ? [...levels].reverse() : levels;

  const colors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.success,
    theme.colors.warning,
    theme.colors.error,
  ];

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

      {/* 金字塔 */}
      <svg width={pyramidWidth + 200} height={pyramidHeight + 100}>
        <g transform="translate(100, 50)">
          {displayLevels.map((level, index) => {
            // 计算层级宽度（从上到下递增，或从上到下递减）
            const widthRatio = type === "normal" 
              ? (index + 1) / displayLevels.length
              : (displayLevels.length - index) / displayLevels.length;
            
            const levelWidth = pyramidWidth * widthRatio;
            const x = (pyramidWidth - levelWidth) / 2;
            const y = index * levelHeight;

            // 层级颜色
            const color = level.color || colors[index % colors.length];

            // 弹性动画
            const scale = spring({
              frame: frame - index * 10,
              fps: 30,
              config: {
                damping: 15,
                mass: 0.5,
              },
            });

            // 高亮动画
            const glow = interpolate(
              (frame + index * 20) % 60,
              [0, 30, 60],
              [0, 0.3, 0],
              { extrapolateRight: "wrap" }
            );

            return (
              <g key={index} opacity={scale}>
                {/* 层级矩形 */}
                <rect
                  x={x}
                  y={y}
                  width={levelWidth}
                  height={levelHeight - 10}
                  fill={color}
                  stroke="white"
                  strokeWidth={3}
                  rx={8}
                  style={{
                    filter: `drop-shadow(0 4px 12px ${color}${Math.floor(glow * 255).toString(16).padStart(2, '0')})`,
                  }}
                />

                {/* 3D 效果 - 侧面 */}
                {type === "normal" && index < displayLevels.length - 1 && (
                  <path
                    d={`
                      M ${x + levelWidth} ${y + levelHeight - 10}
                      L ${x + levelWidth + 20} ${y + levelHeight}
                      L ${x + levelWidth + 20} ${y + levelHeight + levelHeight - 10}
                      L ${x + levelWidth} ${y + levelHeight + levelHeight - 20}
                      Z
                    `}
                    fill={color}
                    opacity={0.6}
                  />
                )}

                {/* 层级标签 */}
                <text
                  x={x + levelWidth / 2}
                  y={y + levelHeight / 2 - 10}
                  fill="white"
                  fontSize={24}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontFamily: theme.fonts.heading }}
                >
                  {level.label}
                </text>

                {/* 描述文字 */}
                {level.description && (
                  <text
                    x={x + levelWidth / 2}
                    y={y + levelHeight / 2 + 15}
                    fill="white"
                    fontSize={14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontFamily: theme.fonts.body }}
                    opacity={0.9}
                  >
                    {level.description}
                  </text>
                )}

                {/* 数值标签 */}
                {showValues && level.value !== undefined && (
                  <text
                    x={x + levelWidth + 40}
                    y={y + levelHeight / 2}
                    fill={theme.colors.text}
                    fontSize={20}
                    fontWeight="bold"
                    textAnchor="start"
                    dominantBaseline="middle"
                    style={{ fontFamily: theme.fonts.mono }}
                  >
                    {level.value}
                  </text>
                )}

                {/* 层级编号 */}
                <text
                  x={x - 30}
                  y={y + levelHeight / 2}
                  fill={theme.colors.textSecondary}
                  fontSize={18}
                  fontWeight="bold"
                  textAnchor="end"
                  dominantBaseline="middle"
                  style={{ fontFamily: theme.fonts.mono }}
                >
                  {type === "normal" ? displayLevels.length - index : index + 1}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* 说明 */}
      <div
        style={{
          marginTop: 30,
          fontSize: 18,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
      >
        {type === "normal" ? "从基础到高级的层级结构" : "倒金字塔结构"}
      </div>
    </div>
  );
};
