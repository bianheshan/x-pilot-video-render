import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface EnginePart {
  /** 零件ID */
  id: string;
  /** 零件名称 */
  name: string;
  /** 初始位置 */
  x: number;
  y: number;
  z: number;
  /** 爆炸偏移 */
  explodeX: number;
  explodeY: number;
  explodeZ: number;
  /** 颜色 */
  color: string;
  /** 形状类型 */
  shape: "cylinder" | "box" | "ring";
  /** 尺寸 */
  width: number;
  height: number;
}

export interface IndEngineExplodeProps {
  /** 标题 */
  title?: string;
  /** 引擎零件配置 */
  parts?: EnginePart[];
  /** 爆炸持续时间（帧） */
  explodeDuration?: number;
  /** 是否显示标签 */
  showLabels?: boolean;
}

/**
 * 引擎爆炸分解图
 * 
 * 展示发动机内部结构，通过爆炸视图展示各零件位置关系
 * 
 * 工程原理：
 * - 爆炸视图：沿轴线分离零件
 * - 装配关系：展示零件之间的连接
 * - 空间布局：3D 透视投影
 * 
 * 教学要点：
 * - 发动机结构组成
 * - 零件装配顺序
 * - 机械设计原理
 */
export const IndEngineExplode: React.FC<IndEngineExplodeProps> = ({
  title = "发动机爆炸分解图",
  parts = [
    { id: "piston", name: "活塞", x: 0, y: 0, z: 0, explodeX: 0, explodeY: -150, explodeZ: 0, color: "#C0C0C0", shape: "cylinder", width: 80, height: 100 },
    { id: "rod", name: "连杆", x: 0, y: 120, z: 0, explodeX: 0, explodeY: -80, explodeZ: 0, color: "#FFD700", shape: "box", width: 30, height: 100 },
    { id: "crankshaft", name: "曲轴", x: 0, y: 250, z: 0, explodeX: 0, explodeY: 0, explodeZ: 0, color: "#4A90E2", shape: "cylinder", width: 120, height: 40 },
    { id: "cylinder", name: "气缸", x: 0, y: -120, z: 0, explodeX: 0, explodeY: -220, explodeZ: 0, color: "#E27B58", shape: "ring", width: 100, height: 150 },
    { id: "head", name: "缸盖", x: 0, y: -280, z: 0, explodeX: 0, explodeY: -350, explodeZ: 0, color: "#50C878", shape: "box", width: 120, height: 60 },
    { id: "valve", name: "气门", x: -40, y: -250, z: 0, explodeX: -60, explodeY: -400, explodeZ: 0, color: "#9370DB", shape: "cylinder", width: 20, height: 80 },
  ],
  showLabels = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const fps = 30;

  // 爆炸进度（0-1）
  const explodeProgress = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 200,
    },
  });

  // 计算每个零件的当前位置
  const getPartPosition = (part: EnginePart) => {
    const x = part.x + part.explodeX * explodeProgress;
    const y = part.y + part.explodeY * explodeProgress;
    const z = part.z + part.explodeZ * explodeProgress;
    return { x, y, z };
  };

  // 3D 到 2D 投影（简单透视）
  const project3D = (x: number, y: number, z: number) => {
    const perspective = 800;
    const scale = perspective / (perspective + z);
    return {
      x: 540 + x * scale,
      y: 360 + y * scale,
      scale,
    };
  };

  // 绘制圆柱体
  const renderCylinder = (part: EnginePart, pos: { x: number; y: number; z: number }) => {
    const projected = project3D(pos.x, pos.y, pos.z);
    const width = part.width * projected.scale;
    const height = part.height * projected.scale;

    return (
      <g key={part.id}>
        {/* 圆柱体顶部 */}
        <ellipse
          cx={projected.x}
          cy={projected.y - height / 2}
          rx={width / 2}
          ry={width / 4}
          fill={part.color}
          stroke="#333"
          strokeWidth={2}
          style={{
            filter: `drop-shadow(0 4px 8px ${part.color}60)`,
          }}
        />
        {/* 圆柱体侧面 */}
        <rect
          x={projected.x - width / 2}
          y={projected.y - height / 2}
          width={width}
          height={height}
          fill={part.color}
          stroke="#333"
          strokeWidth={2}
          style={{
            filter: `brightness(0.8)`,
          }}
        />
        {/* 圆柱体底部 */}
        <ellipse
          cx={projected.x}
          cy={projected.y + height / 2}
          rx={width / 2}
          ry={width / 4}
          fill={part.color}
          stroke="#333"
          strokeWidth={2}
          style={{
            filter: `brightness(0.6)`,
          }}
        />
      </g>
    );
  };

  // 绘制长方体
  const renderBox = (part: EnginePart, pos: { x: number; y: number; z: number }) => {
    const projected = project3D(pos.x, pos.y, pos.z);
    const width = part.width * projected.scale;
    const height = part.height * projected.scale;

    return (
      <g key={part.id}>
        {/* 主面 */}
        <rect
          x={projected.x - width / 2}
          y={projected.y - height / 2}
          width={width}
          height={height}
          fill={part.color}
          stroke="#333"
          strokeWidth={2}
          style={{
            filter: `drop-shadow(0 4px 8px ${part.color}60)`,
          }}
        />
        {/* 侧面（3D效果） */}
        <polygon
          points={`
            ${projected.x + width / 2},${projected.y - height / 2}
            ${projected.x + width / 2 + 15},${projected.y - height / 2 - 10}
            ${projected.x + width / 2 + 15},${projected.y + height / 2 - 10}
            ${projected.x + width / 2},${projected.y + height / 2}
          `}
          fill={part.color}
          stroke="#333"
          strokeWidth={2}
          style={{
            filter: `brightness(0.7)`,
          }}
        />
        {/* 顶面 */}
        <polygon
          points={`
            ${projected.x - width / 2},${projected.y - height / 2}
            ${projected.x + width / 2},${projected.y - height / 2}
            ${projected.x + width / 2 + 15},${projected.y - height / 2 - 10}
            ${projected.x - width / 2 + 15},${projected.y - height / 2 - 10}
          `}
          fill={part.color}
          stroke="#333"
          strokeWidth={2}
          style={{
            filter: `brightness(0.9)`,
          }}
        />
      </g>
    );
  };

  // 绘制圆环（气缸）
  const renderRing = (part: EnginePart, pos: { x: number; y: number; z: number }) => {
    const projected = project3D(pos.x, pos.y, pos.z);
    const outerWidth = part.width * projected.scale;
    const innerWidth = (part.width - 20) * projected.scale;
    const height = part.height * projected.scale;

    return (
      <g key={part.id}>
        {/* 外圆柱 */}
        <rect
          x={projected.x - outerWidth / 2}
          y={projected.y - height / 2}
          width={outerWidth}
          height={height}
          fill={part.color}
          stroke="#333"
          strokeWidth={2}
          style={{
            filter: `drop-shadow(0 4px 8px ${part.color}60)`,
          }}
        />
        {/* 内圆柱（镂空） */}
        <rect
          x={projected.x - innerWidth / 2}
          y={projected.y - height / 2}
          width={innerWidth}
          height={height}
          fill="#1A1A1A"
          stroke="#333"
          strokeWidth={2}
        />
        {/* 顶部圆环 */}
        <ellipse
          cx={projected.x}
          cy={projected.y - height / 2}
          rx={outerWidth / 2}
          ry={outerWidth / 4}
          fill="none"
          stroke="#333"
          strokeWidth={2}
        />
        <ellipse
          cx={projected.x}
          cy={projected.y - height / 2}
          rx={innerWidth / 2}
          ry={innerWidth / 4}
          fill="none"
          stroke="#333"
          strokeWidth={2}
        />
      </g>
    );
  };

  // 渲染零件
  const renderPart = (part: EnginePart) => {
    const pos = getPartPosition(part);
    
    switch (part.shape) {
      case "cylinder":
        return renderCylinder(part, pos);
      case "box":
        return renderBox(part, pos);
      case "ring":
        return renderRing(part, pos);
      default:
        return null;
    }
  };

  // 进入动画
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
        backgroundColor: "#1A1A1A",
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
      <svg width={1080} height={720} style={{ overflow: "visible" }}>
        <defs>
          {/* 金属质感渐变 */}
          <radialGradient id="metallic">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.8} />
            <stop offset="50%" stopColor="#CCCCCC" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#666666" stopOpacity={0.3} />
          </radialGradient>
        </defs>

        {/* 绘制连接线 */}
        {parts.map((part, index) => {
          if (index < parts.length - 1) {
            const pos1 = getPartPosition(part);
            const pos2 = getPartPosition(parts[index + 1]);
            const proj1 = project3D(pos1.x, pos1.y, pos1.z);
            const proj2 = project3D(pos2.x, pos2.y, pos2.z);
            
            return (
              <line
                key={`connection-${index}`}
                x1={proj1.x}
                y1={proj1.y}
                x2={proj2.x}
                y2={proj2.y}
                stroke="#666"
                strokeWidth={2}
                strokeDasharray="5,5"
                opacity={0.5 * (1 - explodeProgress)}
              />
            );
          }
          return null;
        })}

        {/* 绘制所有零件（按 Z 轴排序） */}
        {parts
          .map(part => ({ part, pos: getPartPosition(part) }))
          .sort((a, b) => a.pos.z - b.pos.z)
          .map(({ part }) => renderPart(part))}

        {/* 零件标签 */}
        {showLabels && parts.map(part => {
          const pos = getPartPosition(part);
          const projected = project3D(pos.x, pos.y, pos.z);
          
          return (
            <g key={`label-${part.id}`}>
              {/* 指示线 */}
              <line
                x1={projected.x}
                y1={projected.y}
                x2={projected.x + 100}
                y2={projected.y - 50}
                stroke="#FFD700"
                strokeWidth={2}
                opacity={explodeProgress}
              />
              {/* 标签背景 */}
              <rect
                x={projected.x + 100}
                y={projected.y - 65}
                width={80}
                height={30}
                fill="#333"
                stroke="#FFD700"
                strokeWidth={2}
                rx={5}
                opacity={explodeProgress}
              />
              {/* 标签文字 */}
              <text
                x={projected.x + 140}
                y={projected.y - 43}
                fill="#FFFFFF"
                fontSize={14}
                fontWeight="bold"
                textAnchor="middle"
                style={{ fontFamily: theme.fonts.body }}
                opacity={explodeProgress}
              >
                {part.name}
              </text>
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
        }}
      >
        🔧 爆炸视图展示发动机内部结构 | 活塞-连杆-曲轴传动机构
      </div>
    </div>
  );
};
