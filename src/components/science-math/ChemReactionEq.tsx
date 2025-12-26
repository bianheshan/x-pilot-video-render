import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Atom {
  /** 元素符号 */
  symbol: string;
  /** 颜色 */
  color: string;
  /** 数量 */
  count: number;
}

export interface Molecule {
  /** 分子名称 */
  name: string;
  /** 原子组成 */
  atoms: Atom[];
  /** 系数 */
  coefficient: number;
}

export interface ChemReactionEqProps {
  /** 反应物 */
  reactants?: Molecule[];
  /** 生成物 */
  products?: Molecule[];
  /** 反应名称 */
  title?: string;
  /** 是否显示能量变化 */
  showEnergy?: boolean;
  /** 反应类型 */
  reactionType?: "exothermic" | "endothermic";
}

/**
 * 化学方程式配平
 * 
 * 动态展示原子重组过程，从反应物变为生成物
 * 
 * 化学原理：
 * - 质量守恒定律
 * - 原子守恒
 * - 化学计量比
 * 
 * 教学要点：
 * - 化学反应的本质是原子重组
 * - 反应前后原子种类和数量不变
 * - 能量变化（放热/吸热）
 */
export const ChemReactionEq: React.FC<ChemReactionEqProps> = ({
  reactants = [
    {
      name: "H₂",
      coefficient: 2,
      atoms: [{ symbol: "H", color: "#FFFFFF", count: 2 }],
    },
    {
      name: "O₂",
      coefficient: 1,
      atoms: [{ symbol: "O", color: "#FF0000", count: 2 }],
    },
  ],
  products = [
    {
      name: "H₂O",
      coefficient: 2,
      atoms: [
        { symbol: "H", color: "#FFFFFF", count: 2 },
        { symbol: "O", color: "#FF0000", count: 1 },
      ],
    },
  ],
  title = "化学反应：氢气燃烧",
  showEnergy = true,
  reactionType = "exothermic",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 动画阶段
  const stage = useMemo(() => {
    if (frame < 30) return "initial"; // 显示反应物
    if (frame < 90) return "breaking"; // 键断裂
    if (frame < 150) return "forming"; // 键形成
    return "complete"; // 显示生成物
  }, [frame]);

  // 动画进度
  const breakProgress = interpolate(frame, [30, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  const formProgress = interpolate(frame, [90, 150], [0, 1], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 计算原子总数
  const totalAtoms = useMemo(() => {
    const atoms: { symbol: string; color: string; id: number }[] = [];
    let id = 0;

    reactants.forEach((molecule) => {
      for (let i = 0; i < molecule.coefficient; i++) {
        molecule.atoms.forEach((atom) => {
          for (let j = 0; j < atom.count; j++) {
            atoms.push({ symbol: atom.symbol, color: atom.color, id: id++ });
          }
        });
      }
    });

    return atoms;
  }, [reactants]);

  // 原子位置
  const atomPositions = useMemo(() => {
    const positions = totalAtoms.map((atom, index) => {
      // 初始位置（反应物）
      const startX = 200 + (index % 4) * 60;
      const startY = 300 + Math.floor(index / 4) * 60;

      // 中间位置（分散）
      const midX = 640 + (Math.random() - 0.5) * 400;
      const midY = 360 + (Math.random() - 0.5) * 200;

      // 最终位置（生成物）
      const endX = 1000 + (index % 4) * 60;
      const endY = 300 + Math.floor(index / 4) * 60;

      return { atom, startX, startY, midX, midY, endX, endY };
    });

    return positions;
  }, [totalAtoms]);

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
        backgroundColor: "#1A1A2E",
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

      {/* 化学方程式 */}
      <div
        style={{
          fontSize: 32,
          color: "#EAEAEA",
          marginBottom: 40,
          fontFamily: "monospace",
        }}
      >
        {reactants.map((r, i) => (
          <span key={`r-${i}`}>
            {r.coefficient > 1 && r.coefficient}
            {r.name}
            {i < reactants.length - 1 && " + "}
          </span>
        ))}
        <span style={{ margin: "0 20px", color: theme.colors.primary }}>→</span>
        {products.map((p, i) => (
          <span key={`p-${i}`}>
            {p.coefficient > 1 && p.coefficient}
            {p.name}
            {i < products.length - 1 && " + "}
          </span>
        ))}
        {showEnergy && (
          <span style={{ marginLeft: 20, color: reactionType === "exothermic" ? "#FF6B6B" : "#4ECDC4" }}>
            {reactionType === "exothermic" ? "+ 能量 ↑" : "- 能量 ↓"}
          </span>
        )}
      </div>

      {/* 主画布 */}
      <svg width={1200} height={500} style={{ overflow: "visible" }}>
        <defs>
          {/* 原子发光效果 */}
          <filter id="atomGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 反应物标签 */}
        <text
          x={200}
          y={200}
          fill="#EAEAEA"
          fontSize={24}
          fontWeight="bold"
          style={{ fontFamily: theme.fonts.body }}
        >
          反应物
        </text>

        {/* 生成物标签 */}
        <text
          x={1000}
          y={200}
          fill="#EAEAEA"
          fontSize={24}
          fontWeight="bold"
          style={{ fontFamily: theme.fonts.body }}
        >
          生成物
        </text>

        {/* 箭头 */}
        <g opacity={stage === "breaking" || stage === "forming" ? 1 : 0.3}>
          <line
            x1={500}
            y1={360}
            x2={800}
            y2={360}
            stroke={theme.colors.primary}
            strokeWidth={4}
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill={theme.colors.primary} />
            </marker>
          </defs>
        </g>

        {/* 绘制原子 */}
        {atomPositions.map((pos, index) => {
          let x, y;

          if (stage === "initial") {
            x = pos.startX;
            y = pos.startY;
          } else if (stage === "breaking") {
            x = interpolate(breakProgress, [0, 1], [pos.startX, pos.midX]);
            y = interpolate(breakProgress, [0, 1], [pos.startY, pos.midY]);
          } else if (stage === "forming") {
            x = interpolate(formProgress, [0, 1], [pos.midX, pos.endX]);
            y = interpolate(formProgress, [0, 1], [pos.midY, pos.endY]);
          } else {
            x = pos.endX;
            y = pos.endY;
          }

          return (
            <g key={`atom-${index}`}>
              {/* 原子球 */}
              <circle
                cx={x}
                cy={y}
                r={20}
                fill={pos.atom.color}
                filter="url(#atomGlow)"
                style={{
                  filter: `drop-shadow(0 0 10px ${pos.atom.color})`,
                }}
              />
              {/* 元素符号 */}
              <text
                x={x}
                y={y}
                fill="#000000"
                fontSize={16}
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontFamily: theme.fonts.body }}
              >
                {pos.atom.symbol}
              </text>
            </g>
          );
        })}

        {/* 能量变化指示 */}
        {showEnergy && stage === "complete" && (
          <g>
            <rect
              x={500}
              y={450}
              width={300}
              height={40}
              fill={reactionType === "exothermic" ? "#FF6B6B" : "#4ECDC4"}
              opacity={0.3}
              rx={5}
            />
            <text
              x={650}
              y={475}
              fill="#EAEAEA"
              fontSize={18}
              textAnchor="middle"
              style={{ fontFamily: theme.fonts.body }}
            >
              {reactionType === "exothermic" ? "🔥 放热反应" : "❄️ 吸热反应"}
            </text>
          </g>
        )}
      </svg>

      {/* 说明文字 */}
      <div
        style={{
          marginTop: 20,
          fontSize: 16,
          color: "#EAEAEA",
          textAlign: "center",
        }}
      >
        ⚛️ 化学反应的本质是原子重新组合，反应前后原子种类和数量保持不变
      </div>
    </div>
  );
};
