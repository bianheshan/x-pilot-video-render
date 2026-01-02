import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface StatCircularProgressProps {
  percentage: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  duration?: number;
}

/**
 * 环形进度条
 * 带有发光端点的动态圆环，展示百分比
 */
export const StatCircularProgress: React.FC<StatCircularProgressProps> = ({
  percentage,
  label,
  size = 400,
  strokeWidth = 30,
  color,
  duration = 90,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  
  // 🛡️ 防护措施1：验证必填属性
  if (!label || typeof label !== 'string') {
    console.error('[StatCircularProgress] label is required and must be a string');
    return (
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: theme.colors.background,
        color: theme.colors.error || "#ef4444",
        fontSize: 24,
        fontFamily: theme.fonts.body,
        padding: 40,
        textAlign: "center",
      }}>
        ⚠️ StatCircularProgress Error: Missing required prop "label"
      </div>
    );
  }

  // 🛡️ 防护措施2：验证 percentage 为有效数字（防止 interpolate 错误）
  const safePercentage = (() => {
    if (typeof percentage !== 'number' || !Number.isFinite(percentage)) {
      console.error(`[StatCircularProgress] percentage must be a finite number, got: ${percentage}`);
      return 0;
    }
    // 限制范围在 0-100
    return Math.max(0, Math.min(100, percentage));
  })();

  // 🛡️ 防护措施3：验证 duration 为正数
  const safeDuration = Math.max(1, duration);
  
  // 使用主题颜色或传入的颜色
  const progressColor = color || theme.colors.primary;

  // 进度动画（使用安全的 percentage 值）
  const currentProgress = interpolate(
    frame,
    [0, safeDuration],
    [0, safePercentage],
    {
      extrapolateRight: "clamp",
      easing: (t) => {
        // 缓动函数
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      },
    }
  );

  // 圆环参数
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference;

  // 容器进入动画
  const containerScale = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const containerOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 旋转动画
  const rotation = interpolate(frame, [0, 300], [0, 360], {
    extrapolateRight: "extend",
  });

  // 发光效果
  const glowIntensity = 0.6 + Math.sin(frame / 15) * 0.4;

  // 端点位置计算
  const endAngle = (currentProgress / 100) * 360 - 90; // -90 是因为起点在顶部
  const endX = size / 2 + radius * Math.cos((endAngle * Math.PI) / 180);
  const endY = size / 2 + radius * Math.sin((endAngle * Math.PI) / 180);

  // 数字滚动
  const displayValue = Math.floor(currentProgress);

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
          background: `radial-gradient(circle at 50% 50%, ${progressColor}22 0%, transparent 70%)`,
          opacity: glowIntensity,
        }}
      />

      {/* 旋转装饰环 */}
      <div
        style={{
          position: "absolute",
          width: size + 100,
          height: size + 100,
          border: `1px solid ${progressColor}22`,
          borderRadius: "50%",
          transform: `rotate(${rotation}deg)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: size + 200,
          height: size + 200,
          border: `1px solid ${progressColor}11`,
          borderRadius: "50%",
          transform: `rotate(${-rotation / 2}deg)`,
        }}
      />

      {/* 主容器 */}
      <div
        style={{
          transform: `scale(${containerScale})`,
          opacity: containerOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        {/* SVG 圆环 */}
        <div style={{ position: "relative" }}>
          <svg width={size} height={size}>
            <defs>
              {/* 渐变定义 */}
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={progressColor} stopOpacity="1" />
                <stop offset="100%" stopColor={progressColor} stopOpacity="0.6" />
              </linearGradient>

              {/* 发光滤镜 */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 背景圆环 */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={theme.colors.surfaceLight}
              strokeWidth={strokeWidth}
            />

            {/* 进度圆环 */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              filter="url(#glow)"
            />

            {/* 发光端点 */}
            {currentProgress > 0 && (
              <>
                <circle
                  cx={endX}
                  cy={endY}
                  r={strokeWidth / 2 + 5}
                  fill={progressColor}
                  opacity={glowIntensity}
                  filter="url(#glow)"
                />
                <circle
                  cx={endX}
                  cy={endY}
                  r={strokeWidth / 2}
                  fill={theme.colors.text}
                />
              </>
            )}
          </svg>

          {/* 中心数字 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 100,
                fontWeight: "bold",
                color: progressColor,
                fontFamily: theme.fonts.mono,
                textShadow: `0 0 30px ${progressColor}`,
                lineHeight: 1,
              }}
            >
              {displayValue}
              <span style={{ fontSize: 60 }}>%</span>
            </div>

            {/* 进度条 */}
            <div
              style={{
                width: 150,
                height: 3,
                background: theme.colors.surfaceLight,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${currentProgress}%`,
                  height: "100%",
                  background: progressColor,
                  boxShadow: `0 0 10px ${progressColor}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 标签 */}
        <h3
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: theme.colors.text,
            margin: 0,
            fontFamily: theme.fonts.body,
            textTransform: "uppercase",
            letterSpacing: 3,
            textShadow: `0 0 20px ${progressColor}66`,
          }}
        >
          {label}
        </h3>

        {/* 统计信息 */}
        <div
          style={{
            display: "flex",
            gap: 60,
            fontSize: 18,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.mono,
          }}
        >
          <div>
            <span style={{ color: progressColor }}>●</span> Current: {displayValue}%
          </div>
          <div>
            <span style={{ color: progressColor }}>●</span> Target: {safePercentage}%
          </div>
        </div>
      </div>

      {/* 装饰粒子 */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const distance = size / 2 + 150 + Math.sin(frame / 20 + i) * 30;
        const x = Math.cos(angle + frame / 100) * distance;
        const y = Math.sin(angle + frame / 100) * distance;
        const particleOpacity = 0.3 + Math.sin(frame / 15 + i) * 0.2;

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
              background: progressColor,
              transform: `translate(${x}px, ${y}px)`,
              opacity: particleOpacity,
              boxShadow: `0 0 8px ${progressColor}`,
            }}
          />
        );
      })}

      {/* 完成提示 */}
      {currentProgress >= safePercentage && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 20,
            color: progressColor,
            fontFamily: theme.fonts.mono,
            opacity: interpolate(frame, [safeDuration, safeDuration + 20], [0, 1], {
              extrapolateRight: "clamp",
            }),
            textShadow: `0 0 10px ${progressColor}`,
          }}
        >
          ✓ PROGRESS COMPLETE
        </div>
      )}
    </div>
  );
};
