import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface PhysOpticsPrismProps {
  /** 标题 */
  title?: string;
  /** 入射角度 (度) */
  incidentAngle?: number;
  /** 是否显示光谱标签 */
  showLabels?: boolean;
  /** 动画速度 */
  animationSpeed?: number;
}

/**
 * 光棱镜折射
 * 
 * 模拟光线穿过棱镜分解为七色光谱的物理过程
 * 
 * 物理原理：
 * - 斯涅尔定律：n₁sinθ₁ = n₂sinθ₂
 * - 色散：不同波长的光折射率不同
 * - 红光折射率最小，紫光折射率最大
 * 
 * 教学要点：
 * - 光的折射定律
 * - 色散现象
 * - 折射率与波长的关系
 * - 牛顿的光学实验
 */
export const PhysOpticsPrism: React.FC<PhysOpticsPrismProps> = ({
  title = "光的色散 - 棱镜实验",
  incidentAngle = 45,
  showLabels = true,
  animationSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 七色光谱数据
  const spectrum = [
    { color: "#FF0000", name: "红", wavelength: 700, refractiveIndex: 1.513 },
    { color: "#FF7F00", name: "橙", wavelength: 620, refractiveIndex: 1.517 },
    { color: "#FFFF00", name: "黄", wavelength: 580, refractiveIndex: 1.519 },
    { color: "#00FF00", name: "绿", wavelength: 530, refractiveIndex: 1.522 },
    { color: "#0000FF", name: "蓝", wavelength: 470, refractiveIndex: 1.528 },
    { color: "#4B0082", name: "靛", wavelength: 450, refractiveIndex: 1.532 },
    { color: "#9400D3", name: "紫", wavelength: 400, refractiveIndex: 1.538 },
  ];

  // 棱镜参数
  const prismX = 400;
  const prismY = 360;
  const prismSize = 200;
  const prismAngle = 60; // 顶角

  // 计算光线路径
  const lightPaths = useMemo(() => {
    const paths = spectrum.map((light, index) => {
      // 入射点
      const incidentX = prismX - 150;
      const incidentY = prismY;

      // 入射角转弧度
      const theta1 = (incidentAngle * Math.PI) / 180;

      // 折射角（斯涅尔定律）
      const n1 = 1.0; // 空气
      const n2 = light.refractiveIndex; // 玻璃
      const sinTheta2 = (n1 * Math.sin(theta1)) / n2;
      const theta2 = Math.asin(sinTheta2);

      // 第一次折射后的方向
      const refractAngle1 = theta2 - theta1;

      // 在棱镜内的路径
      const insideLength = prismSize * 0.8;
      const insideEndX = incidentX + insideLength * Math.cos(refractAngle1);
      const insideEndY = incidentY + insideLength * Math.sin(refractAngle1);

      // 第二次折射（出射）
      const exitAngle = prismAngle * (Math.PI / 180);
      const theta3 = theta2 + exitAngle;
      const sinTheta4 = (n2 * Math.sin(theta3)) / n1;
      const theta4 = Math.asin(Math.min(sinTheta4, 1));

      // 出射光线
      const exitLength = 300;
      const exitAngleTotal = theta4 + refractAngle1 + exitAngle;

      // 根据折射率调整出射角度（色散）
      const dispersionOffset = (index - 3) * 15;

      return {
        ...light,
        incident: { x1: incidentX - 200, y1: incidentY, x2: incidentX, y2: incidentY },
        inside: { x1: incidentX, y1: incidentY, x2: insideEndX, y2: insideEndY },
        exit: {
          x1: insideEndX,
          y1: insideEndY,
          x2: insideEndX + exitLength * Math.cos(exitAngleTotal),
          y2: insideEndY + exitLength * Math.sin(exitAngleTotal) + dispersionOffset,
        },
      };
    });

    return paths;
  }, [incidentAngle, prismX, prismY, prismSize, prismAngle]);

  // 动画进度
  const progress = interpolate(
    frame,
    [0, 60 / animationSpeed],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        fontFamily: theme.fonts.body,
        backgroundColor: "#0A0E27",
        opacity,
      }}
    >
      {/* 标题 */}
      <h2
        style={{
          fontSize: 42,
          fontWeight: "bold",
          color: "#FFFFFF",
          marginBottom: 30,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      {/* 主画布 */}
      <svg width={1200} height={600} style={{ overflow: "visible" }}>
        <defs>
          {/* 光线发光效果 */}
          {spectrum.map((_, index) => (
            <filter key={`glow-${index}`} id={`glow-${index}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* 棱镜 */}
        <polygon
          points={`${prismX},${prismY - prismSize / 2} ${prismX + prismSize},${prismY + prismSize / 2} ${prismX - prismSize / 3},${prismY + prismSize / 2}`}
          fill="rgba(200, 220, 255, 0.3)"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth={3}
          style={{
            filter: "drop-shadow(0 0 20px rgba(200, 220, 255, 0.5))",
          }}
        />

        {/* 绘制光线 */}
        {lightPaths.map((path, index) => {
          const delay = index * 5;
          const lineProgress = Math.max(0, Math.min(1, (progress * 100 - delay) / 30));

          if (lineProgress <= 0) return null;

          return (
            <g key={`light-${index}`}>
              {/* 入射光线 */}
              {lineProgress > 0 && (
                <line
                  x1={path.incident.x1}
                  y1={path.incident.y1}
                  x2={interpolate(lineProgress, [0, 0.3], [path.incident.x1, path.incident.x2], { extrapolateRight: "clamp" })}
                  y2={path.incident.y2}
                  stroke={path.color}
                  strokeWidth={4}
                  opacity={0.8}
                  filter={`url(#glow-${index})`}
                />
              )}

              {/* 棱镜内光线 */}
              {lineProgress > 0.3 && (
                <line
                  x1={path.inside.x1}
                  y1={path.inside.y1}
                  x2={interpolate(lineProgress, [0.3, 0.6], [path.inside.x1, path.inside.x2], { extrapolateRight: "clamp" })}
                  y2={interpolate(lineProgress, [0.3, 0.6], [path.inside.y1, path.inside.y2], { extrapolateRight: "clamp" })}
                  stroke={path.color}
                  strokeWidth={4}
                  opacity={0.6}
                />
              )}

              {/* 出射光线（色散） */}
              {lineProgress > 0.6 && (
                <line
                  x1={path.exit.x1}
                  y1={path.exit.y1}
                  x2={interpolate(lineProgress, [0.6, 1], [path.exit.x1, path.exit.x2], { extrapolateRight: "clamp" })}
                  y2={interpolate(lineProgress, [0.6, 1], [path.exit.y1, path.exit.y2], { extrapolateRight: "clamp" })}
                  stroke={path.color}
                  strokeWidth={5}
                  opacity={0.9}
                  filter={`url(#glow-${index})`}
                />
              )}

              {/* 光谱标签 */}
              {showLabels && lineProgress >= 1 && (
                <text
                  x={path.exit.x2 + 20}
                  y={path.exit.y2}
                  fill={path.color}
                  fontSize={16}
                  fontWeight="bold"
                  style={{ fontFamily: theme.fonts.body }}
                >
                  {path.name}光 ({path.wavelength}nm)
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* 说明文字 */}
      <div
        style={{
          marginTop: 20,
          fontSize: 16,
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        <div style={{ marginBottom: 10 }}>
          💡 <strong>斯涅尔定律</strong>: n₁sinθ₁ = n₂sinθ₂
        </div>
        <div>
          🌈 不同波长的光折射率不同，导致色散现象
        </div>
      </div>
    </div>
  );
};
