import React from "react";
import type { CSSProperties, ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../contexts/ThemeContext";

export type SubtitlePosition = "top" | "center" | "bottom" | {
  top?: number | string;
  bottom?: number | string;
  justify?: CSSProperties["justifyContent"];
};

export type SubtitleVariant = "solid" | "outline" | "transparent";

interface SubtitleProps {
  /** 字幕文本，支持 React 片段，便于富文本或高亮 */
  text: ReactNode;
  /** 开始帧，默认 0 */
  startFrame?: number;
  /** 显示时长（帧），默认 90 帧 ≈3 秒 */
  durationInFrames?: number;
  /** 进入/退出动画帧数，默认 12 */
  enterDuration?: number;
  exitDuration?: number;
  /** 位置预设或自定义 */
  position?: SubtitlePosition;
  /** 附加样式 */
  style?: CSSProperties;
  /** 是否启用默认淡入淡出动画 */
  animate?: boolean;
  /** 允许覆盖背景/文字颜色 */
  backgroundColor?: string;
  textColor?: string;
  /** 最大宽度（像素或百分比） */
  maxWidth?: number | string;
  /** 安全区边距，避免贴边 */
  safeAreaPadding?: number;
  /** 是否禁用默认 pointer-events: none */
  interactive?: boolean;
  /** 可选发言人标签，会呈现在字幕上方 */
  speakerLabel?: string;
  /** 对齐方式 */
  align?: "left" | "center";
  /** 外观 */
  variant?: SubtitleVariant;
  /** 是否突出重点词（简单高亮） */
  emphasisWords?: string[];
}

const PRESET_POSITIONS: Record<"top" | "center" | "bottom", CSSProperties> = {
  top: { top: "10%", justifyContent: "flex-start" },
  center: { top: "50%", transform: "translateY(-50%)", justifyContent: "center" },
  bottom: { bottom: "5%", justifyContent: "flex-end" },
};

const highlightText = (text: ReactNode, words?: string[], color?: string) => {
  if (!words?.length || typeof text !== "string") {
    return text;
  }
  const pattern = new RegExp(`(${words.map((w) => w.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, idx) =>
    words.some((word) => word.toLowerCase() === part.toLowerCase()) ? (
      <span key={`${part}-${idx}`} style={{ color, fontWeight: 700 }}>
        {part}
      </span>
    ) : (
      <React.Fragment key={`${part}-${idx}`}>{part}</React.Fragment>
    )
  );
};

export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  startFrame = 0,
  durationInFrames = 90,
  enterDuration = 12,
  exitDuration = 12,
  position = "bottom",
  style = {},
  animate = true,
  backgroundColor,
  textColor,
  maxWidth = "88%",
  safeAreaPadding = 8,
  interactive = false,
  speakerLabel,
  align = "center",
  variant = "solid",
  emphasisWords,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const relativeFrame = frame - startFrame;
  const isActive = relativeFrame >= 0 && relativeFrame <= durationInFrames;

  const baseBg = backgroundColor || theme.colors.subtitleBackground || "rgba(0, 0, 0, 0.45)";
  const baseTextColor = textColor || theme.colors.subtitleText || "#ffffff";

  const opacity = animate
    ? interpolate(
        relativeFrame,
        [0, enterDuration, durationInFrames - exitDuration, durationInFrames],
        [0, 1, 1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      )
    : isActive
    ? 1
    : 0;

  const translateY = animate
    ? interpolate(
        relativeFrame,
        [0, enterDuration],
        [20, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  const basePositionStyle: CSSProperties = typeof position === "string"
    ? PRESET_POSITIONS[position]
    : {
        top: position.top,
        bottom: position.bottom,
        justifyContent: position.justify ?? "center",
      };

  const bubbleStyle: CSSProperties = {
    backgroundColor: variant === "solid" ? baseBg : variant === "outline" ? "transparent" : "rgba(0,0,0,0.0001)",
    border: variant === "outline" ? `1.5px solid ${baseBg}` : undefined,
    boxShadow:
      variant === "transparent"
        ? "none"
        : "0 4px 12px rgba(0,0,0,0.2), 0 0 8px rgba(0,0,0,0.15)",
  };

  return (
    <div
      aria-hidden={!isActive}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        padding: safeAreaPadding,
        display: "flex",
        alignItems: "center",
        pointerEvents: interactive ? "auto" : "none",
        opacity,
        transform: `translateY(${translateY}px)`,
        visibility: opacity > 0 ? "visible" : "hidden",
        ...basePositionStyle,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            maxWidth,
            padding: "8px 16px",
            borderRadius: 10,
            color: baseTextColor,
            backdropFilter: variant === "transparent" ? "blur(8px)" : undefined,
            WebkitBackdropFilter: variant === "transparent" ? "blur(8px)" : undefined,
            textAlign: align,
            ...bubbleStyle,
          }}
        >
          {speakerLabel ? (
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 4,
                opacity: 0.8,
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              {speakerLabel}
            </div>
          ) : null}

          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              lineHeight: 1.28,
              margin: 0,
              fontFamily: theme.fonts.body,
              textShadow: variant === "transparent" ? "none" : "2px 4px 8px rgba(0,0,0,0.45)",
            }}
          >
            {highlightText(text, emphasisWords, theme.colors.accent)}
          </div>
        </div>
      </div>
    </div>
  );
};
