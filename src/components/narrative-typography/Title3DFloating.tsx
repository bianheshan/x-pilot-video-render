import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Title3DFloatingProps {
  text: string;
  color?: string;
  depth?: number;
  rotationSpeed?: number;
}

/**
 * 3D 悬浮字
 * 具有厚度和真实阴影的立体文字，随时间缓慢旋转
 */
export const Title3DFloating: React.FC<Title3DFloatingProps> = ({
  text,
  color,
  depth = 30,
  rotationSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  
  // 使用主题颜色或传入的颜色
  const textColor = color || theme.colors.primary;

  // 旋转动画
  const rotateY = interpolate(
    frame,
    [0, 300 / rotationSpeed],
    [0, 360],
    {
      extrapolateRight: "extend",
    }
  );

  const rotateX = Math.sin(frame / 60) * 10;

  // 浮动动画
  const floatY = Math.sin(frame / 30) * 20;

  // 进入动画
  const scale = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 生成 3D 深度层
  const depthLayers = Array.from({ length: depth }).map((_, i) => {
    const layerDepth = i;
    const layerOpacity = 1 - (i / depth) * 0.7;
    const layerColor = `rgba(${parseInt(textColor.slice(1, 3), 16)}, ${parseInt(textColor.slice(3, 5), 16)}, ${parseInt(textColor.slice(5, 7), 16)}, ${layerOpacity})`;

    return {
      depth: layerDepth,
      opacity: layerOpacity,
      color: layerColor,
    };
  });

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: theme.colors.background,
        overflow: "hidden",
        perspective: 1000,
      }}
    >
      {/* 背景光效 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at 50% 50%, ${textColor}11 0%, transparent 70%)`,
        }}
      />

      {/* 3D 文字容器 */}
      <div
        style={{
          position: "relative",
          transform: `
            scale(${scale})
            translateY(${floatY}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
          `,
          transformStyle: "preserve-3d",
          opacity: opacity,
        }}
      >
        {/* 深度层（从后往前） */}
        {depthLayers.reverse().map((layer, i) => (
          <h1
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              fontSize: 140,
              fontWeight: 900,
              color: layer.color,
              margin: 0,
              fontFamily: "Arial Black, sans-serif",
              textTransform: "uppercase",
              letterSpacing: 10,
              transform: `translateZ(-${layer.depth}px)`,
              textShadow:
                i === 0
                  ? `
                0 0 20px ${textColor}88,
                0 0 40px ${textColor}44
              `
                  : "none",
              WebkitTextStroke: i === 0 ? "2px rgba(255,255,255,0.1)" : "none",
            }}
          >
            {text}
          </h1>
        ))}

        {/* 主文字（最前层） */}
        <h1
          style={{
            fontSize: 140,
            fontWeight: 900,
            color: textColor,
            margin: 0,
            fontFamily: theme.fonts.heading,
            textTransform: "uppercase",
            letterSpacing: 10,
            transform: "translateZ(0px)",
            textShadow: `
              0 0 30px ${textColor}aa,
              0 0 60px ${textColor}66,
              0 20px 40px ${theme.colors.shadow}
            `,
            WebkitTextStroke: "2px rgba(255,255,255,0.2)",
            position: "relative",
            zIndex: 10,
          }}
        >
          {text}
        </h1>

        {/* 顶部高光 */}
        <h1
          style={{
            position: "absolute",
            top: -3,
            left: 0,
            fontSize: 140,
            fontWeight: 900,
            color: "rgba(255,255,255,0.3)",
            margin: 0,
            fontFamily: "Arial Black, sans-serif",
            textTransform: "uppercase",
            letterSpacing: 10,
            transform: "translateZ(1px)",
            WebkitTextStroke: "1px rgba(255,255,255,0.5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundImage: "linear-gradient(to bottom, white, transparent)",
            zIndex: 11,
          }}
        >
          {text}
        </h1>
      </div>

      {/* 地面阴影 */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          width: 800,
          height: 100,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.5), transparent)",
          filter: "blur(30px)",
          transform: `translateY(${floatY / 2}px) scale(${1 + floatY / 200})`,
          opacity: 0.6,
        }}
      />

      {/* 旋转提示 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 16,
          color: theme.colors.textSecondary,
          fontFamily: theme.fonts.mono,
          letterSpacing: 2,
        }}
      >
        3D FLOATING TEXT • {Math.round(rotateY % 360)}°
      </div>

      {/* 装饰粒子 */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 400 + Math.sin(frame / 30 + i) * 50;
        const x = Math.cos(angle + frame / 100) * radius;
        const y = Math.sin(angle + frame / 100) * radius;
        const particleOpacity = 0.3 + Math.sin(frame / 20 + i) * 0.2;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: textColor,
              transform: `translate(${x}px, ${y}px)`,
              opacity: particleOpacity,
              boxShadow: `0 0 10px ${textColor}`,
            }}
          />
        );
      })}
    </div>
  );
};
