import React from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TitleKineticGlitchProps {
  text: string;
  intensity?: number;
  colors?: string[];
}

/**
 * 故障风标题
 * 赛博朋克风格，文字随机错位、变色，表达科技或警告
 * 自动使用当前主题的颜色
 */
export const TitleKineticGlitch: React.FC<TitleKineticGlitchProps> = ({
  text,
  intensity = 1,
  colors,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 使用主题颜色（如果未提供自定义颜色）
  const finalColors = colors || [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
  ];

  // 主文字进入动画
  const mainOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 故障触发（每 10 帧触发一次）
  const glitchActive = Math.floor(frame / 10) % 3 === 0;
  const glitchIntensity = glitchActive ? intensity : 0;

  // 随机偏移
  const getRandomOffset = (seed: number) => {
    return random(seed) * 20 * glitchIntensity - 10 * glitchIntensity;
  };

  // RGB 分离效果
  const rgbSplit = glitchActive ? 5 * intensity : 0;

  // 扫描线动画
  const scanlineY = interpolate(frame % 60, [0, 60], [0, 100]);

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
            linear-gradient(${finalColors[0]}1a 1px, transparent 1px),
            linear-gradient(90deg, ${finalColors[0]}1a 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.3,
        }}
      />

      {/* 扫描线 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: 3,
          top: `${scanlineY}%`,
          background: `${finalColors[1]}80`,
          boxShadow: `0 0 20px ${finalColors[1]}cc`,
        }}
      />

      <div style={{ position: "relative", opacity: mainOpacity }}>
        {/* 主文字 */}
        <h1
          style={{
            fontSize: 140,
            fontWeight: 900,
            color: theme.colors.text,
            margin: 0,
            fontFamily: theme.fonts.heading,
            textTransform: "uppercase",
            letterSpacing: 10,
            position: "relative",
            transform: `translate(${getRandomOffset(frame)}px, ${getRandomOffset(frame + 1)}px)`,
            textShadow: `
              ${rgbSplit}px 0 0 ${finalColors[0]},
              -${rgbSplit}px 0 0 ${finalColors[1]},
              0 0 40px rgba(255,255,255,0.5)
            `,
            clipPath: glitchActive
              ? `polygon(
                  0 ${random(frame) * 20}%,
                  100% ${random(frame + 1) * 20}%,
                  100% ${80 + random(frame + 2) * 20}%,
                  0 ${80 + random(frame + 3) * 20}%
                )`
              : "none",
          }}
        >
          {text}
        </h1>

        {/* 故障层 1 */}
        {glitchActive && (
          <h1
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              fontSize: 140,
              fontWeight: 900,
              color: finalColors[0],
              margin: 0,
              fontFamily: theme.fonts.heading,
              textTransform: "uppercase",
              letterSpacing: 10,
              transform: `translate(${getRandomOffset(frame + 10)}px, ${getRandomOffset(frame + 11)}px)`,
              opacity: 0.7,
              mixBlendMode: "screen",
              clipPath: `polygon(
                0 ${random(frame + 4) * 30}%,
                100% ${random(frame + 5) * 30}%,
                100% ${70 + random(frame + 6) * 30}%,
                0 ${70 + random(frame + 7) * 30}%
              )`,
            }}
          >
            {text}
          </h1>
        )}

        {/* 故障层 2 */}
        {glitchActive && (
          <h1
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              fontSize: 140,
              fontWeight: 900,
              color: finalColors[1],
              margin: 0,
              fontFamily: theme.fonts.heading,
              textTransform: "uppercase",
              letterSpacing: 10,
              transform: `translate(${getRandomOffset(frame + 20)}px, ${getRandomOffset(frame + 21)}px)`,
              opacity: 0.7,
              mixBlendMode: "screen",
              clipPath: `polygon(
                0 ${random(frame + 8) * 40}%,
                100% ${random(frame + 9) * 40}%,
                100% ${60 + random(frame + 10) * 40}%,
                0 ${60 + random(frame + 11) * 40}%
              )`,
            }}
          >
            {text}
          </h1>
        )}

        {/* 随机像素块 */}
        {glitchActive &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${random(frame + i * 100) * 100}%`,
                top: `${random(frame + i * 100 + 50) * 100}%`,
                width: random(frame + i * 100 + 25) * 100 + 20,
                height: 4,
                background: finalColors[i % finalColors.length],
                opacity: 0.8,
              }}
            />
          ))}
      </div>

      {/* 警告文字 */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 20,
          color: finalColors[0],
          fontFamily: theme.fonts.mono,
          letterSpacing: 4,
          opacity: glitchActive ? 1 : 0.3,
          textShadow: `0 0 10px ${finalColors[0]}`,
        }}
      >
        [SYSTEM ALERT] GLITCH DETECTED
      </div>
    </div>
  );
};
