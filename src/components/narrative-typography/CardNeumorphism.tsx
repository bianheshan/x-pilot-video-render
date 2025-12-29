import React from "react";
import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface CardNeumorphismProps {
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  style?: "raised" | "pressed" | CSSProperties;
  variant?: "raised" | "pressed";
  accentColor?: string;
  cardStyle?: CSSProperties;
  eyebrow?: string;
  footer?: ReactNode;
  backgroundColor?: string;
}

/**
 * 新拟态卡片 - 通过软阴影突出知识要点，支持自定义眉标题与底部补充说明。
 */
export const CardNeumorphism: React.FC<CardNeumorphismProps> = ({
  title,
  content,
  icon = "💡",
  style: styleProp = "raised",
  variant,
  accentColor,
  cardStyle,
  eyebrow,
  footer,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const resolvedVariant = typeof styleProp === "string" ? styleProp : variant || "raised";
  const legacyCustomStyle = typeof styleProp === "object" ? (styleProp as CSSProperties) : undefined;
  const mergedCardStyle: CSSProperties | undefined =
    legacyCustomStyle || cardStyle ? { ...legacyCustomStyle, ...cardStyle } : cardStyle;

  const cardY = interpolate(frame, [0, 35], [50, 0], { extrapolateRight: "clamp" });
  const cardOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const floatY = Math.sin(frame / 40) * 5;
  const shadowIntensity = 0.8 + Math.sin(frame / 30) * 0.2;
  const bgColor = theme.colors.surface;
  const resolvedBackground = backgroundColor ?? `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`;

  const outerShadow =
    resolvedVariant === "raised"
      ? `${20 * shadowIntensity}px ${20 * shadowIntensity}px ${40 * shadowIntensity}px ${theme.colors.shadow}99, -${20 *
          shadowIntensity}px -${20 * shadowIntensity}px ${40 * shadowIntensity}px rgba(255, 255, 255, 0.12)`
      : `inset ${15 * shadowIntensity}px ${15 * shadowIntensity}px ${30 * shadowIntensity}px ${theme.colors.shadow}99, inset -${15 *
          shadowIntensity}px -${15 * shadowIntensity}px ${30 * shadowIntensity}px rgba(255, 255, 255, 0.08)`;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: resolvedBackground,
        overflow: "hidden",
        padding: 40,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 720,
          padding: 60,
          backgroundColor: bgColor,
          borderRadius: 40,
          boxShadow: outerShadow,
          transform: `translateY(${cardY + floatY}px)`,
          opacity: cardOpacity,
          ...mergedCardStyle,
        }}
      >
        {eyebrow && (
          <div
            style={{
              fontSize: 18,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: accentColor || theme.colors.primary,
              marginBottom: 10,
            }}
          >
            {eyebrow}
          </div>
        )}

        <div
          style={{
            width: 100,
            height: 100,
            margin: "0 auto 30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            backgroundColor: bgColor,
            boxShadow:
              resolvedVariant === "raised"
                ? `10px 10px 20px ${theme.colors.shadow}80, -10px -10px 20px rgba(255, 255, 255, 0.1)`
                : `inset 8px 8px 16px ${theme.colors.shadow}80, inset -8px -8px 16px rgba(255, 255, 255, 0.1)`,
            fontSize: 50,
            color: accentColor || theme.colors.primary,
          }}
        >
          {icon}
        </div>

        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: theme.colors.text,
            margin: "0 0 25px 0",
            textAlign: "center",
            fontFamily: theme.fonts.heading,
          }}
        >
          {title}
        </h2>

        <div
          style={{
            width: "80%",
            height: 4,
            margin: "0 auto 30px",
            borderRadius: 2,
            backgroundColor: bgColor,
            boxShadow:
              resolvedVariant === "raised"
                ? `inset 3px 3px 6px ${theme.colors.shadow}66, inset -3px -3px 6px rgba(255, 255, 255, 0.05)`
                : `3px 3px 6px ${theme.colors.shadow}66, -3px -3px 6px rgba(255, 255, 255, 0.05)`,
          }}
        />

        <div
          style={{
            fontSize: 22,
            lineHeight: 1.8,
            color: theme.colors.textSecondary,
            margin: 0,
            textAlign: "center",
            fontFamily: theme.fonts.body,
          }}
        >
          {typeof content === "string" ? <span>{content}</span> : content}
        </div>

        {footer && (
          <div
            style={{
              marginTop: 30,
              fontSize: 18,
              textAlign: "center",
              color: theme.colors.textSecondary,
            }}
          >
            {footer}
          </div>
        )}

        {resolvedVariant === "raised" && (
          <>
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent)",
                filter: "blur(10px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${theme.colors.shadow}33, transparent)`,
                filter: "blur(15px)",
              }}
            />
          </>
        )}

        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.mono,
            letterSpacing: 2,
            textTransform: "uppercase",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Neumorphism • {resolvedVariant === "raised" ? "Raised" : "Pressed"}
        </div>
      </div>
    </div>
  );
};
