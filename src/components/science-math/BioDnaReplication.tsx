import React, { useMemo } from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

type Seed = string | number;

type Base = "A" | "T" | "G" | "C";

export interface BioDnaReplicationProps {
  /** 标题 */
  title?: string;
  /** DNA 序列长度（当未提供 sequence 时生效） */
  sequenceLength?: number;
  /** 指定 DNA 序列（例如 "ATGCCGTA"）。提供后将完全确定、可复现。 */
  sequence?: string;
  /** Deterministic seed (used only when sequence is not provided). */
  seed?: Seed;
  /** 是否显示碱基配对 */
  showBasePairs?: boolean;
  /** 动画速度 */
  animationSpeed?: number;
}

/**
 * DNA 复制解旋（示意）
 * - 可复现：不使用 Math.random
 * - 教学准确性：默认序列可由 props 明确指定
 */
export const BioDnaReplication: React.FC<BioDnaReplicationProps> = ({
  title = "DNA 复制 - 生命的传承",
  sequenceLength = 20,
  sequence,
  seed,
  showBasePairs = true,
  animationSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const { width: videoW, height: videoH } = useVideoConfig();

  const seedBase = (seed ?? "BioDnaReplication").toString();

  const baseColors: Record<Base, string> = {
    A: "#FF6B6B",
    T: "#4ECDC4",
    G: "#FFD93D",
    C: "#95E1D3",
  };

  const dnaSequence = useMemo(() => {
    const bases: Base[] = ["A", "T", "G", "C"];

    const raw = (sequence ?? "").toUpperCase().replaceAll(/[^ATGC]/g, "");
    const len = raw.length > 0 ? raw.length : Math.max(1, Math.floor(sequenceLength));

    const out: { base: Base; complement: Base; index: number }[] = [];

    for (let i = 0; i < len; i++) {
      const base: Base = raw.length > 0
        ? (raw[i] as Base)
        : bases[Math.floor(random(`${seedBase}:base:${i}`) * bases.length)];

      const complement: Base = base === "A" ? "T" : base === "T" ? "A" : base === "G" ? "C" : "G";
      out.push({ base, complement, index: i });
    }

    return out;
  }, [seedBase, sequence, sequenceLength]);

  const unwindProgress = interpolate(frame * animationSpeed, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const replicationProgress = interpolate(frame * animationSpeed, [60, 120], [0, 1], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const svgWidth = videoW;
  const svgHeight = Math.max(520, Math.min(820, videoH - 260));

  const centerX = svgWidth / 2;
  const helixRadius = Math.min(110, Math.max(70, Math.floor(svgWidth * 0.06)));
  const helixHeight = svgHeight - 100;

  const sequenceCount = dnaSequence.length;

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
        backgroundColor: "#0D1B2A",
        opacity,
      }}
    >
      <h2
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: "#E0E1DD",
          marginBottom: 30,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      <svg width={svgWidth} height={svgHeight} style={{ overflow: "visible" }}>
        <defs>
          <filter id="baseGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="backboneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#778DA9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#415A77" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {dnaSequence.map((pair, i) => {
          const t = (i / sequenceCount) * Math.PI * 4;
          const y = (i / sequenceCount) * helixHeight + 50;

          const unwindOffset = unwindProgress * (helixRadius * 2.2) * (i / sequenceCount);

          const x1 = centerX - helixRadius * Math.cos(t) - unwindOffset;
          const z1 = helixRadius * Math.sin(t);

          const x2 = centerX + helixRadius * Math.cos(t) + unwindOffset;
          const z2 = -helixRadius * Math.sin(t);

          const opacity1 = 0.5 + 0.5 * ((z1 + helixRadius) / (2 * helixRadius));
          const opacity2 = 0.5 + 0.5 * ((z2 + helixRadius) / (2 * helixRadius));

          return (
            <g key={`pair-${i}`}>
              {showBasePairs && unwindProgress < 0.8 && (
                <line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="#778DA9"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                  opacity={0.3 * (1 - unwindProgress)}
                />
              )}

              <circle
                cx={x1}
                cy={y}
                r={12}
                fill={baseColors[pair.base]}
                opacity={opacity1}
                filter="url(#baseGlow)"
              />
              <text
                x={x1}
                y={y}
                fill="#000"
                fontSize={10}
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={opacity1}
                style={{ fontFamily: theme.fonts.body }}
              >
                {pair.base}
              </text>

              <circle
                cx={x2}
                cy={y}
                r={12}
                fill={baseColors[pair.complement]}
                opacity={opacity2}
                filter="url(#baseGlow)"
              />
              <text
                x={x2}
                y={y}
                fill="#000"
                fontSize={10}
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={opacity2}
                style={{ fontFamily: theme.fonts.body }}
              >
                {pair.complement}
              </text>

              {replicationProgress > 0 && i < sequenceCount * replicationProgress && (
                <>
                  <circle
                    cx={x1 - 40}
                    cy={y}
                    r={10}
                    fill={baseColors[pair.complement]}
                    opacity={0.7}
                    filter="url(#baseGlow)"
                  />
                  <text
                    x={x1 - 40}
                    y={y}
                    fill="#000"
                    fontSize={9}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {pair.complement}
                  </text>

                  <circle
                    cx={x2 + 40}
                    cy={y}
                    r={10}
                    fill={baseColors[pair.base]}
                    opacity={0.7}
                    filter="url(#baseGlow)"
                  />
                  <text
                    x={x2 + 40}
                    y={y}
                    fill="#000"
                    fontSize={9}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {pair.base}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {unwindProgress > 0 && unwindProgress < 1 && (
          <g>
            <circle
              cx={centerX}
              cy={50 + helixHeight * unwindProgress * 0.5}
              r={30}
              fill="#FFD93D"
              opacity={0.6}
            />
            <text
              x={centerX}
              y={50 + helixHeight * unwindProgress * 0.5}
              fill="#000"
              fontSize={12}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontFamily: theme.fonts.body }}
            >
              解旋酶
            </text>
          </g>
        )}

        {replicationProgress > 0 && (
          <>
            <circle
              cx={centerX - helixRadius - 40}
              cy={50 + helixHeight * replicationProgress * 0.5}
              r={25}
              fill="#95E1D3"
              opacity={0.6}
            />
            <text
              x={centerX - helixRadius - 40}
              y={50 + helixHeight * replicationProgress * 0.5}
              fill="#000"
              fontSize={10}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontFamily: theme.fonts.body }}
            >
              聚合酶
            </text>
          </>
        )}
      </svg>

      {showBasePairs && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 30,
            fontSize: 16,
            color: "#E0E1DD",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 20, backgroundColor: baseColors.A, borderRadius: "50%" }} />
            <span>A - T</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 20, backgroundColor: baseColors.G, borderRadius: "50%" }} />
            <span>G - C</span>
          </div>
          <div>半保留复制：每条新 DNA 包含一条旧链和一条新链</div>
        </div>
      )}
    </div>
  );
};
