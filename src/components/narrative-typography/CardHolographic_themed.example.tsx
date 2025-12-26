import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import { hexToRgb, addAlpha } from "../../utils/colorUtils";

export interface CardHolographicProps {
  title: string;
  content: string;
  subtitle?: string;
}

/**
 * 全息投影卡 - 主题适配版本示例
 * 展示如何使用主题系统
 */
export const CardHolographic: React.FC<CardHolographicProps> = ({
  title,
  content,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme(); // 获取当前主题

  // 卡片进入动画
  const cardScale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 全息光泽移动
  const hologramShift = interpolate(frame, [0, 120], [0, 360], {
    extrapolateRight: "extend",
  });

  // 扫描线动画
  const scanlineY = interpolate(frame % 90, [0, 90], [0, 100]);

  // 边缘光效
  const edgeGlow = 0.6 + Math.sin(frame / 15) * 0.4;

  // 数据流动画
  const dataFlow = frame % 60;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // 使用主题背景色
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* 背景网格 - 使用主题主色 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(${addAlpha(theme.colors.primary, 0.1)} 1px, transparent 1px),
            linear-gradient(90deg, ${addAlpha(theme.colors.primary, 0.1)} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.3,
        }}
      />

      {/* 全息卡片 */}
      <div
        style={{
          position: "relative",
          width: 700,
          padding: 50,
          background: addAlpha(theme.colors.surface, 0.8),
          borderRadius: 20,
          border: `2px solid ${addAlpha(theme.colors.primary, 0.5)}`,
          boxShadow: `
            0 0 40px ${addAlpha(theme.colors.primary, edgeGlow * 0.4)},
            inset 0 0 40px ${addAlpha(theme.colors.primary, 0.1)}
          `,
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          overflow: "hidden",
        }}
      >
        {/* 全息彩虹光泽层 - 使用主题色 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(${hologramShift}deg, 
              ${addAlpha(theme.colors.primary, 0.3)} 0%,
              ${addAlpha(theme.colors.secondary, 0.3)} 25%,
              ${addAlpha(theme.colors.accent, 0.3)} 50%,
              ${addAlpha(theme.colors.secondary, 0.3)} 75%,
              ${addAlpha(theme.colors.primary, 0.3)} 100%
            )`,
            mixBlendMode: "screen",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        {/* 扫描线 - 使用主题主色 */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: 3,
            top: `${scanlineY}%`,
            left: 0,
            background: `linear-gradient(to bottom, transparent, ${addAlpha(theme.colors.primary, 0.8)}, transparent)`,
            boxShadow: `0 0 20px ${addAlpha(theme.colors.primary, 0.8)}`,
            pointerEvents: "none",
          }}
        />

        {/* 副标题 - 使用主题主色 */}
        {subtitle && (
          <div
            style={{
              fontSize: 16,
              color: theme.colors.primary,
              marginBottom: 15,
              fontFamily: theme.typography.fontFamilyMono,
              letterSpacing: 3,
              textTransform: "uppercase",
              textShadow: `0 0 10px ${addAlpha(theme.colors.primary, 0.8)}`,
            }}
          >
            {subtitle}
          </div>
        )}

        {/* 标题 - 使用主题文字色 */}
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: theme.colors.text,
            margin: "0 0 30px 0",
            fontFamily: theme.typography.fontFamily,
            textShadow: `
              0 0 20px ${addAlpha(theme.colors.primary, 0.6)},
              0 0 40px ${addAlpha(theme.colors.primary, 0.4)}
            `,
            letterSpacing: 2,
            position: "relative",
          }}
        >
          {title}
          
          {/* 标题下划线 - 使用主题渐变色 */}
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: 0,
              width: "100%",
              height: 2,
              background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent}, ${theme.colors.primary})`,
              boxShadow: `0 0 10px ${addAlpha(theme.colors.primary, 0.8)}`,
            }}
          />
        </h2>

        {/* 内容 - 使用主题文字色 */}
        <p
          style={{
            fontSize: 22,
            lineHeight: 1.8,
            color: theme.colors.textSecondary,
            margin: 0,
            fontFamily: theme.typography.fontFamily,
            position: "relative",
            zIndex: 1,
          }}
        >
          {content}
        </p>

        {/* 全息投影标识 - 使用主题主色 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 30,
            fontSize: 14,
            color: theme.colors.primary,
            fontFamily: theme.typography.fontFamilyMono,
            opacity: 0.7,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: theme.colors.primary,
              boxShadow: `0 0 10px ${theme.colors.primary}`,
              animation: "pulse 2s infinite",
            }}
          />
          HOLOGRAPHIC PROJECTION ACTIVE
        </div>

        {/* 角落装饰 - 使用主题主色 */}
        {[
          { top: 10, left: 10 },
          { top: 10, right: 10 },
          { bottom: 10, left: 10 },
          { bottom: 10, right: 10 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 20,
              height: 20,
              border: `2px solid ${theme.colors.primary}`,
              borderWidth: i < 2 ? "2px 2px 0 0" : "0 0 2px 2px",
              opacity: edgeGlow,
              boxShadow: `0 0 10px ${addAlpha(theme.colors.primary, 0.6)}`,
            }}
          />
        ))}

        {/* 边缘发光效果 - 使用主题渐变色 */}
        <div
          style={{
            position: "absolute",
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: 20,
            background: `linear-gradient(${hologramShift}deg, 
              ${addAlpha(theme.colors.primary, 0.4)},
              ${addAlpha(theme.colors.secondary, 0.4)},
              ${addAlpha(theme.colors.accent, 0.4)},
              ${addAlpha(theme.colors.secondary, 0.4)}
            )`,
            opacity: edgeGlow * 0.5,
            filter: "blur(10px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      </div>

      {/* 全息粒子 - 使用主题色 */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 400 + Math.sin(frame / 20 + i) * 50;
        const x = Math.cos(angle + frame / 60) * radius;
        const y = Math.sin(angle + frame / 60) * radius;
        
        // 在主题色之间循环
        const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.accent];
        const colorIndex = i % colors.length;
        const particleColor = colors[colorIndex];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: particleColor,
              transform: `translate(${x}px, ${y}px)`,
              opacity: 0.6,
              boxShadow: `0 0 10px ${particleColor}`,
            }}
          />
        );
      })}
    </div>
  );
};
