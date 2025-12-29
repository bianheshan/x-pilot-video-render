import React from "react";
import type { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TitleCinematicIntroProps {
  text: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  color?: string;
  glowColor?: string;
  backgroundGradient?: string;
  layout?: "full-bleed" | "contained";
  align?: "center" | "left";
  showBackdrop?: boolean;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
}

/**
 * 电影级开场标题 - 具备可配置布局、光效与多层次文案。
 * 旨在满足教学场景中的“知识可视化 + 动画 + 准确”要求。
 */
export const TitleCinematicIntro: React.FC<TitleCinematicIntroProps> = ({
  text,
  subtitle,
  description,
  eyebrow,
  color,
  glowColor,
  backgroundGradient,
  layout = "full-bleed",
  align = "center",
  showBackdrop = true,
  style,
  contentStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const finalColor = color || theme.colors.text;
  const finalGlow = glowColor || theme.colors.primary;
  const gradient =
    backgroundGradient || `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`;

  const scale = spring({ frame, fps, config: { damping: 20, mass: 0.6, stiffness: 140 } });
  const lightSweep = interpolate(frame, [0, 60], [-220, 220], { extrapolateRight: "clamp" });
  const blur = interpolate(frame, [0, 25], [18, 0], { extrapolateRight: "clamp" });
  const letterSpacing = interpolate(frame, [0, 40], [28, 0], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descOpacity = interpolate(frame, [45, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ContainerTag = layout === "full-bleed" ? "div" : "section";

  return (
    <ContainerTag
      style={{
        position: layout === "full-bleed" ? "absolute" : "relative",
        inset: layout === "full-bleed" ? 0 : undefined,
        width: "100%",
        height: layout === "full-bleed" ? "100%" : "auto",
        minHeight: layout === "full-bleed" ? "100%" : 480,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: align === "center" ? "center" : "flex-start",
        background: layout === "full-bleed" ? gradient : "transparent",
        padding: layout === "full-bleed" ? "0" : 60,
        overflow: "hidden",
        ...style,
      }}
    >
      {showBackdrop && layout === "full-bleed" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${finalGlow}22 0%, transparent 70%)`,
            opacity: 0.75,
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1200,
          textAlign: align,
          padding: layout === "full-bleed" ? "0 80px" : 0,
          color: finalColor,
          ...contentStyle,
        }}
      >
        {eyebrow && (
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 600,
              color: `${finalGlow}`,
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
        )}

        <div
          style={{
            position: "relative",
            display: "inline-flex",
            flexDirection: "column",
            alignItems: align === "center" ? "center" : "flex-start",
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)` ,
          }}
        >
          <h1
            style={{
              fontSize: layout === "full-bleed" ? 124 : 96,
              fontWeight: 900,
              margin: 0,
              letterSpacing,
              textTransform: "uppercase",
              fontFamily: theme.fonts.heading,
              textShadow: `0 0 20px ${finalGlow}88, 0 10px 30px rgba(0,0,0,0.7)`,
            }}
          >
            {text}
            <span
              style={{
                position: "absolute",
                top: 0,
                left: lightSweep,
                width: 120,
                height: "100%",
                background: `linear-gradient(90deg, transparent, ${finalGlow}aa, transparent)`,
                transform: "skewX(-20deg)",
                filter: "blur(12px)",
              }}
            />
          </h1>

          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              color: finalGlow,
              opacity: 0.25,
              textShadow: `0 0 40px ${finalGlow}`,
              transform: "translateY(10px) scale(1.02)",
              pointerEvents: "none",
            }}
          >
            {text}
          </div>
        </div>

        {subtitle && (
          <p
            style={{
              fontSize: 34,
              color: theme.colors.textSecondary,
              marginTop: 40,
              letterSpacing: 8,
              textTransform: "uppercase",
              fontWeight: 300,
              opacity: subtitleOpacity,
              textShadow: `0 0 12px ${finalGlow}55`,
            }}
          >
            {subtitle}
          </p>
        )}

        {description && (
          <p
            style={{
              fontSize: 24,
              lineHeight: 1.7,
              maxWidth: 900,
              marginTop: 24,
              color: theme.colors.text,
              opacity: descOpacity,
            }}
          >
            {description}
          </p>
        )}

        <div
          aria-hidden
          style={{
            marginTop: 50,
            width: align === "center" ? 620 : 420,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${finalGlow}, transparent)`,
            boxShadow: `0 0 15px ${finalGlow}`,
            opacity: subtitle ? subtitleOpacity : 1,
          }}
        />
      </div>
    </ContainerTag>
  );
};
