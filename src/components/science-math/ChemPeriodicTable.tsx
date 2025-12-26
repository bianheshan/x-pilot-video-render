import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  category: string;
  color: string;
}

export interface ChemPeriodicTableProps {
  /** 标题 */
  title?: string;
  /** 显示模式 */
  displayMode?: "2d" | "3d-spiral" | "3d-sphere";
  /** 是否显示元素名称 */
  showNames?: boolean;
  /** 动画速度 */
  animationSpeed?: number;
}

/**
 * 3D 元素周期表
 * 
 * 周期表在 3D 空间呈螺旋或球状排列
 * 
 * 化学原理：
 * - 元素周期律
 * - 电子层结构
 * - 元素分类（金属、非金属、稀有气体等）
 * 
 * 教学要点：
 * - 周期表的结构和规律
 * - 元素性质的周期性变化
 * - 电子排布与化学性质的关系
 */
export const ChemPeriodicTable: React.FC<ChemPeriodicTableProps> = ({
  title = "元素周期表 - 3D 螺旋",
  displayMode = "3d-spiral",
  showNames = true,
  animationSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 简化的元素数据（前36个元素）
  const elements: Element[] = useMemo(() => [
    { symbol: "H", name: "氢", atomicNumber: 1, category: "nonmetal", color: "#FFFFFF" },
    { symbol: "He", name: "氦", atomicNumber: 2, category: "noble", color: "#D9FFFF" },
    { symbol: "Li", name: "锂", atomicNumber: 3, category: "alkali", color: "#CC80FF" },
    { symbol: "Be", name: "铍", atomicNumber: 4, category: "alkaline", color: "#C2FF00" },
    { symbol: "B", name: "硼", atomicNumber: 5, category: "metalloid", color: "#FFB5B5" },
    { symbol: "C", name: "碳", atomicNumber: 6, category: "nonmetal", color: "#909090" },
    { symbol: "N", name: "氮", atomicNumber: 7, category: "nonmetal", color: "#3050F8" },
    { symbol: "O", name: "氧", atomicNumber: 8, category: "nonmetal", color: "#FF0D0D" },
    { symbol: "F", name: "氟", atomicNumber: 9, category: "halogen", color: "#90E050" },
    { symbol: "Ne", name: "氖", atomicNumber: 10, category: "noble", color: "#B3E3F5" },
    { symbol: "Na", name: "钠", atomicNumber: 11, category: "alkali", color: "#AB5CF2" },
    { symbol: "Mg", name: "镁", atomicNumber: 12, category: "alkaline", color: "#8AFF00" },
    { symbol: "Al", name: "铝", atomicNumber: 13, category: "metal", color: "#BFA6A6" },
    { symbol: "Si", name: "硅", atomicNumber: 14, category: "metalloid", color: "#F0C8A0" },
    { symbol: "P", name: "磷", atomicNumber: 15, category: "nonmetal", color: "#FF8000" },
    { symbol: "S", name: "硫", atomicNumber: 16, category: "nonmetal", color: "#FFFF30" },
    { symbol: "Cl", name: "氯", atomicNumber: 17, category: "halogen", color: "#1FF01F" },
    { symbol: "Ar", name: "氩", atomicNumber: 18, category: "noble", color: "#80D1E3" },
    { symbol: "K", name: "钾", atomicNumber: 19, category: "alkali", color: "#8F40D4" },
    { symbol: "Ca", name: "钙", atomicNumber: 20, category: "alkaline", color: "#3DFF00" },
    { symbol: "Fe", name: "铁", atomicNumber: 26, category: "transition", color: "#E06633" },
    { symbol: "Cu", name: "铜", atomicNumber: 29, category: "transition", color: "#C88033" },
    { symbol: "Zn", name: "锌", atomicNumber: 30, category: "transition", color: "#7D80B0" },
    { symbol: "Ag", name: "银", atomicNumber: 47, category: "transition", color: "#C0C0C0" },
    { symbol: "Au", name: "金", atomicNumber: 79, category: "transition", color: "#FFD123" },
  ], []);

  // 旋转角度
  const rotation = interpolate(
    frame * animationSpeed,
    [0, 120],
    [0, Math.PI * 2],
    { extrapolateRight: "wrap" }
  );

  // 计算元素位置
  const elementPositions = useMemo(() => {
    return elements.map((element, index) => {
      if (displayMode === "3d-spiral") {
        // 螺旋排列
        const angle = (index / elements.length) * Math.PI * 4;
        const radius = 200 + index * 5;
        const height = index * 20 - 250;
        
        const x = 640 + radius * Math.cos(angle + rotation);
        const y = 360 + height * 0.5;
        const z = radius * Math.sin(angle + rotation);
        
        return { element, x, y, z, scale: 1 + z / 500 };
      } else if (displayMode === "3d-sphere") {
        // 球面排列
        const phi = Math.acos(-1 + (2 * index) / elements.length);
        const theta = Math.sqrt(elements.length * Math.PI) * phi + rotation;
        
        const radius = 300;
        const x = 640 + radius * Math.sin(phi) * Math.cos(theta);
        const y = 360 + radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        return { element, x, y, z, scale: 1 + z / 500 };
      } else {
        // 2D 传统排列
        const period = Math.ceil(Math.sqrt(index + 1));
        const group = index - (period - 1) * (period - 1);
        
        const x = 100 + group * 60;
        const y = 100 + period * 60;
        
        return { element, x, y, z: 0, scale: 1 };
      }
    });
  }, [elements, displayMode, rotation]);

  // 按 z 值排序（远的先画）
  const sortedPositions = useMemo(() => {
    return [...elementPositions].sort((a, b) => a.z - b.z);
  }, [elementPositions]);

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
        backgroundColor: "#0A0E27",
        opacity,
      }}
    >
      {/* 标题 */}
      <h2
        style={{
          fontSize: 42,
          fontWeight: "bold",
          color: "#EAEAEA",
          marginBottom: 30,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      {/* 主画布 */}
      <svg width={1280} height={650} style={{ overflow: "visible" }}>
        <defs>
          {/* 元素发光效果 */}
          <filter id="elementGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 绘制元素 */}
        {sortedPositions.map((pos, index) => {
          const size = 40 * pos.scale;
          const elementOpacity = 0.5 + 0.5 * pos.scale;

          return (
            <g key={`element-${pos.element.atomicNumber}`}>
              {/* 元素方块 */}
              <rect
                x={pos.x - size / 2}
                y={pos.y - size / 2}
                width={size}
                height={size}
                fill={pos.element.color}
                stroke="#FFFFFF"
                strokeWidth={2}
                rx={5}
                opacity={elementOpacity}
                filter="url(#elementGlow)"
                style={{
                  filter: `drop-shadow(0 0 8px ${pos.element.color})`,
                }}
              />

              {/* 原子序数 */}
              <text
                x={pos.x}
                y={pos.y - size / 4}
                fill="#000000"
                fontSize={10 * pos.scale}
                fontWeight="bold"
                textAnchor="middle"
                opacity={elementOpacity}
                style={{ fontFamily: theme.fonts.body }}
              >
                {pos.element.atomicNumber}
              </text>

              {/* 元素符号 */}
              <text
                x={pos.x}
                y={pos.y + size / 6}
                fill="#000000"
                fontSize={16 * pos.scale}
                fontWeight="bold"
                textAnchor="middle"
                opacity={elementOpacity}
                style={{ fontFamily: theme.fonts.body }}
              >
                {pos.element.symbol}
              </text>

              {/* 元素名称 */}
              {showNames && (
                <text
                  x={pos.x}
                  y={pos.y + size / 2 + 15}
                  fill="#EAEAEA"
                  fontSize={10 * pos.scale}
                  textAnchor="middle"
                  opacity={elementOpacity * 0.8}
                  style={{ fontFamily: theme.fonts.body }}
                >
                  {pos.element.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* 图例 */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          gap: 20,
          fontSize: 14,
          color: "#EAEAEA",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, backgroundColor: "#CC80FF", borderRadius: 3 }} />
          <span>碱金属</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, backgroundColor: "#C2FF00", borderRadius: 3 }} />
          <span>碱土金属</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, backgroundColor: "#E06633", borderRadius: 3 }} />
          <span>过渡金属</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, backgroundColor: "#90E050", borderRadius: 3 }} />
          <span>卤素</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, backgroundColor: "#D9FFFF", borderRadius: 3 }} />
          <span>稀有气体</span>
        </div>
      </div>
    </div>
  );
};
