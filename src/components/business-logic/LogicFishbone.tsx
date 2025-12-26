import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface FishboneCause {
  category: string;
  causes: string[];
  color?: string;
}

export interface LogicFishboneProps {
  problem: string;
  causes: FishboneCause[];
  title?: string;
}

/**
 * 鱼骨图（石川图）
 * 展示问题的因果关系分析
 */
export const LogicFishbone: React.FC<LogicFishboneProps> = ({
  problem,
  causes = [],
  title = "鱼骨图分析",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const mainLineProgress = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40, backgroundColor: theme.colors.background, opacity }}>
      <h2 style={{ fontSize: 48, fontWeight: "bold", color: theme.colors.text, marginBottom: 40 }}>{title}</h2>
      <svg width={1200} height={700}>
        <g transform="translate(100, 350)">
          {/* 主干线 */}
          <line x1={0} y1={0} x2={1000 * mainLineProgress} y2={0} stroke={theme.colors.primary} strokeWidth={4} />
          {/* 问题头部 */}
          <g transform={`translate(${1000 * mainLineProgress}, 0)`}>
            <circle r={60} fill={theme.colors.error} opacity={0.2} />
            <text fill={theme.colors.text} fontSize={18} fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{problem}</text>
          </g>
          {/* 原因分支 */}
          {causes.map((cause, i) => {
            const isTop = i % 2 === 0;
            const x = 200 + i * 150;
            const y = isTop ? -150 : 150;
            const branchProgress = interpolate(frame, [40 + i * 5, 60 + i * 5], [0, 1], { extrapolateRight: "clamp" });
            return (
              <g key={i}>
                <line x1={x} y1={0} x2={x + 100 * branchProgress} y2={y * branchProgress} stroke={cause.color || theme.colors.secondary} strokeWidth={3} />
                <text x={x + 110} y={y} fill={theme.colors.text} fontSize={16} fontWeight="bold" textAnchor={isTop ? "start" : "start"}>{cause.category}</text>
                {cause.causes.map((c, j) => (
                  <text key={j} x={x + 110} y={y + (isTop ? 25 : -25) * (j + 1)} fill={theme.colors.textSecondary} fontSize={12}>{c}</text>
                ))}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
