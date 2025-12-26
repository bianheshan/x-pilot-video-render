import React from "react";
import { useCurrentFrame, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface GaugeData {
  label: string;
  value: number;
  maxValue?: number;
  unit?: string;
  color?: string;
}

export interface ChartGaugeDashboardProps {
  data: GaugeData[];
  title?: string;
}

/**
 * 仪表盘集群
 * 多个仪表盘协同工作，指针动态摆动
 */
export const ChartGaugeDashboard: React.FC<ChartGaugeDashboardProps> = ({
  data = [],
  title = "仪表盘监控",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  if (data.length === 0) {
    return <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: theme.colors.error || "#ef4444", fontSize: 24 }}>⚠️ 请提供仪表数据</div>;
  }

  const renderGauge = (gauge: GaugeData, index: number) => {
    const maxVal = gauge.maxValue || 100;
    const ratio = Math.min(gauge.value / maxVal, 1);
    const angle = spring({ frame, fps: 30, from: -90, to: -90 + ratio * 180, config: { damping: 15 } });
    const color = gauge.color || [theme.colors.success, theme.colors.warning, theme.colors.error][Math.floor(ratio * 3)] || theme.colors.primary;

    return (
      <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: 20 }}>
        <svg width={200} height={150}>
          <defs>
            <linearGradient id={`gauge-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.colors.success} />
              <stop offset="50%" stopColor={theme.colors.warning} />
              <stop offset="100%" stopColor={theme.colors.error} />
            </linearGradient>
          </defs>
          
          {/* 背景弧 */}
          <path d="M 30 120 A 70 70 0 0 1 170 120" fill="none" stroke={theme.colors.surfaceLight} strokeWidth={15} strokeLinecap="round" />
          
          {/* 进度弧 */}
          <path d="M 30 120 A 70 70 0 0 1 170 120" fill="none" stroke={`url(#gauge-grad-${index})`} strokeWidth={15} strokeLinecap="round" strokeDasharray={`${ratio * 220} 220`} />
          
          {/* 指针 */}
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "100px 120px" }}>
            <line x1={100} y1={120} x2={100} y2={60} stroke={color} strokeWidth={3} strokeLinecap="round" />
            <circle cx={100} cy={120} r={8} fill={color} />
          </g>
          
          {/* 中心值 */}
          <text x={100} y={135} fill={theme.colors.text} fontSize={24} fontWeight="bold" textAnchor="middle" style={{ fontFamily: theme.fonts.mono }}>
            {gauge.value}
          </text>
          {gauge.unit && (
            <text x={100} y={150} fill={theme.colors.textSecondary} fontSize={14} textAnchor="middle" style={{ fontFamily: theme.fonts.body }}>
              {gauge.unit}
            </text>
          )}
        </svg>
        
        <div style={{ fontSize: 18, color: theme.colors.text, fontWeight: "bold", marginTop: 10 }}>{gauge.label}</div>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40, fontFamily: theme.fonts.body, backgroundColor: theme.colors.background }}>
      <h2 style={{ fontSize: 48, fontWeight: "bold", color: theme.colors.text, marginBottom: 40, fontFamily: theme.fonts.heading }}>{title}</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(data.length, 3)}, 1fr)`, gap: 20 }}>
        {data.map((gauge, index) => renderGauge(gauge, index))}
      </div>

      <div style={{ marginTop: 30, fontSize: 18, color: theme.colors.textSecondary }}>实时监控多项指标</div>
    </div>
  );
};
