import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface FlowStep {
  id: string;
  label: string;
  type?: "start" | "process" | "decision" | "end";
  next?: string[];
}

export interface LogicFlowPathProps {
  steps: FlowStep[];
  title?: string;
}

/**
 * 流程路径图
 * 展示业务流程和决策路径
 */
export const LogicFlowPath: React.FC<LogicFlowPathProps> = ({
  steps = [],
  title = "流程图",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40, backgroundColor: theme.colors.background, opacity }}>
      <h2 style={{ fontSize: 48, fontWeight: "bold", color: theme.colors.text, marginBottom: 40 }}>{title}</h2>
      <svg width={1200} height={700}>
        <g transform="translate(100, 100)">
          {steps.map((step, i) => {
            const x = (i % 3) * 350;
            const y = Math.floor(i / 3) * 150;
            const scale = interpolate(frame, [i * 5, i * 5 + 20], [0, 1], { extrapolateRight: "clamp" });
            const color = step.type === "start" ? theme.colors.success : step.type === "end" ? theme.colors.error : step.type === "decision" ? theme.colors.warning : theme.colors.primary;
            return (
              <g key={i} transform={`translate(${x}, ${y}) scale(${scale})`}>
                {step.type === "decision" ? (
                  <path d="M 0,-40 L 60,0 L 0,40 L -60,0 Z" fill={color} stroke="white" strokeWidth={2} />
                ) : (
                  <rect x={-60} y={-30} width={120} height={60} fill={color} stroke="white" strokeWidth={2} rx={step.type === "start" || step.type === "end" ? 30 : 8} />
                )}
                <text fill="white" fontSize={14} fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{step.label}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
