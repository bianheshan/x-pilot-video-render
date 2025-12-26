import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TitleGradientProps {
  text: string;
  subtitle?: string;
  /**
   * 渐变类型
   * - 'linear': 线性渐变
   * - 'radial': 径向渐变
   * - 'conic': 圆锥渐变
   * - 'animated': 动画渐变（颜色流动）
   */
  gradientType?: "linear" | "radial" | "conic" | "animated";
  /**
   * 渐变方向（仅用于 linear）
   * - 'horizontal': 水平
   * - 'vertical': 垂直
   * - 'diagonal': 对角线
   */
  direction?: "horizontal" | "vertical" | "diagonal";
  /**
   * 自定义渐变颜色数组
   * 如果不提供，将使用主题颜色
   */
  colors?: string[];
  /**
   * 是否启用动画效果
   */
  animated?: boolean;
  /**
   * 动画速度（1 = 正常速度）
   */
  animationSpeed?: number;
  /**
   * 字体大小
   */
  fontSize?: number;
  /**
   * 是否显示发光效果
   */
  glow?: boolean;
}

/**
 * 渐变标题组件
 * 支持多种渐变效果和动画，自动适配主题颜色
 * 
 * @example
 * ```tsx
 * <TitleGradient 
 *   text="Welcome" 
 *   gradientType="animated"
 *   animated={true}
 * />
 * ```
 */
export const TitleGradient: React.FC<TitleGradientProps> = ({
  text,
  subtitle,
  gradientType = "linear",
  direction = "diagonal",
  colors,
  animated = true,
  animationSpeed = 1,
  fontSize = 120,
  glow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // 默认渐变颜色（使用主题颜色）
  const defaultColors = colors || [
    theme.colors.primary,
    theme.colors.secondary || theme.colors.accent,
    theme.colors.primary,
  ];

  // 弹性进入动画
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 15,
      mass: 0.8,
    },
  });

  // 渐变动画偏移（用于 animated 类型）
  const gradientOffset = animated
    ? interpolate(
        frame * animationSpeed,
        [0, 100],
        [0, 100],
        {
          extrapolateRight: "repeat",
        }
      )
    : 0;

  // 旋转动画（用于 conic 类型）
  const rotation = animated
    ? interpolate(
        frame * animationSpeed,
        [0, 100],
        [0, 360],
        {
          extrapolateRight: "repeat",
        }
      )
    : 0;

  // 发光强度动画
  const glowIntensity = glow
    ? interpolate(
        frame * animationSpeed,
        [0, 60, 120],
        [0.5, 1, 0.5],
        {
          extrapolateRight: "repeat",
        }
      )
    : 1;

  // 副标题延迟进入
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 生成渐变 ID（唯一标识）
  const gradientId = `gradient-${text.replace(/\s/g, "")}-${gradientType}`;

  // 根据方向生成线性渐变坐标
  const getLinearGradientCoords = () => {
    switch (direction) {
      case "horizontal":
        return { x1: "0%", y1: "0%", x2: "100%", y2: "0%" };
      case "vertical":
        return { x1: "0%", y1: "0%", x2: "0%", y2: "100%" };
      case "diagonal":
      default:
        return { x1: "0%", y1: "0%", x2: "100%", y2: "100%" };
    }
  };

  // 生成渐变定义
  const renderGradient = () => {
    const coords = getLinearGradientCoords();

    switch (gradientType) {
      case "linear":
        return (
          <linearGradient
            id={gradientId}
            x1={coords.x1}
            y1={coords.y1}
            x2={coords.x2}
            y2={coords.y2}
            gradientUnits="userSpaceOnUse"
          >
            {defaultColors.map((color, index) => {
              const offset = animated
                ? ((index * (100 / (defaultColors.length - 1)) + gradientOffset) % 100)
                : (index * (100 / (defaultColors.length - 1)));
              return (
                <stop
                  key={index}
                  offset={`${Math.max(0, Math.min(100, offset))}%`}
                  stopColor={color}
                />
              );
            })}
          </linearGradient>
        );

      case "radial":
        return (
          <radialGradient
            id={gradientId}
            cx="50%"
            cy="50%"
            r="70%"
            gradientUnits="userSpaceOnUse"
          >
            {defaultColors.map((color, index) => {
              const offset = (index * (100 / (defaultColors.length - 1)));
              return (
                <stop
                  key={index}
                  offset={`${offset}%`}
                  stopColor={color}
                  stopOpacity={animated ? 0.5 + Math.sin((frame * animationSpeed + index * 20) / 10) * 0.5 : 1}
                />
              );
            })}
          </radialGradient>
        );

      case "conic":
        // 圆锥渐变使用多个线性渐变模拟（SVG 不支持原生圆锥渐变）
        // 这里返回一个特殊的标识，在渲染时使用 CSS conic-gradient
        return null;

      case "animated":
        return (
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            {defaultColors.map((color, index) => {
              const baseOffset = (index * (100 / defaultColors.length));
              const animatedOffset = (baseOffset + gradientOffset) % 100;
              return (
                <stop
                  key={index}
                  offset={`${animatedOffset}%`}
                  stopColor={color}
                />
              );
            })}
            {/* 添加重复的颜色以创建循环效果 */}
            {defaultColors.map((color, index) => {
              const baseOffset = 100 + (index * (100 / defaultColors.length));
              const animatedOffset = (baseOffset + gradientOffset) % 200;
              return (
                <stop
                  key={`repeat-${index}`}
                  offset={`${Math.min(100, animatedOffset)}%`}
                  stopColor={color}
                />
              );
            })}
          </linearGradient>
        );

      default:
        return null;
    }
  };

  // 获取文字样式
  const getTextStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontSize,
      fontWeight: 900,
      margin: 0,
      fontFamily: theme.fonts.heading,
      textTransform: "uppercase",
      letterSpacing: 8,
      transform: `scale(${scale})`,
    };

    if (gradientType === "conic") {
      // 圆锥渐变需要使用 CSS 背景渐变
      const conicGradient = `conic-gradient(from ${rotation}deg, ${defaultColors.join(", ")})`;
      return {
        ...baseStyle,
        background: conicGradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: glow
          ? `drop-shadow(0 0 ${10 * glowIntensity}px ${defaultColors[0]}) drop-shadow(0 0 ${20 * glowIntensity}px ${defaultColors[1] || defaultColors[0]})`
          : undefined,
      };
    } else {
      // SVG 渐变
      return {
        ...baseStyle,
        fill: `url(#${gradientId})`,
        filter: glow
          ? `drop-shadow(0 0 ${10 * glowIntensity}px ${defaultColors[0]}) drop-shadow(0 0 ${20 * glowIntensity}px ${defaultColors[1] || defaultColors[0]})`
          : undefined,
      };
    }
  };

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
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* SVG 渐变定义（用于 linear, radial, animated） */}
      {gradientType !== "conic" && renderGradient() && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>{renderGradient()}</defs>
        </svg>
      )}

      {/* 主标题 */}
      {gradientType === "conic" ? (
        // 圆锥渐变使用 HTML
        <h1 style={getTextStyle()}>{text}</h1>
      ) : (
        // 其他渐变使用 SVG
        <svg
          width="100%"
          height="200"
          viewBox="0 0 1920 200"
          style={{ transform: `scale(${scale})` }}
        >
          {renderGradient()}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
            fontWeight="900"
            fontFamily={theme.fonts.heading}
            letterSpacing="8"
            textTransform="uppercase"
            style={getTextStyle()}
          >
            {text}
          </text>
        </svg>
      )}

      {/* 副标题 */}
      {subtitle && (
        <p
          style={{
            fontSize: fontSize * 0.3,
            color: theme.colors.textSecondary,
            marginTop: 40,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 300,
            opacity: subtitleOpacity,
            fontFamily: theme.fonts.body,
            textShadow: `0 0 10px ${defaultColors[0]}44`,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* 装饰性背景光效 */}
      {glow && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle at 50% 50%, ${defaultColors[0]}22 0%, transparent 70%)`,
            opacity: glowIntensity * 0.3,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      )}
    </div>
  );
};

