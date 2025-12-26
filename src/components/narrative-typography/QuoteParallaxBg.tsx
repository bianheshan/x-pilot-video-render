import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface QuoteParallaxBgProps {
  quote: string;
  author?: string;
  backgroundImage?: string;
  overlayColor?: string;
}

/**
 * 视差引言
 * 背景图与文字层不同速移动，创造深邃感
 */
export const QuoteParallaxBg: React.FC<QuoteParallaxBgProps> = ({
  quote,
  author,
  backgroundImage,
  overlayColor,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  
  // 使用主题颜色或传入的颜色
  const overlay = overlayColor || `${theme.colors.background}99`;

  // 背景视差移动（慢速）
  const bgY = interpolate(frame, [0, 300], [0, -100], {
    extrapolateRight: "clamp",
  });

  const bgScale = interpolate(frame, [0, 300], [1, 1.2], {
    extrapolateRight: "clamp",
  });

  // 文字层移动（快速）
  const textY = interpolate(frame, [0, 300], [0, -200], {
    extrapolateRight: "clamp",
  });

  // 引号进入动画
  const quoteOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const quoteScale = interpolate(frame, [20, 50], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 作者延迟进入
  const authorOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const authorY = interpolate(frame, [60, 80], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 装饰线动画
  const lineWidth = interpolate(frame, [40, 70], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* 背景层（慢速视差） */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "120%",
          top: 0,
          left: 0,
          transform: `translateY(${bgY}px) scale(${bgScale})`,
          transformOrigin: "center center",
        }}
      >
        {backgroundImage ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(3px)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: theme.colors.background,
            }}
          />
        )}
      </div>

      {/* 遮罩层 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: overlay,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* 装饰粒子（中速视差） */}
      {Array.from({ length: 20 }).map((_, i) => {
        const particleY = interpolate(
          frame,
          [0, 300],
          [i * 60, i * 60 - 150]
        );
        const particleX = 10 + (i % 10) * 10;
        const particleOpacity = 0.1 + (i % 3) * 0.1;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${particleX}%`,
              top: `${particleY}px`,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "white",
              opacity: particleOpacity,
              boxShadow: `0 0 10px ${theme.colors.primary}`,
            }}
          />
        );
      })}

      {/* 文字层（快速视差） */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 120px",
          transform: `translateY(${textY}px)`,
        }}
      >
        {/* 左引号 */}
        <div
          style={{
            fontSize: 120,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.heading,
            lineHeight: 0.5,
            marginBottom: 20,
            opacity: quoteOpacity,
          }}
        >
          "
        </div>

        {/* 引言文字 */}
        <blockquote
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: "#ffffff",
            textAlign: "center",
            fontFamily: "Georgia, serif",
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 1000,
            fontStyle: "italic",
            textShadow: `0 4px 20px ${theme.colors.shadow}`,
            opacity: quoteOpacity,
            transform: `scale(${quoteScale})`,
          }}
        >
          {quote}
        </blockquote>

        {/* 右引号 */}
        <div
          style={{
            fontSize: 120,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.heading,
            lineHeight: 0.5,
            marginTop: 20,
            opacity: quoteOpacity,
          }}
        >
          "
        </div>

        {/* 装饰线 */}
        <div
          style={{
            width: `${lineWidth}%`,
            maxWidth: 400,
            height: 2,
            background: "linear-gradient(90deg, transparent, white, transparent)",
            marginTop: 40,
            marginBottom: 30,
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
          }}
        />

        {/* 作者 */}
        {author && (
          <div
            style={{
              fontSize: 28,
              color: "rgba(255, 255, 255, 0.9)",
              fontFamily: "Arial, sans-serif",
              letterSpacing: 2,
              textTransform: "uppercase",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
              opacity: authorOpacity,
              transform: `translateY(${authorY}px)`,
            }}
          >
            — {author}
          </div>
        )}
      </div>

      {/* 前景装饰（最快视差） */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: `translateY(${textY * 1.5}px)`,
          pointerEvents: "none",
        }}
      >
        {/* 左上角装饰 */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 60,
            width: 100,
            height: 100,
            border: `3px solid ${theme.colors.surfaceLight}`,
            borderRight: "none",
            borderBottom: "none",
            opacity: quoteOpacity,
          }}
        />

        {/* 右下角装饰 */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 60,
            width: 100,
            height: 100,
            border: `3px solid ${theme.colors.surfaceLight}`,
            borderLeft: "none",
            borderTop: "none",
            opacity: quoteOpacity,
          }}
        />
      </div>

      {/* 底部提示 */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 14,
          color: theme.colors.textSecondary,
          fontFamily: theme.fonts.mono,
          letterSpacing: 2,
          opacity: authorOpacity,
        }}
      >
        PARALLAX QUOTE
      </div>
    </div>
  );
};
