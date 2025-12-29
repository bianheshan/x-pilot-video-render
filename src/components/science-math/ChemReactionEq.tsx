import React, { useMemo } from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

type Seed = string | number;

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
  /** Deterministic seed (avoid Math.random). */
  seed?: Seed;
}

/**
 * 化学方程式配平（示意）
 * - 原子守恒：反应前后原子种类和数量不变
 * - 动效可复现：不使用 Math.random
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
  seed,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const { width: videoW, height: videoH } = useVideoConfig();

  const seedBase = (seed ?? "ChemReactionEq").toString();

  const stage = useMemo(() => {
    if (frame < 30) return "initial";
    if (frame < 90) return "breaking";
    if (frame < 150) return "forming";
    return "complete";
  }, [frame]);

  const breakProgress = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: "clamp" });
  const formProgress = interpolate(frame, [90, 150], [0, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

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

  const svgW = Math.min(1200, Math.max(900, videoW - 240));
  const svgH = Math.min(520, Math.max(440, Math.floor(videoH * 0.5)));

  const reactantX = Math.round(svgW * 0.18);
  const productX = Math.round(svgW * 0.82);
  const midX = Math.round(svgW * 0.5);
  const midY = Math.round(svgH * 0.5);

  const atomPositions = useMemo(() => {
    return totalAtoms.map((atom, index) => {
      const startX = reactantX - 120 + (index % 4) * 60;
      const startY = midY - 80 + Math.floor(index / 4) * 60;

      const randX = random(`${seedBase}:midX:${atom.id}`);
      const randY = random(`${seedBase}:midY:${atom.id}`);
      const scatterX = (randX - 0.5) * (svgW * 0.32);
      const scatterY = (randY - 0.5) * (svgH * 0.35);

      const midScatterX = midX + scatterX;
      const midScatterY = midY + scatterY;

      const endX = productX - 120 + (index % 4) * 60;
      const endY = midY - 80 + Math.floor(index / 4) * 60;

      return {
        atom,
        startX,
        startY,
        midX: midScatterX,
        midY: midScatterY,
        endX,
        endY,
      };
    });
  }, [midX, midY, productX, reactantX, seedBase, svgH, svgW, totalAtoms]);

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
        backgroundColor: theme.colors.background,
        opacity,
      }}
    >
      <h2
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: theme.colors.text,
          marginBottom: 30,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      <div
        style={{
          fontSize: 32,
          color: theme.colors.text,
          marginBottom: 40,
          fontFamily: theme.fonts.mono,
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
          <span
            style={{
              marginLeft: 20,
              color: reactionType === "exothermic" ? "#FF6B6B" : "#4ECDC4",
            }}
          >
            {reactionType === "exothermic" ? "+ 能量 ↑" : "- 能量 ↓"}
          </span>
        )}
      </div>

      <svg width={svgW} height={svgH} style={{ overflow: "visible" }}>
        <defs>
          <filter id="atomGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <text
          x={reactantX - 120}
          y={Math.round(svgH * 0.22)}
          fill={theme.colors.text}
          fontSize={24}
          fontWeight="bold"
          style={{ fontFamily: theme.fonts.body }}
        >
          反应物
        </text>

        <text
          x={productX - 120}
          y={Math.round(svgH * 0.22)}
          fill={theme.colors.text}
          fontSize={24}
          fontWeight="bold"
          style={{ fontFamily: theme.fonts.body }}
        >
          生成物
        </text>

        <g opacity={stage === "breaking" || stage === "forming" ? 1 : 0.3}>
          <line
            x1={Math.round(svgW * 0.42)}
            y1={midY}
            x2={Math.round(svgW * 0.58)}
            y2={midY}
            stroke={theme.colors.primary}
            strokeWidth={4}
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill={theme.colors.primary} />
            </marker>
          </defs>
        </g>

        {atomPositions.map((pos, index) => {
          let x: number;
          let y: number;

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
              <circle
                cx={x}
                cy={y}
                r={20}
                fill={pos.atom.color}
                filter="url(#atomGlow)"
                style={{ filter: `drop-shadow(0 0 10px ${pos.atom.color})` }}
              />
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

        {showEnergy && stage === "complete" && (
          <g>
            <rect
              x={Math.round(svgW * 0.42)}
              y={Math.round(svgH * 0.86)}
              width={Math.round(svgW * 0.25)}
              height={40}
              fill={reactionType === "exothermic" ? "#FF6B6B" : "#4ECDC4"}
              opacity={0.3}
              rx={5}
            />
            <text
              x={Math.round(svgW * 0.545)}
              y={Math.round(svgH * 0.86) + 25}
              fill={theme.colors.text}
              fontSize={18}
              textAnchor="middle"
              style={{ fontFamily: theme.fonts.body }}
            >
              {reactionType === "exothermic" ? "放热反应" : "吸热反应"}
            </text>
          </g>
        )}
      </svg>

      <div
        style={{
          marginTop: 20,
          fontSize: 16,
          color: theme.colors.textSecondary,
          textAlign: "center",
          maxWidth: 1000,
        }}
      >
        化学反应的本质是原子重新组合；反应前后原子种类和数量保持不变。
      </div>
    </div>
  );
};
