import React from "react";
import type { ReactNode } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface ComparisonItem {
  label: string;
  before: number;
  after: number;
  unit?: string;
}

export interface LogicComparisonSliderProps {
  items?: ComparisonItem[];
  title?: string;
  beforeLabel?: string;
  afterLabel?: string;
  mode?: "data" | "visual";
  beforeContent?: ReactNode;
  afterContent?: ReactNode;
  initialPosition?: number; // 0-1
  handleColor?: string;
  autoAnimate?: boolean;
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * 对比滑块组件：可在「数据模式」与「视觉模式」间切换。
 */
export const LogicComparisonSlider: React.FC<LogicComparisonSliderProps> = ({
  items = [],
  title = "前后对比",
  beforeLabel = "之前",
  afterLabel = "之后",
  mode,
  beforeContent,
  afterContent,
  initialPosition = 0.5,
  handleColor,
  autoAnimate = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const resolvedMode = mode || (beforeContent && afterContent ? "visual" : "data");
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  if (resolvedMode === "visual" && beforeContent && afterContent) {
    const animatedPosition = autoAnimate
      ? clamp01(0.5 + Math.sin(frame / 80) * 0.3)
      : clamp01(initialPosition);
    const sliderPercent = animatedPosition * 100;
    const barColor = handleColor || theme.colors.accent || "#ffffff";

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
          backgroundColor: theme.colors.background,
          opacity,
        }}
      >
        <h2 style={{ fontSize: 48, fontWeight: "bold", color: theme.colors.text, marginBottom: 30 }}>{title}</h2>
        <div
          style={{
            position: "relative",
            width: 1100,
            maxWidth: "100%",
            aspectRatio: "16 / 9",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ position: "absolute", inset: 0 }}>{beforeContent}</div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(0 0 0 ${sliderPercent}%)`,
              boxShadow: "-10px 0 25px rgba(0,0,0,0.35)",
            }}
          >
            {afterContent}
          </div>

          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${sliderPercent}%`,
              width: 4,
              background: barColor,
              transform: "translateX(-50%)",
              boxShadow: `0 0 20px ${barColor}`,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {beforeLabel}
          </div>
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {afterLabel}
          </div>
        </div>
      </div>
    );
  }

  // 数据模式（兼容旧 props）
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
        backgroundColor: theme.colors.background,
        opacity,
      }}
    >
      <h2 style={{ fontSize: 48, fontWeight: "bold", color: theme.colors.text, marginBottom: 40 }}>{title}</h2>
      <div style={{ width: 1000, display: "flex", flexDirection: "column", gap: 30 }}>
        {items.map((item, i) => {
          const maxValue = Math.max(item.before, item.after);
          const beforeWidth = (item.before / maxValue) * 400;
          const afterWidth = (item.after / maxValue) * 400;
          const sliderPosition = interpolate(frame % 150, [0, 75, 150], [0, 1, 0], {
            extrapolateRight: "wrap",
          });
          const currentWidth = beforeWidth + (afterWidth - beforeWidth) * sliderPosition;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 150, fontSize: 18, color: theme.colors.text, fontWeight: "bold" }}>{item.label}</div>
              <div
                style={{
                  flex: 1,
                  height: 44,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 24,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: currentWidth,
                    backgroundColor: sliderPosition < 0.5 ? theme.colors.error : theme.colors.success,
                    borderRadius: 24,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  <span>
                    {beforeLabel}: {item.before}
                    {item.unit}
                  </span>
                  <span>
                    {afterLabel}: {item.after}
                    {item.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
