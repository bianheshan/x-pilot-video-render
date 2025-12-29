import React, { useMemo } from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

type Seed = string | number;

export interface Neuron {
  id: number;
  x: number;
  y: number;
  layer: number;
}

export interface Synapse {
  from: number;
  to: number;
  strength: number;
}

export interface BioNeuronNetworkProps {
  /** 标题 */
  title?: string;
  /** 每层神经元数量 */
  neuronsPerLayer?: number[];
  /** 是否显示信号传递 */
  showSignals?: boolean;
  /** 信号传递速度 */
  signalSpeed?: number;
  /** Deterministic seed (avoid Math.random). */
  seed?: Seed;
}

/**
 * 神经网络传导（示意）
 * - 可复现：不使用 Math.random
 */
export const BioNeuronNetwork: React.FC<BioNeuronNetworkProps> = ({
  title = "神经网络传导 - 信号传递",
  neuronsPerLayer = [3, 5, 4, 2],
  showSignals = true,
  signalSpeed = 1,
  seed,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const { width: videoW, height: videoH } = useVideoConfig();

  const seedBase = (seed ?? "BioNeuronNetwork").toString();

  const svgW = Math.min(1200, Math.max(900, videoW - 200));
  const svgH = Math.min(650, Math.max(520, Math.floor(videoH * 0.62)));

  const neurons = useMemo(() => {
    const allNeurons: Neuron[] = [];
    let id = 0;

    const layerSpacing = (svgW - 200) / (neuronsPerLayer.length + 1);

    neuronsPerLayer.forEach((count, layerIndex) => {
      const neuronSpacing = (svgH - 160) / (count + 1);

      for (let i = 0; i < count; i++) {
        allNeurons.push({
          id: id++,
          x: 100 + (layerIndex + 1) * layerSpacing,
          y: 80 + (i + 1) * neuronSpacing,
          layer: layerIndex,
        });
      }
    });

    return allNeurons;
  }, [neuronsPerLayer, svgH, svgW]);

  const neuronById = useMemo(() => {
    const map = new Map<number, Neuron>();
    for (const n of neurons) map.set(n.id, n);
    return map;
  }, [neurons]);

  const synapses = useMemo(() => {
    const allSynapses: Synapse[] = [];

    for (let i = 0; i < neurons.length; i++) {
      const n1 = neurons[i];
      for (let j = 0; j < neurons.length; j++) {
        const n2 = neurons[j];
        if (n2.layer === n1.layer + 1) {
          allSynapses.push({
            from: n1.id,
            to: n2.id,
            strength: random(`${seedBase}:syn:${n1.id}->${n2.id}`) * 0.5 + 0.5,
          });
        }
      }
    }

    return allSynapses;
  }, [neurons, seedBase]);

  const signals = useMemo(() => {
    if (!showSignals) return [] as { synapse: Synapse; progress: number }[];

    const activeSignals: { synapse: Synapse; progress: number }[] = [];
    const signalDuration = 60 / Math.max(0.1, signalSpeed);

    for (let i = 0; i < synapses.length; i++) {
      const synapse = synapses[i];
      const startFrame = (i * 3) % 120;

      if (frame >= startFrame && frame < startFrame + signalDuration) {
        const progress = (frame - startFrame) / signalDuration;
        activeSignals.push({ synapse, progress });
      }
    }

    return activeSignals;
  }, [frame, synapses, showSignals, signalSpeed]);

  const neuronActivation = useMemo(() => {
    const activation = new Map<number, number>();

    for (const neuron of neurons) {
      if (neuron.layer === 0) {
        activation.set(neuron.id, 0.8 + 0.2 * Math.sin(frame * 0.1));
        continue;
      }

      let totalActivation = 0;
      for (const { synapse, progress } of signals) {
        if (synapse.to === neuron.id && progress > 0.8) {
          totalActivation += synapse.strength * (1 - (progress - 0.8) * 5);
        }
      }
      activation.set(neuron.id, Math.min(totalActivation, 1));
    }

    return activation;
  }, [neurons, signals, frame]);

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

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
        backgroundColor: "#0A0A0A",
        opacity,
      }}
    >
      <h2
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: "#00D9FF",
          marginBottom: 30,
          fontFamily: theme.fonts.heading,
          textShadow: "0 0 20px rgba(0, 217, 255, 0.5)",
        }}
      >
        {title}
      </h2>

      <svg width={svgW} height={svgH} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="neuronGlow">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="1" />
            <stop offset="50%" stopColor="#0099CC" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0099CC" stopOpacity="0" />
          </radialGradient>

          <filter id="signalGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {synapses.map((synapse, index) => {
          const fromNeuron = neuronById.get(synapse.from);
          const toNeuron = neuronById.get(synapse.to);
          if (!fromNeuron || !toNeuron) return null;

          return (
            <line
              key={`synapse-${index}`}
              x1={fromNeuron.x}
              y1={fromNeuron.y}
              x2={toNeuron.x}
              y2={toNeuron.y}
              stroke="#00D9FF"
              strokeWidth={synapse.strength * 2}
              opacity={0.2}
            />
          );
        })}

        {signals.map(({ synapse, progress }, index) => {
          const fromNeuron = neuronById.get(synapse.from);
          const toNeuron = neuronById.get(synapse.to);
          if (!fromNeuron || !toNeuron) return null;

          const x = fromNeuron.x + (toNeuron.x - fromNeuron.x) * progress;
          const y = fromNeuron.y + (toNeuron.y - fromNeuron.y) * progress;

          return (
            <g key={`signal-${index}`}>
              <circle
                cx={x}
                cy={y}
                r={15}
                fill="#FFD700"
                opacity={0.3 * (1 - progress)}
                filter="url(#signalGlow)"
              />
              <circle cx={x} cy={y} r={6} fill="#FFD700" filter="url(#signalGlow)" />
            </g>
          );
        })}

        {neurons.map((neuron) => {
          const activation = neuronActivation.get(neuron.id) || 0;
          const neuronRadius = 20 + activation * 10;

          return (
            <g key={`neuron-${neuron.id}`}>
              <circle
                cx={neuron.x}
                cy={neuron.y}
                r={neuronRadius * 2}
                fill="url(#neuronGlow)"
                opacity={activation * 0.5}
              />

              <circle
                cx={neuron.x}
                cy={neuron.y}
                r={neuronRadius}
                fill={activation > 0.5 ? "#FFD700" : "#00D9FF"}
                stroke="#FFFFFF"
                strokeWidth={2}
                style={{
                  filter: `drop-shadow(0 0 ${activation * 20}px ${activation > 0.5 ? "#FFD700" : "#00D9FF"})`,
                }}
              />

              <text
                x={neuron.x}
                y={neuron.y}
                fill="#000000"
                fontSize={12}
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontFamily: theme.fonts.body }}
              >
                {neuron.id}
              </text>
            </g>
          );
        })}

        {neuronsPerLayer.map((_, layerIndex) => {
          const layerSpacing = (svgW - 200) / (neuronsPerLayer.length + 1);
          const x = 100 + (layerIndex + 1) * layerSpacing;

          return (
            <text
              key={`layer-${layerIndex}`}
              x={x}
              y={30}
              fill="#00D9FF"
              fontSize={16}
              fontWeight="bold"
              textAnchor="middle"
              style={{ fontFamily: theme.fonts.body }}
            >
              {layerIndex === 0
                ? "输入层"
                : layerIndex === neuronsPerLayer.length - 1
                  ? "输出层"
                  : `隐藏层${layerIndex}`}
            </text>
          );
        })}
      </svg>

      <div
        style={{
          marginTop: 20,
          fontSize: 16,
          color: "#00D9FF",
          textAlign: "center",
          maxWidth: 1100,
        }}
      >
        神经信号通过突触在神经元之间传递，形成复杂的信息处理网络。
      </div>
    </div>
  );
};
