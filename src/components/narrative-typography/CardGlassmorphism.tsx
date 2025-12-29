import React from "react";
import type { ReactNode } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface CardGlassmorphismProps {
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  accentColor?: string;
  /** @deprecated 请改用 accentColor。仍兼容旧字段以避免场景报错 */
  color?: string;
  eyebrow?: string;
  footer?: ReactNode;
  statLabel?: string;
  statValue?: string | number;
  align?: "center" | "left";
  maxWidth?: number;
}

/**
 * 毛玻璃卡片 - 高亮核心知识点，支持额外的「眉标题 / 统计 / 页脚」。
 */
export const CardGlassmorphism: React.FC<CardGlassmorphismProps> = ({
  title,
  content,
  icon = "✨",
  accentColor,
  color,
  eyebrow,
  footer,
  statLabel,
  statValue,
  align = "center",
  maxWidth = 720,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const finalAccentColor = accentColor || color || theme.colors.primary;

  const cardY = interpolate(frame, [0, 40], [100, 0], { extrapolateRight: "clamp" });
  const cardOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = interpolate(frame, [0, 40], [0.92, 1], { extrapolateRight: "clamp" });
  const lightX = interpolate(frame, [0, 200], [0, 100], { extrapolateRight: "extend" });
  const lightY = 50 + Math.sin(frame / 30) * 20;
  const glowIntensity = 0.5 + Math.sin(frame / 20) * 0.3;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`,
        overflow: "hidden",
        padding: 40,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth,
          padding: 60,
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderRadius: 30,
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 40px ${finalAccentColor}${Math.round(
            glowIntensity * 0.35 * 255
          )
            .toString(16)
            .padStart(2, "0")}`,
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          opacity: cardOpacity,
          textAlign: align,
        }}
      >
        {eyebrow && (
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 12,
              color: finalAccentColor,
            }}
          >
            {eyebrow}
          </div>
        )}

        <div
          style={{
            fontSize: 60,
            marginBottom: 24,
            filter: `drop-shadow(0 0 20px ${finalAccentColor})`,
          }}
        >
          {icon}
        </div>

        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: theme.colors.text,
            margin: "0 0 24px 0",
            fontFamily: theme.fonts.heading,
            letterSpacing: 1,
          }}
        >
          {title}
        </h2>

        <div
          aria-hidden
          style={{
            width: "100%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${finalAccentColor}, transparent)`,
            marginBottom: 24,
            boxShadow: `0 0 10px ${finalAccentColor}`,
          }}
        />

        <div
          style={{
            fontSize: 24,
            lineHeight: 1.8,
            color: theme.colors.textSecondary,
            textShadow: "0 1px 5px rgba(0,0,0,0.2)",
          }}
        >
          {typeof content === "string" ? <span>{content}</span> : content}
        </div>

        {(statLabel || statValue) && (
          <div
            style={{
              marginTop: 32,
              display: "inline-flex",
              alignItems: "baseline",
              gap: 12,
              color: finalAccentColor,
            }}
          >
            <span style={{ fontSize: 18, letterSpacing: 2, textTransform: "uppercase" }}>{statLabel}</span>
            <strong style={{ fontSize: 42 }}>{statValue}</strong>
          </div>
        )}

        {footer && (
          <div
            style={{
              marginTop: 36,
              fontSize: 20,
              color: theme.colors.text,
              opacity: 0.8,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
