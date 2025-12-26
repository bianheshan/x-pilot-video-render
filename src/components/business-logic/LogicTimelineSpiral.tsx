import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TimelineEvent {
  year: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface LogicTimelineSpiralProps {
  events: TimelineEvent[];
  title?: string;
}

/**
 * 螺旋时间线
 * 以螺旋形式展示历史事件
 */
export const LogicTimelineSpiral: React.FC<LogicTimelineSpiralProps> = ({
  events = [],
  title = "历史时间线",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40, backgroundColor: theme.colors.background, opacity }}>
      <h2 style={{ fontSize: 48, fontWeight: "bold", color: theme.colors.text, marginBottom: 40 }}>{title}</h2>
      <svg width={1000} height={700}>
        <g transform="translate(500, 350)">
          {/* 螺旋线 */}
          <path d={events.map((_, i) => {
            const angle = (i / events.length) * Math.PI * 4;
            const radius = 50 + i * 30;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')} fill="none" stroke={theme.colors.primary} strokeWidth={3} opacity={0.3} />
          {/* 事件点 */}
          {events.map((event, i) => {
            const angle = (i / events.length) * Math.PI * 4;
            const radius = 50 + i * 30;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const scale = interpolate(frame, [i * 5, i * 5 + 20], [0, 1], { extrapolateRight: "clamp" });
            return (
              <g key={i} transform={`translate(${x}, ${y}) scale(${scale})`}>
                <circle r={20} fill={theme.colors.secondary} stroke="white" strokeWidth={2} />
                <text y={-30} fill={theme.colors.text} fontSize={14} fontWeight="bold" textAnchor="middle">{event.year}</text>
                <text y={40} fill={theme.colors.text} fontSize={12} textAnchor="middle">{event.title}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
