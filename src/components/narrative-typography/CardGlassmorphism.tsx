import React from "react";
import type { ReactNode, CSSProperties } from "react";
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
  background?: string;
  cardStyle?: CSSProperties;
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
  background,
  cardStyle,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const finalAccentColor = accentColor || color || theme.colors.primary;
  const resolvedBackground =
    background ?? `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`;

  const widthHint = cardStyle?.maxWidth ?? maxWidth;
  const minWidthHint = (cardStyle as any)?.minWidth as number | undefined;
  const paddingHint = typeof (cardStyle as any)?.padding === "number" ? (cardStyle as any).padding : undefined;
  const isCompact = (widthHint ?? 0) <= 360 || (minWidthHint ?? Infinity) <= 240 || (paddingHint ?? Infinity) <= 24;
  const effectiveMinWidth = isCompact ? Math.max(minWidthHint ?? 0, 220) : minWidthHint;

  const cardY = interpolate(frame, [0, 40], [100, 0], { extrapolateRight: "clamp" });
  const cardOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = interpolate(frame, [0, 40], [0.92, 1], { extrapolateRight: "clamp" });
  const lightX = interpolate(frame, [0, 200], [0, 100], { extrapolateRight: "extend" });
  const lightY = 50 + Math.sin(frame / 30) * 20;
  const glowIntensity = 0.5 + Math.sin(frame / 20) * 0.3;

  const iconSize = isCompact ? 36 : 60;
  const titleSize = isCompact ? 32 : 48;
  const contentSize = isCompact ? 18 : 24;
  const statLabelSize = isCompact ? 14 : 18;
  const statValueSize = isCompact ? 30 : 42;
  const innerPadding = isCompact ? 36 : 60;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: resolvedBackground,
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
          minWidth: effectiveMinWidth,
          padding: cardStyle?.padding ?? innerPadding,
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
          ...cardStyle,
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
            fontSize: iconSize,
            marginBottom: isCompact ? 16 : 24,
            filter: `drop-shadow(0 0 20px ${finalAccentColor})`,
          }}
        >
          {icon}
        </div>

        <h2
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: isCompact ? "#0f172a" : theme.colors.text,
            margin: isCompact ? "0 0 16px 0" : "0 0 24px 0",
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
            marginBottom: isCompact ? 16 : 24,
            boxShadow: `0 0 10px ${finalAccentColor}`,
          }}
        />

        <div
          style={{
            fontSize: contentSize,
            lineHeight: 1.6,
            color: isCompact ? "#1f2933" : theme.colors.textSecondary,
            textShadow: isCompact ? "none" : "0 1px 5px rgba(0,0,0,0.2)",
          }}
        >
          {typeof content === "string" ? <span>{content}</span> : content}
        </div>

        {(statLabel || statValue) && (
          <div
            style={{
              marginTop: isCompact ? 24 : 32,
              display: "inline-flex",
              alignItems: "baseline",
              gap: 12,
              color: finalAccentColor,
            }}
          >
            <span style={{ fontSize: statLabelSize, letterSpacing: 2, textTransform: "uppercase" }}>{statLabel}</span>
            <strong style={{ fontSize: statValueSize }}>{statValue}</strong>
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
