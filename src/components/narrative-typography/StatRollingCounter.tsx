import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface StatRollingCounterProps {
  targetValue: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  color?: string;
}

/**
 * 数字滚动器
 * 数字像老虎机一样快速滚动并停在最终值
 */
export const StatRollingCounter: React.FC<StatRollingCounterProps> = ({
  targetValue,
  label,
  prefix = "",
  suffix = "",
  duration = 90,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  
  // 使用主题颜色或传入的颜色
  const counterColor = color || theme.colors.primary;

  // 数字滚动动画（带缓动）
  const currentValue = interpolate(
    frame,
    [0, duration],
    [0, targetValue],
    {
      extrapolateRight: "clamp",
      easing: (t) => {
        // 自定义缓动函数：快速启动，慢速结束
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      },
    }
  );

  // 将数字转换为字符串并分离每一位
  const valueString = Math.floor(currentValue).toString();
  const digits = valueString.split("");

  // 容器进入动画
  const containerScale = interpolate(frame, [0, 20], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  const containerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 标签延迟进入
  const labelOpacity = interpolate(frame, [duration - 20, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 发光效果
  const glowIntensity = 0.6 + Math.sin(frame / 15) * 0.4;

  // 完成动画
  const isComplete = frame >= duration;
  const completeScale = isComplete
    ? 1 + Math.sin((frame - duration) / 10) * 0.05
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: theme.colors.background,
        overflow: "hidden",
      }}
    >
      {/* 背景光效 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at 50% 50%, ${counterColor}22 0%, transparent 70%)`,
          opacity: glowIntensity,
        }}
      />

      {/* 背景数字流 */}
      {Array.from({ length: 10 }).map((_, i) => {
        const streamY = ((frame * (2 + i * 0.5)) % 120) - 20;
        const streamX = 10 + i * 10;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${streamX}%`,
              top: `${streamY}%`,
              fontSize: 40,
              color: counterColor,
              opacity: 0.1,
              fontFamily: theme.fonts.mono,
              fontWeight: "bold",
            }}
          >
            {Math.floor(Math.random() * 10)}
          </div>
        );
      })}

      {/* 主容器 */}
      <div
        style={{
          transform: `scale(${containerScale * completeScale})`,
          opacity: containerOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* 数字显示区 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "30px 60px",
            background: theme.colors.surface,
            borderRadius: 20,
            border: `3px solid ${counterColor}`,
            boxShadow: `
              0 0 40px ${counterColor}${Math.floor(glowIntensity * 100).toString(16)},
              inset 0 0 20px ${counterColor}33
            `,
          }}
        >
          {/* 前缀 */}
          {prefix && (
            <span
              style={{
                fontSize: 80,
                fontWeight: "bold",
                color: counterColor,
                fontFamily: theme.fonts.mono,
                textShadow: `0 0 20px ${counterColor}`,
              }}
            >
              {prefix}
            </span>
          )}

          {/* 滚动数字 */}
          {digits.map((digit, index) => {
            // 每位数字的滚动效果
            const digitProgress = interpolate(
              frame,
              [index * 5, duration - (digits.length - index) * 3],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            const displayDigit = Math.floor(
              interpolate(digitProgress, [0, 1], [0, parseInt(digit)])
            );

            // 数字滚动时的模糊效果
            const digitBlur = digitProgress < 1 ? 2 : 0;

            return (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: 70,
                  height: 120,
                  overflow: "hidden",
                  background: theme.colors.background,
                  borderRadius: 10,
                  border: `2px solid ${counterColor}44`,
                }}
              >
                {/* 滚动数字容器 */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: `translateY(${-displayDigit * 120}px)`,
                    filter: `blur(${digitBlur}px)`,
                  }}
                >
                  {Array.from({ length: 10 }).map((_, num) => (
                    <div
                      key={num}
                      style={{
                        width: "100%",
                        height: 120,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 80,
                        fontWeight: "bold",
                        color: num === displayDigit ? color : `${color}66`,
                        fontFamily: "'Courier New', monospace",
                        textShadow:
                          num === displayDigit ? `0 0 20px ${color}` : "none",
                      }}
                    >
                      {num}
                    </div>
                  ))}
                </div>

                {/* 高光效果 */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "30%",
                    background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            );
          })}

          {/* 后缀 */}
          {suffix && (
            <span
              style={{
                fontSize: 80,
                fontWeight: "bold",
                color: counterColor,
                fontFamily: theme.fonts.mono,
                textShadow: `0 0 20px ${counterColor}`,
              }}
            >
              {suffix}
            </span>
          )}
        </div>

        {/* 标签 */}
        <h3
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: theme.colors.text,
            margin: 0,
            fontFamily: theme.fonts.body,
            textTransform: "uppercase",
            letterSpacing: 3,
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            opacity: labelOpacity,
          }}
        >
          {label}
        </h3>

        {/* 进度条 */}
        <div
          style={{
            width: 400,
            height: 4,
            background: theme.colors.surfaceLight,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(frame / duration) * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${counterColor}, ${counterColor}cc)`,
              boxShadow: `0 0 10px ${counterColor}`,
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>

      {/* 完成标识 */}
      {isComplete && (
        <div
          style={{
            position: "absolute",
            top: 80,
            fontSize: 24,
            color: counterColor,
            fontFamily: theme.fonts.mono,
            opacity: interpolate(frame, [duration, duration + 20], [0, 1], {
              extrapolateRight: "clamp",
            }),
            textShadow: `0 0 10px ${counterColor}`,
          }}
        >
          ✓ TARGET REACHED
        </div>
      )}

      {/* 装饰粒子 */}
      {isComplete &&
        Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const distance = ((frame - duration) * 5) % 300;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const particleOpacity = interpolate(distance, [0, 300], [1, 0]);

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
                background: counterColor,
                transform: `translate(${x}px, ${y}px)`,
                opacity: particleOpacity,
                boxShadow: `0 0 10px ${counterColor}`,
              }}
            />
          );
        })}
    </div>
  );
};
