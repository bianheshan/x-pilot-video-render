import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface CardHolographicProps {
  title: string;
  content: string;
  subtitle?: string;
}

/**
 * 全息投影卡
 * 带有彩虹光泽和扫描线效果的未来感卡片
 * 自动使用当前主题的颜色
 */
export const CardHolographic: React.FC<CardHolographicProps> = ({
  title,
  content,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme(); // 使用主题

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
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* 背景网格 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(${theme.colors.primary}1a 1px, transparent 1px),
            linear-gradient(90deg, ${theme.colors.primary}1a 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.3,
          transform: `perspective(500px) rotateX(60deg) translateY(-50%)`,
        }}
      />

      {/* 全息卡片 */}
      <div
        style={{
          position: "relative",
          width: 700,
          padding: 50,
          background: "rgba(10, 10, 30, 0.8)",
          borderRadius: 20,
          border: "2px solid rgba(0, 212, 255, 0.5)",
          boxShadow: `
            0 0 40px rgba(0, 212, 255, ${edgeGlow * 0.4}),
            inset 0 0 40px rgba(0, 212, 255, 0.1)
          `,
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          overflow: "hidden",
        }}
      >
        {/* 全息彩虹光泽层 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(${hologramShift}deg, 
              rgba(255,0,128,0.3) 0%,
              rgba(0,212,255,0.3) 25%,
              rgba(0,255,128,0.3) 50%,
              rgba(255,255,0,0.3) 75%,
              rgba(255,0,128,0.3) 100%
            )`,
            mixBlendMode: "screen",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        {/* 扫描线 */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: 3,
            top: `${scanlineY}%`,
            left: 0,
            background: "linear-gradient(to bottom, transparent, rgba(0,212,255,0.8), transparent)",
            boxShadow: "0 0 20px rgba(0,212,255,0.8)",
            pointerEvents: "none",
          }}
        />

        {/* 数据流线条 */}
        {Array.from({ length: 5 }).map((_, i) => {
          const lineProgress = (dataFlow + i * 12) % 60;
          const lineOpacity = interpolate(lineProgress, [0, 10, 50, 60], [0, 1, 1, 0]);
          const lineX = interpolate(lineProgress, [0, 60], [0, 100]);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${lineX}%`,
                top: `${20 + i * 15}%`,
                width: 2,
                height: 40,
                background: "rgba(0,212,255,0.8)",
                opacity: lineOpacity,
                boxShadow: "0 0 10px rgba(0,212,255,0.8)",
                pointerEvents: "none",
              }}
            />
          );
        })}

        {/* 副标题 */}
        {subtitle && (
          <div
            style={{
              fontSize: 16,
              color: "#00d4ff",
              marginBottom: 15,
              fontFamily: "monospace",
              letterSpacing: 3,
              textTransform: "uppercase",
              textShadow: "0 0 10px rgba(0,212,255,0.8)",
            }}
          >
            {subtitle}
          </div>
        )}

        {/* 标题 */}
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 30px 0",
            fontFamily: "Arial, sans-serif",
            textShadow: `
              0 0 20px rgba(0,212,255,0.6),
              0 0 40px rgba(0,212,255,0.4)
            `,
            letterSpacing: 2,
            position: "relative",
          }}
        >
          {title}
          
          {/* 标题下划线 */}
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: 0,
              width: "100%",
              height: 2,
              background: "linear-gradient(90deg, #00d4ff, #ff00ff, #00d4ff)",
              boxShadow: "0 0 10px rgba(0,212,255,0.8)",
            }}
          />
        </h2>

        {/* 内容 */}
        <p
          style={{
            fontSize: 22,
            lineHeight: 1.8,
            color: "rgba(255, 255, 255, 0.85)",
            margin: 0,
            fontFamily: "Arial, sans-serif",
            position: "relative",
            zIndex: 1,
          }}
        >
          {content}
        </p>

        {/* 全息投影标识 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 30,
            fontSize: 14,
            color: "#00d4ff",
            fontFamily: "monospace",
            opacity: 0.7,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#00d4ff",
              boxShadow: "0 0 10px #00d4ff",
              animation: "pulse 2s infinite",
            }}
          />
          HOLOGRAPHIC PROJECTION ACTIVE
        </div>

        {/* 角落装饰 */}
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
              border: "2px solid #00d4ff",
              borderWidth: i < 2 ? "2px 2px 0 0" : "0 0 2px 2px",
              opacity: edgeGlow,
              boxShadow: "0 0 10px rgba(0,212,255,0.6)",
            }}
          />
        ))}

        {/* 边缘发光效果 */}
        <div
          style={{
            position: "absolute",
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: 20,
            background: `linear-gradient(${hologramShift}deg, 
              rgba(255,0,128,0.4),
              rgba(0,212,255,0.4),
              rgba(0,255,128,0.4),
              rgba(255,255,0,0.4)
            )`,
            opacity: edgeGlow * 0.5,
            filter: "blur(10px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      </div>

      {/* 全息粒子 */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 400 + Math.sin(frame / 20 + i) * 50;
        const x = Math.cos(angle + frame / 60) * radius;
        const y = Math.sin(angle + frame / 60) * radius;
        const hue = (frame + i * 12) % 360;

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
              background: `hsl(${hue}, 100%, 60%)`,
              transform: `translate(${x}px, ${y}px)`,
              opacity: 0.6,
              boxShadow: `0 0 10px hsl(${hue}, 100%, 60%)`,
            }}
          />
        );
      })}
    </div>
  );
};
