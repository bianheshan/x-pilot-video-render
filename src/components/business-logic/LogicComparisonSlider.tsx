import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface ComparisonItem {
  label: string;
  before: number;
  after: number;
  unit?: string;
}

export interface LogicComparisonSliderProps {
  items: ComparisonItem[];
  title?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

/**
 * 对比滑块组件
 * 展示前后对比数据
 */
export const LogicComparisonSlider: React.FC<LogicComparisonSliderProps> = ({
  items = [],
  title = "前后对比",
  beforeLabel = "之前",
  afterLabel = "之后",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const sliderPosition = interpolate(frame % 120, [0, 60, 120], [0, 1, 0], { extrapolateRight: "wrap" });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40, backgroundColor: theme.colors.background, opacity }}>
      <h2 style={{ fontSize: 48, fontWeight: "bold", color: theme.colors.text, marginBottom: 40 }}>{title}</h2>
      <div style={{ width: 1000, display: "flex", flexDirection: "column", gap: 30 }}>
        {items.map((item, i) => {
          const maxValue = Math.max(item.before, item.after);
          const beforeWidth = (item.before / maxValue) * 400;
          const afterWidth = (item.after / maxValue) * 400;
          const currentWidth = beforeWidth + (afterWidth - beforeWidth) * sliderPosition;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 150, fontSize: 18, color: theme.colors.text, fontWeight: "bold" }}>{item.label}</div>
              <div style={{ flex: 1, height: 40, backgroundColor: theme.colors.surface, borderRadius: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: currentWidth, backgroundColor: sliderPosition < 0.5 ? theme.colors.error : theme.colors.success, borderRadius: 20, transition: "all 0.3s" }} />
                <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
                  <span style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{item.before}{item.unit}</span>
                  <span style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{item.after}{item.unit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
