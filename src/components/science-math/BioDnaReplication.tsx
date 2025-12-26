import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface BioDnaReplicationProps {
  /** 标题 */
  title?: string;
  /** DNA序列长度 */
  sequenceLength?: number;
  /** 是否显示碱基配对 */
  showBasePairs?: boolean;
  /** 动画速度 */
  animationSpeed?: number;
}

/**
 * DNA 复制解旋
 * 
 * 展示 DNA 双螺旋解开并复制的过程
 * 
 * 生物学原理：
 * - DNA 双螺旋结构
 * - 碱基互补配对（A-T, G-C）
 * - 半保留复制
 * - 解旋酶、DNA聚合酶的作用
 * 
 * 教学要点：
 * - DNA 结构的美学
 * - 遗传信息的传递
 * - 分子生物学中心法则
 */
export const BioDnaReplication: React.FC<BioDnaReplicationProps> = ({
  title = "DNA 复制 - 生命的传承",
  sequenceLength = 20,
  showBasePairs = true,
  animationSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 碱基颜色
  const baseColors = {
    A: "#FF6B6B", // 腺嘌呤 - 红色
    T: "#4ECDC4", // 胸腺嘧啶 - 青色
    G: "#FFD93D", // 鸟嘌呤 - 黄色
    C: "#95E1D3", // 胞嘧啶 - 绿色
  };

  // 生成随机DNA序列
  const dnaSequence = useMemo(() => {
    const bases = ["A", "T", "G", "C"];
    const sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      const base = bases[Math.floor(Math.random() * bases.length)];
      // 互补配对
      const complement = base === "A" ? "T" : base === "T" ? "A" : base === "G" ? "C" : "G";
      sequence.push({ base, complement, index: i });
    }
    return sequence;
  }, [sequenceLength]);

  // 动画阶段
  const unwindProgress = interpolate(
    frame * animationSpeed,
    [0, 60],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const replicationProgress = interpolate(
    frame * animationSpeed,
    [60, 120],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const centerX = 640;
  const centerY = 360;
  const helixRadius = 80;
  const helixHeight = 600;

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
      {/* 标题 */}
      <h2
        style={{
          fontSize: 42,
          fontWeight: "bold",
          color: "#E0E1DD",
          marginBottom: 30,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      {/* 主画布 */}
      <svg width={1280} height={700} style={{ overflow: "visible" }}>
        <defs>
          {/* 碱基发光效果 */}
          <filter id="baseGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 渐变 */}
          <linearGradient id="backboneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#778DA9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#415A77" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* 绘制DNA双螺旋 */}
        {dnaSequence.map((pair, i) => {
          const t = (i / sequenceLength) * Math.PI * 4; // 螺旋角度
          const y = (i / sequenceLength) * helixHeight + 50;

          // 解旋动画
          const unwindOffset = unwindProgress * 200 * (i / sequenceLength);

          // 左链位置
          const x1 = centerX - helixRadius * Math.cos(t) - unwindOffset;
          const z1 = helixRadius * Math.sin(t);

          // 右链位置
          const x2 = centerX + helixRadius * Math.cos(t) + unwindOffset;
          const z2 = -helixRadius * Math.sin(t);

          // 深度排序（简单的伪3D）
          const opacity1 = 0.5 + 0.5 * ((z1 + helixRadius) / (2 * helixRadius));
          const opacity2 = 0.5 + 0.5 * ((z2 + helixRadius) / (2 * helixRadius));

          return (
            <g key={`pair-${i}`}>
              {/* 氢键（碱基配对） */}
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

              {/* 左链碱基 */}
              <circle
                cx={x1}
                cy={y}
                r={12}
                fill={baseColors[pair.base as keyof typeof baseColors]}
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

              {/* 右链碱基 */}
              <circle
                cx={x2}
                cy={y}
                r={12}
                fill={baseColors[pair.complement as keyof typeof baseColors]}
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

              {/* 新合成的链（复制） */}
              {replicationProgress > 0 && i < sequenceLength * replicationProgress && (
                <>
                  {/* 左侧新链 */}
                  <circle
                    cx={x1 - 40}
                    cy={y}
                    r={10}
                    fill={baseColors[pair.complement as keyof typeof baseColors]}
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

                  {/* 右侧新链 */}
                  <circle
                    cx={x2 + 40}
                    cy={y}
                    r={10}
                    fill={baseColors[pair.base as keyof typeof baseColors]}
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

        {/* 解旋酶标记 */}
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

        {/* DNA聚合酶标记 */}
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

      {/* 碱基配对说明 */}
      {showBasePairs && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 30,
            fontSize: 16,
            color: "#E0E1DD",
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
          <div>🧬 半保留复制：每条新DNA包含一条旧链和一条新链</div>
        </div>
      )}
    </div>
  );
};
