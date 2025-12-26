import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface SwotItem {
  text: string;
  icon?: string;
}

export interface SwotData {
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
}

export interface LogicSwotMatrixProps {
  /** SWOT 数据 */
  data: SwotData;
  /** 图表标题 */
  title?: string;
  /** 是否显示图标 */
  showIcons?: boolean;
}

/**
 * SWOT 分析矩阵
 * 
 * 四象限展示优势、劣势、机会、威胁
 * 适用场景：战略分析、竞争分析、项目评估
 * 
 * 教学要点：
 * - 四象限分析法
 * - 内外部因素分析
 * - 战略规划工具
 */
export const LogicSwotMatrix: React.FC<LogicSwotMatrixProps> = ({
  data,
  title = "SWOT 分析",
  showIcons = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  if (!data) {
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
        ⚠️ 请提供 SWOT 数据
      </div>
    );
  }

  // 进入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 四个象限的缩放动画
  const quadrantScale = (startFrame: number) =>
    interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
      extrapolateRight: "clamp",
    });

  const renderQuadrant = (
    items: SwotItem[],
    title: string,
    color: string,
    position: "tl" | "tr" | "bl" | "br",
    startFrame: number
  ) => {
    const scale = quadrantScale(startFrame);

    return (
      <div
        style={{
          flex: 1,
          padding: 30,
          backgroundColor: `${color}15`,
          border: `3px solid ${color}`,
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          transform: `scale(${scale})`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* 象限标题 */}
        <div
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: color,
            marginBottom: 20,
            fontFamily: theme.fonts.heading,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {showIcons && (
            <span style={{ fontSize: 40 }}>
              {position === "tl" && "💪"}
              {position === "tr" && "⚠️"}
              {position === "bl" && "🎯"}
              {position === "br" && "⚡"}
            </span>
          )}
          {title}
        </div>

        {/* 项目列表 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 15 }}>
          {items.map((item, index) => {
            const itemOpacity = interpolate(
              frame,
              [startFrame + 20 + index * 5, startFrame + 30 + index * 5],
              [0, 1],
              { extrapolateRight: "clamp" }
            );

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  opacity: itemOpacity,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: color,
                    marginTop: 8,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontSize: 18,
                    color: theme.colors.text,
                    fontFamily: theme.fonts.body,
                    lineHeight: 1.6,
                  }}
                >
                  {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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

      {/* SWOT 矩阵 */}
      <div
        style={{
          width: 1200,
          height: 700,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 20,
        }}
      >
        {/* 优势 (Strengths) - 左上 */}
        {renderQuadrant(
          data.strengths,
          "优势 (Strengths)",
          theme.colors.success,
          "tl",
          10
        )}

        {/* 劣势 (Weaknesses) - 右上 */}
        {renderQuadrant(
          data.weaknesses,
          "劣势 (Weaknesses)",
          theme.colors.error,
          "tr",
          20
        )}

        {/* 机会 (Opportunities) - 左下 */}
        {renderQuadrant(
          data.opportunities,
          "机会 (Opportunities)",
          theme.colors.primary,
          "bl",
          30
        )}

        {/* 威胁 (Threats) - 右下 */}
        {renderQuadrant(
          data.threats,
          "威胁 (Threats)",
          theme.colors.warning,
          "br",
          40
        )}
      </div>

      {/* 说明 */}
      <div
        style={{
          marginTop: 30,
          fontSize: 18,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
      >
        SWOT 分析：内部优劣势 × 外部机会威胁
      </div>
    </div>
  );
};
