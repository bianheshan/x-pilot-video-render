import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

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
}

/**
 * 神经网络传导
 * 
 * 展示神经元之间的电信号脉冲传递动画
 * 
 * 生物学原理：
 * - 神经元结构（树突、胞体、轴突）
 * - 动作电位
 * - 突触传递
 * - 神经网络
 * 
 * 教学要点：
 * - 神经信号的传递机制
 * - 突触的作用
 * - 神经网络的信息处理
 */
export const BioNeuronNetwork: React.FC<BioNeuronNetworkProps> = ({
  title = "神经网络传导 - 信号传递",
  neuronsPerLayer = [3, 5, 4, 2],
  showSignals = true,
  signalSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 生成神经元位置
  const neurons = useMemo(() => {
    const allNeurons: Neuron[] = [];
    let id = 0;

    const layerSpacing = 1000 / (neuronsPerLayer.length + 1);

    neuronsPerLayer.forEach((count, layerIndex) => {
      const neuronSpacing = 500 / (count + 1);
      
      for (let i = 0; i < count; i++) {
        allNeurons.push({
          id: id++,
          x: 140 + layerIndex * layerSpacing,
          y: 100 + (i + 1) * neuronSpacing,
          layer: layerIndex,
        });
      }
    });

    return allNeurons;
  }, [neuronsPerLayer]);

  // 生成突触连接
  const synapses = useMemo(() => {
    const allSynapses: Synapse[] = [];

    for (let i = 0; i < neurons.length; i++) {
      for (let j = 0; j < neurons.length; j++) {
        const neuron1 = neurons[i];
        const neuron2 = neurons[j];

        // 只连接相邻层
        if (neuron2.layer === neuron1.layer + 1) {
          allSynapses.push({
            from: neuron1.id,
            to: neuron2.id,
            strength: Math.random() * 0.5 + 0.5,
          });
        }
      }
    }

    return allSynapses;
  }, [neurons]);

  // 信号传递动画
  const signals = useMemo(() => {
    if (!showSignals) return [];

    const activeSignals = [];
    const signalDuration = 60 / signalSpeed;

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

  // 神经元激活状态
  const neuronActivation = useMemo(() => {
    const activation = new Map<number, number>();

    neurons.forEach((neuron) => {
      // 输入层持续激活
      if (neuron.layer === 0) {
        activation.set(neuron.id, 0.8 + 0.2 * Math.sin(frame * 0.1));
      } else {
        // 其他层根据信号传递激活
        let totalActivation = 0;
        signals.forEach(({ synapse, progress }) => {
          if (synapse.to === neuron.id && progress > 0.8) {
            totalActivation += synapse.strength * (1 - (progress - 0.8) * 5);
          }
        });
        activation.set(neuron.id, Math.min(totalActivation, 1));
      }
    });

    return activation;
  }, [neurons, signals, frame]);

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
        backgroundColor: "#0A0A0A",
        opacity,
      }}
    >
      {/* 标题 */}
      <h2
        style={{
          fontSize: 42,
          fontWeight: "bold",
          color: "#00D9FF",
          marginBottom: 30,
          fontFamily: theme.fonts.heading,
          textShadow: "0 0 20px rgba(0, 217, 255, 0.5)",
        }}
      >
        {title}
      </h2>

      {/* 主画布 */}
      <svg width={1200} height={600} style={{ overflow: "visible" }}>
        <defs>
          {/* 神经元发光效果 */}
          <radialGradient id="neuronGlow">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="1" />
            <stop offset="50%" stopColor="#0099CC" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0099CC" stopOpacity="0" />
          </radialGradient>

          {/* 信号发光 */}
          <filter id="signalGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 绘制突触连接 */}
        {synapses.map((synapse, index) => {
          const fromNeuron = neurons.find((n) => n.id === synapse.from);
          const toNeuron = neurons.find((n) => n.id === synapse.to);

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

        {/* 绘制信号 */}
        {signals.map(({ synapse, progress }, index) => {
          const fromNeuron = neurons.find((n) => n.id === synapse.from);
          const toNeuron = neurons.find((n) => n.id === synapse.to);

          if (!fromNeuron || !toNeuron) return null;

          const x = fromNeuron.x + (toNeuron.x - fromNeuron.x) * progress;
          const y = fromNeuron.y + (toNeuron.y - fromNeuron.y) * progress;

          return (
            <g key={`signal-${index}`}>
              {/* 信号光晕 */}
              <circle
                cx={x}
                cy={y}
                r={15}
                fill="#FFD700"
                opacity={0.3 * (1 - progress)}
                filter="url(#signalGlow)"
              />
              {/* 信号核心 */}
              <circle
                cx={x}
                cy={y}
                r={6}
                fill="#FFD700"
                filter="url(#signalGlow)"
              />
            </g>
          );
        })}

        {/* 绘制神经元 */}
        {neurons.map((neuron) => {
          const activation = neuronActivation.get(neuron.id) || 0;
          const neuronRadius = 20 + activation * 10;

          return (
            <g key={`neuron-${neuron.id}`}>
              {/* 神经元光晕 */}
              <circle
                cx={neuron.x}
                cy={neuron.y}
                r={neuronRadius * 2}
                fill="url(#neuronGlow)"
                opacity={activation * 0.5}
              />

              {/* 神经元胞体 */}
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

              {/* 神经元ID */}
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

        {/* 层标签 */}
        {neuronsPerLayer.map((_, layerIndex) => {
          const layerSpacing = 1000 / (neuronsPerLayer.length + 1);
          const x = 140 + layerIndex * layerSpacing;

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
              {layerIndex === 0 ? "输入层" : layerIndex === neuronsPerLayer.length - 1 ? "输出层" : `隐藏层${layerIndex}`}
            </text>
          );
        })}
      </svg>

      {/* 说明文字 */}
      <div
        style={{
          marginTop: 20,
          fontSize: 16,
          color: "#00D9FF",
          textAlign: "center",
        }}
      >
        ⚡ 神经信号通过突触在神经元之间传递，形成复杂的信息处理网络
      </div>
    </div>
  );
};
