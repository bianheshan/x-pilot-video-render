import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface VennSet {
  label: string;
  color?: string;
}

export interface LogicVennDynamicProps {
  sets: VennSet[];
  title?: string;
  showIntersection?: boolean;
}

/**
 * 动态韦恩图
 * 圆圈动态融合、分离，展示集合关系
 */
export const LogicVennDynamic: React.FC<LogicVennDynamicProps> = ({
  sets = [],
  title = "集合关系图",
  showIntersection = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  if (sets.length === 0) {
    return <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: theme.colors.error || "#ef4444", fontSize: 24 }}>⚠️ 请提供集合数据</div>;
  }

  const centerX = 500;
  const centerY = 400;
  const radius = 150;
  
  // 动态融合效果
  const overlap = interpolate(frame % 120, [0, 60, 120], [0, 80, 0]);

  const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.success];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40, fontFamily: theme.fonts.body, backgroundColor: theme.colors.background }}>
      <h2 style={{ fontSize: 48, fontWeight: "bold", color: theme.colors.text, marginBottom: 40, fontFamily: theme.fonts.heading }}>{title}</h2>
      
      <svg width={1000} height={800}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {sets.length === 2 && (
          <>
            <circle cx={centerX - overlap / 2} cy={centerY} r={radius} fill={colors[0] || sets[0].color} opacity={0.5} filter="url(#glow)" style={{ mixBlendMode: "multiply" }} />
            <circle cx={centerX + overlap / 2} cy={centerY} r={radius} fill={colors[1] || sets[1].color} opacity={0.5} filter="url(#glow)" style={{ mixBlendMode: "multiply" }} />
            
            <text x={centerX - overlap / 2 - 80} y={centerY} fill={theme.colors.text} fontSize={24} fontWeight="bold" textAnchor="middle" style={{ fontFamily: theme.fonts.body }}>{sets[0].label}</text>
            <text x={centerX + overlap / 2 + 80} y={centerY} fill={theme.colors.text} fontSize={24} fontWeight="bold" textAnchor="middle" style={{ fontFamily: theme.fonts.body }}>{sets[1].label}</text>
            
            {showIntersection && overlap > 20 && (
              <text x={centerX} y={centerY} fill={theme.colors.text} fontSize={20} fontWeight="bold" textAnchor="middle" style={{ fontFamily: theme.fonts.body }}>交集</text>
            )}
          </>
        )}

        {sets.length === 3 && (
          <>
            <circle cx={centerX} cy={centerY - overlap} r={radius} fill={colors[0] || sets[0].color} opacity={0.5} filter="url(#glow)" style={{ mixBlendMode: "multiply" }} />
            <circle cx={centerX - overlap} cy={centerY + 60} r={radius} fill={colors[1] || sets[1].color} opacity={0.5} filter="url(#glow)" style={{ mixBlendMode: "multiply" }} />
            <circle cx={centerX + overlap} cy={centerY + 60} r={radius} fill={colors[2] || sets[2].color} opacity={0.5} filter="url(#glow)" style={{ mixBlendMode: "multiply" }} />
            
            <text x={centerX} y={centerY - overlap - 180} fill={theme.colors.text} fontSize={24} fontWeight="bold" textAnchor="middle" style={{ fontFamily: theme.fonts.body }}>{sets[0].label}</text>
            <text x={centerX - overlap - 150} y={centerY + 200} fill={theme.colors.text} fontSize={24} fontWeight="bold" textAnchor="middle" style={{ fontFamily: theme.fonts.body }}>{sets[1].label}</text>
            <text x={centerX + overlap + 150} y={centerY + 200} fill={theme.colors.text} fontSize={24} fontWeight="bold" textAnchor="middle" style={{ fontFamily: theme.fonts.body }}>{sets[2].label}</text>
          </>
        )}
      </svg>

      <div style={{ marginTop: 20, fontSize: 18, color: theme.colors.textSecondary }}>圆圈动态融合分离，展示集合交并关系</div>
    </div>
  );
};
