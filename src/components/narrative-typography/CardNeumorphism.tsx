import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface CardNeumorphismProps {
  title: string;
  content: string;
  icon?: string;
  style?: "raised" | "pressed";
}

/**
 * 新拟态卡片
 * 凸起或凹陷的软浮雕效果，适合极简 UI 展示
 * 自动使用当前主题的颜色
 */
export const CardNeumorphism: React.FC<CardNeumorphismProps> = ({
  title,
  content,
  icon = "💡",
  style = "raised",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 卡片进入动画
  const cardY = interpolate(frame, [0, 35], [50, 0], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 悬浮动画
  const floatY = Math.sin(frame / 40) * 5;

  // 阴影强度动画
  const shadowIntensity = 0.8 + Math.sin(frame / 30) * 0.2;

  // 使用主题背景色
  const bgColor = theme.colors.surface;

  // 根据样式设置阴影
  const boxShadow =
    style === "raised"
      ? `
          ${20 * shadowIntensity}px ${20 * shadowIntensity}px ${40 * shadowIntensity}px ${theme.colors.shadow}99,
          -${20 * shadowIntensity}px -${20 * shadowIntensity}px ${40 * shadowIntensity}px rgba(255, 255, 255, 0.1)
        `
      : `
          inset ${15 * shadowIntensity}px ${15 * shadowIntensity}px ${30 * shadowIntensity}px ${theme.colors.shadow}99,
          inset -${15 * shadowIntensity}px -${15 * shadowIntensity}px ${30 * shadowIntensity}px rgba(255, 255, 255, 0.1)
        `;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        overflow: "hidden",
      }}
    >
      {/* 背景装饰圆 */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          top: -200,
          right: -200,
          boxShadow: `
            30px 30px 60px ${theme.colors.shadow}66,
            -30px -30px 60px rgba(255, 255, 255, 0.05)
          `,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          bottom: -150,
          left: -150,
          boxShadow: `
            30px 30px 60px ${theme.colors.shadow}66,
            -30px -30px 60px rgba(255, 255, 255, 0.05)
          `,
        }}
      />

      {/* 新拟态卡片 */}
      <div
        style={{
          position: "relative",
          width: 700,
          padding: 60,
          backgroundColor: bgColor,
          borderRadius: 40,
          boxShadow: boxShadow,
          transform: `translateY(${cardY + floatY}px)`,
          opacity: cardOpacity,
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* 图标容器 */}
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
              style === "raised"
                ? `
                  10px 10px 20px ${theme.colors.shadow}80,
                  -10px -10px 20px rgba(255, 255, 255, 0.1)
                `
                : `
                  inset 8px 8px 16px ${theme.colors.shadow}80,
                  inset -8px -8px 16px rgba(255, 255, 255, 0.1)
                `,
            fontSize: 50,
          }}
        >
          {icon}
        </div>

        {/* 标题 */}
        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: theme.colors.text,
            margin: "0 0 25px 0",
            textAlign: "center",
            fontFamily: theme.fonts.heading,
            letterSpacing: 1,
            textShadow: `
              2px 2px 4px ${theme.colors.shadow}66,
              -2px -2px 4px rgba(255, 255, 255, 0.05)
            `,
          }}
        >
          {title}
        </h2>

        {/* 分隔线 */}
        <div
          style={{
            width: "80%",
            height: 4,
            margin: "0 auto 30px",
            borderRadius: 2,
            backgroundColor: bgColor,
            boxShadow:
              style === "raised"
                ? `
                  inset 3px 3px 6px ${theme.colors.shadow}66,
                  inset -3px -3px 6px rgba(255, 255, 255, 0.05)
                `
                : `
                  3px 3px 6px ${theme.colors.shadow}66,
                  -3px -3px 6px rgba(255, 255, 255, 0.05)
                `,
          }}
        />

        {/* 内容 */}
        <p
          style={{
            fontSize: 22,
            lineHeight: 1.8,
            color: theme.colors.textSecondary,
            margin: 0,
            textAlign: "center",
            fontFamily: theme.fonts.body,
          }}
        >
          {content}
        </p>

        {/* 底部装饰按钮 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 40,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                backgroundColor: bgColor,
                boxShadow:
                  style === "raised"
                    ? `
                      ${6 + Math.sin(frame / 20 + i) * 2}px ${6 + Math.sin(frame / 20 + i) * 2}px ${12 + Math.sin(frame / 20 + i) * 4}px ${theme.colors.shadow}80,
                      -${6 + Math.sin(frame / 20 + i) * 2}px -${6 + Math.sin(frame / 20 + i) * 2}px ${12 + Math.sin(frame / 20 + i) * 4}px rgba(255, 255, 255, 0.1)
                    `
                    : `
                      inset ${4 + Math.sin(frame / 20 + i) * 2}px ${4 + Math.sin(frame / 20 + i) * 2}px ${8 + Math.sin(frame / 20 + i) * 4}px ${theme.colors.shadow}80,
                      inset -${4 + Math.sin(frame / 20 + i) * 2}px -${4 + Math.sin(frame / 20 + i) * 2}px ${8 + Math.sin(frame / 20 + i) * 4}px rgba(255, 255, 255, 0.1)
                    `,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 20,
                color: theme.colors.textSecondary,
              }}
            >
              {i === 0 ? "◀" : i === 1 ? "●" : "▶"}
            </div>
          ))}
        </div>

        {/* 角落高光 */}
        {style === "raised" && (
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
      </div>

      {/* 样式指示器 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: 16,
          color: theme.colors.textSecondary,
          fontFamily: theme.fonts.mono,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Neumorphism • {style === "raised" ? "Raised" : "Pressed"}
      </div>
    </div>
  );
};
