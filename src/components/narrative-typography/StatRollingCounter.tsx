import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

type Seed = string | number;

export interface StatRollingCounterProps {
  targetValue: number;
  label: string;
  prefix?: string;
  suffix?: string;
  /** @deprecated Use durationInFrames instead. */
  duration?: number;
  durationInFrames?: number;
  color?: string;
  /** Deterministic seed (avoid Math.random). */
  seed?: Seed;
}

/**
 * 数字滚动器（帧驱动、可复现）
 * - 不使用 Math.random，避免渲染不确定性
 * - 所有动效由 frame 计算，避免 CSS transition 时间驱动
 */
export const StatRollingCounter: React.FC<StatRollingCounterProps> = ({
  targetValue,
  label,
  prefix = "",
  suffix = "",
  duration,
  durationInFrames,
  color,
  seed,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const durationFrames = Math.max(1, Math.floor(durationInFrames ?? duration ?? 90));
  const counterColor = color || theme.colors.primary;
  const seedBase = (seed ?? "StatRollingCounter").toString();

  const currentValue = interpolate(frame, [0, durationFrames], [0, targetValue], {
    extrapolateRight: "clamp",
    easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  });

  const valueString = Math.floor(currentValue).toString();
  const digits = valueString.split("");

  const containerScale = interpolate(frame, [0, 20], [0.8, 1], { extrapolateRight: "clamp" });
  const containerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const labelOpacity = interpolate(frame, [durationFrames - 20, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowIntensity = 0.6 + Math.sin(frame / 15) * 0.4;
  const isComplete = frame >= durationFrames;
  const completeScale = isComplete ? 1 + Math.sin((frame - durationFrames) / 10) * 0.05 : 1;

  const progressWidth = clamp((frame / durationFrames) * 100, 0, 100);

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
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at 50% 50%, ${counterColor}22 0%, transparent 70%)`,
          opacity: glowIntensity,
        }}
      />

      {Array.from({ length: 10 }).map((_, i) => {
        const streamY = ((frame * (2 + i * 0.5)) % 120) - 20;
        const streamX = 10 + i * 10;
        const digit = Math.floor(random(`${seedBase}:bgDigit:${i}:${frame}`) * 10);

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
              fontWeight: 800,
            }}
          >
            {digit}
          </div>
        );
      })}

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "30px 60px",
            background: theme.colors.surface,
            borderRadius: 20,
            border: `3px solid ${counterColor}`,
            boxShadow: `0 0 40px ${counterColor}${Math.floor(glowIntensity * 100).toString(16)}, inset 0 0 20px ${counterColor}33`,
          }}
        >
          {prefix && (
            <span
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: counterColor,
                fontFamily: theme.fonts.mono,
                textShadow: `0 0 20px ${counterColor}`,
              }}
            >
              {prefix}
            </span>
          )}

          {digits.map((digit, index) => {
            const digitProgress = interpolate(
              frame,
              [index * 5, durationFrames - (digits.length - index) * 3],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            const displayDigit = Math.floor(interpolate(digitProgress, [0, 1], [0, parseInt(digit, 10)]));
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
                        fontWeight: 900,
                        color: num === displayDigit ? counterColor : `${counterColor}66`,
                        fontFamily: theme.fonts.mono,
                        textShadow: num === displayDigit ? `0 0 20px ${counterColor}` : "none",
                      }}
                    >
                      {num}
                    </div>
                  ))}
                </div>

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

          {suffix && (
            <span
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: counterColor,
                fontFamily: theme.fonts.mono,
                textShadow: `0 0 20px ${counterColor}`,
              }}
            >
              {suffix}
            </span>
          )}
        </div>

        <h3
          style={{
            fontSize: 40,
            fontWeight: 700,
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
              width: `${progressWidth}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${counterColor}, ${counterColor}cc)`,
              boxShadow: `0 0 10px ${counterColor}`,
            }}
          />
        </div>
      </div>

      {isComplete && (
        <div
          style={{
            position: "absolute",
            top: 80,
            fontSize: 24,
            color: counterColor,
            fontFamily: theme.fonts.mono,
            opacity: interpolate(frame, [durationFrames, durationFrames + 20], [0, 1], {
              extrapolateRight: "clamp",
            }),
            textShadow: `0 0 10px ${counterColor}`,
          }}
        >
          TARGET REACHED
        </div>
      )}

      {isComplete &&
        Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const distance = ((frame - durationFrames) * 5) % 300;
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

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
