import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface GanttTask {
  id: string;
  name: string;
  start: number; // 开始时间（天数或百分比）
  duration: number; // 持续时间
  progress?: number; // 完成进度 0-1
  color?: string;
  dependencies?: string[]; // 依赖的任务 ID
}

export interface LogicGanttTimelineProps {
  /** 任务列表 */
  tasks: GanttTask[];
  /** 图表标题 */
  title?: string;
  /** 时间单位 */
  timeUnit?: string;
  /** 总时长 */
  totalDuration?: number;
  /** 是否显示进度 */
  showProgress?: boolean;
}

/**
 * 甘特图时间线组件
 * 
 * 展示项目任务的时间安排和依赖关系
 * 适用场景：项目管理、任务规划、时间安排
 * 
 * 教学要点：
 * - 时间线可视化
 * - 任务依赖关系
 * - 项目进度管理
 */
export const LogicGanttTimeline: React.FC<LogicGanttTimelineProps> = ({
  tasks = [],
  title = "项目甘特图",
  timeUnit = "天",
  totalDuration = 100,
  showProgress = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  if (tasks.length === 0) {
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
        ⚠️ 请提供任务数据
      </div>
    );
  }

  // 进入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const chartWidth = 1000;
  const chartHeight = Math.max(tasks.length * 60 + 100, 400);
  const taskHeight = 40;
  const taskGap = 20;
  const leftMargin = 200;
  const timelineWidth = chartWidth - leftMargin - 100;

  // 当前时间指示器
  const currentTime = interpolate(frame, [0, 120], [0, totalDuration], {
    extrapolateRight: "clamp",
  });

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

      {/* 甘特图 */}
      <svg width={chartWidth + 100} height={chartHeight}>
        {/* 时间轴刻度 */}
        <g transform={`translate(${leftMargin}, 30)`}>
          {Array.from({ length: 11 }, (_, i) => {
            const time = (totalDuration / 10) * i;
            const x = (timelineWidth / 10) * i;

            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={chartHeight - 60}
                  stroke={theme.colors.surfaceLight}
                  strokeWidth={1}
                  opacity={0.3}
                  strokeDasharray="4 4"
                />
                <text
                  x={x}
                  y={-10}
                  fill={theme.colors.textSecondary}
                  fontSize={12}
                  textAnchor="middle"
                  style={{ fontFamily: theme.fonts.mono }}
                >
                  {Math.round(time)}{timeUnit}
                </text>
              </g>
            );
          })}
        </g>

        {/* 任务条 */}
        <g transform={`translate(${leftMargin}, 60)`}>
          {tasks.map((task, index) => {
            const y = index * (taskHeight + taskGap);
            const barX = (task.start / totalDuration) * timelineWidth;
            const barWidth = (task.duration / totalDuration) * timelineWidth;
            const color = task.color || colors[index % colors.length];

            // 任务条出现动画
            const taskScale = interpolate(
              frame,
              [index * 5, index * 5 + 20],
              [0, 1],
              { extrapolateRight: "clamp" }
            );

            // 进度动画
            const progressWidth = showProgress && task.progress
              ? barWidth * task.progress
              : barWidth;

            return (
              <g key={task.id} opacity={taskScale}>
                {/* 任务名称 */}
                <text
                  x={-10}
                  y={y + taskHeight / 2}
                  fill={theme.colors.text}
                  fontSize={16}
                  textAnchor="end"
                  dominantBaseline="middle"
                  style={{ fontFamily: theme.fonts.body }}
                >
                  {task.name}
                </text>

                {/* 任务背景条 */}
                <rect
                  x={barX}
                  y={y}
                  width={barWidth}
                  height={taskHeight}
                  fill={`${color}30`}
                  stroke={color}
                  strokeWidth={2}
                  rx={8}
                />

                {/* 任务进度条 */}
                {showProgress && (
                  <rect
                    x={barX}
                    y={y}
                    width={progressWidth}
                    height={taskHeight}
                    fill={color}
                    rx={8}
                    style={{
                      filter: `drop-shadow(0 2px 8px ${color}60)`,
                    }}
                  />
                )}

                {/* 进度百分比 */}
                {showProgress && task.progress !== undefined && (
                  <text
                    x={barX + barWidth / 2}
                    y={y + taskHeight / 2}
                    fill="white"
                    fontSize={14}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontFamily: theme.fonts.mono }}
                  >
                    {Math.round(task.progress * 100)}%
                  </text>
                )}

                {/* 任务时长标签 */}
                <text
                  x={barX + barWidth + 10}
                  y={y + taskHeight / 2}
                  fill={theme.colors.textSecondary}
                  fontSize={12}
                  textAnchor="start"
                  dominantBaseline="middle"
                  style={{ fontFamily: theme.fonts.mono }}
                >
                  {task.duration}{timeUnit}
                </text>

                {/* 依赖关系箭头 */}
                {task.dependencies?.map((depId) => {
                  const depTask = tasks.find((t) => t.id === depId);
                  if (!depTask) return null;

                  const depIndex = tasks.indexOf(depTask);
                  const depY = depIndex * (taskHeight + taskGap);
                  const depEndX =
                    (depTask.start + depTask.duration) / totalDuration * timelineWidth;

                  return (
                    <g key={`dep-${depId}`}>
                      <path
                        d={`M ${depEndX} ${depY + taskHeight / 2} 
                           L ${depEndX + 20} ${depY + taskHeight / 2}
                           L ${depEndX + 20} ${y + taskHeight / 2}
                           L ${barX} ${y + taskHeight / 2}`}
                        fill="none"
                        stroke={theme.colors.textSecondary}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        opacity={0.5}
                        markerEnd="url(#arrowhead)"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* 当前时间指示器 */}
        <g transform={`translate(${leftMargin}, 30)`}>
          <line
            x1={(currentTime / totalDuration) * timelineWidth}
            y1={0}
            x2={(currentTime / totalDuration) * timelineWidth}
            y2={chartHeight - 60}
            stroke={theme.colors.error}
            strokeWidth={3}
            opacity={0.8}
          />
          <circle
            cx={(currentTime / totalDuration) * timelineWidth}
            cy={-20}
            r={6}
            fill={theme.colors.error}
          />
        </g>

        {/* 箭头标记定义 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill={theme.colors.textSecondary}
              opacity={0.5}
            />
          </marker>
        </defs>
      </svg>

      {/* 说明 */}
      <div
        style={{
          marginTop: 20,
          fontSize: 18,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
      >
        甘特图展示任务时间安排和依赖关系
      </div>
    </div>
  );
};
