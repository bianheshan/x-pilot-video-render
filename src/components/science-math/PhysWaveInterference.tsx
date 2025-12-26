import React, { useRef, useEffect } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface PhysWaveInterferenceProps {
  /** 标题 */
  title?: string;
  /** 波源数量 */
  sources?: number;
  /** 波长 */
  wavelength?: number;
  /** 振幅 */
  amplitude?: number;
}

/**
 * 波的干涉衍射模拟
 * 
 * 模拟水波或光波的叠加、干涉条纹
 * 适用场景：波动光学、声学、量子力学
 * 
 * 教学要点：
 * - 波的叠加原理
 * - 相长干涉和相消干涉
 * - 双缝干涉实验
 * 
 * 知识准确性：使用波动方程，相位计算精确
 */
export const PhysWaveInterference: React.FC<PhysWaveInterferenceProps> = ({
  title = "波的干涉现象",
  sources = 2,
  wavelength = 40,
  amplitude = 30,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 时间参数
  const time = frame * 0.1;

  // 波源位置
  const getSourcePositions = (width: number, height: number) => {
    const positions: Array<{ x: number; y: number }> = [];
    if (sources === 1) {
      positions.push({ x: width / 2, y: height / 2 });
    } else if (sources === 2) {
      positions.push({ x: width / 2 - 100, y: height / 2 });
      positions.push({ x: width / 2 + 100, y: height / 2 });
    } else {
      for (let i = 0; i < sources; i++) {
        const angle = (i / sources) * Math.PI * 2;
        positions.push({
          x: width / 2 + Math.cos(angle) * 150,
          y: height / 2 + Math.sin(angle) * 150,
        });
      }
    }
    return positions;
  };

  // 计算某点的波幅（所有波源的叠加）
  const calculateAmplitude = (
    x: number,
    y: number,
    sourcePositions: Array<{ x: number; y: number }>
  ): number => {
    let totalAmplitude = 0;

    sourcePositions.forEach((source) => {
      const distance = Math.sqrt(
        Math.pow(x - source.x, 2) + Math.pow(y - source.y, 2)
      );
      
      // 波动方程: A * sin(kx - ωt)
      // k = 2π/λ (波数), ω = 2πf (角频率)
      const k = (2 * Math.PI) / wavelength;
      const phase = k * distance - time;
      
      // 考虑衰减（距离平方反比）
      const attenuation = 1 / (1 + distance / 100);
      
      totalAmplitude += amplitude * Math.sin(phase) * attenuation;
    });

    return totalAmplitude;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 获取波源位置
    const sourcePositions = getSourcePositions(width, height);

    // 创建图像数据
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // 计算每个像素的波幅并着色
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const amp = calculateAmplitude(x, y, sourcePositions);
        
        // 将振幅映射到颜色
        const normalized = (amp + amplitude) / (2 * amplitude); // 归一化到 [0, 1]
        const index = (y * width + x) * 4;

        // 使用颜色映射表示波的强度
        if (normalized > 0.5) {
          // 相长干涉 - 蓝色到白色
          const intensity = (normalized - 0.5) * 2;
          data[index] = 100 + intensity * 155; // R
          data[index + 1] = 150 + intensity * 105; // G
          data[index + 2] = 255; // B
        } else {
          // 相消干涉 - 黑色到蓝色
          const intensity = normalized * 2;
          data[index] = intensity * 100; // R
          data[index + 1] = intensity * 150; // G
          data[index + 2] = intensity * 255; // B
        }
        data[index + 3] = 255; // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // 绘制波源
    sourcePositions.forEach((source, index) => {
      // 波源圆圈（脉动效果）
      const pulseRadius = 10 + 5 * Math.sin(time);
      
      ctx.fillStyle = theme.colors.warning;
      ctx.beginPath();
      ctx.arc(source.x, source.y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = theme.colors.text;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 波源标签
      ctx.fillStyle = theme.colors.text;
      ctx.font = `14px ${theme.fonts.body}`;
      ctx.textAlign = "center";
      ctx.fillText(`S${index + 1}`, source.x, source.y - 20);
    });

    // 绘制图例
    ctx.fillStyle = theme.colors.text;
    ctx.font = `16px ${theme.fonts.body}`;
    ctx.textAlign = "left";
    ctx.fillText("相长干涉", 20, 30);
    ctx.fillStyle = "#6096FF";
    ctx.fillRect(120, 18, 30, 15);
    
    ctx.fillStyle = theme.colors.text;
    ctx.fillText("相消干涉", 20, 60);
    ctx.fillStyle = "#001040";
    ctx.fillRect(120, 48, 30, 15);
  }, [frame, time, sources, wavelength, amplitude, theme]);

  // 进入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], {
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
        backgroundColor: theme.colors.background,
        opacity,
      }}
    >
      {/* 标题 */}
      <h2
        style={{
          fontSize: 48,
          fontWeight: "bold",
          color: theme.colors.text,
          marginBottom: 20,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      {/* 画布 */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: `2px solid ${theme.colors.surfaceLight}`,
          borderRadius: 8,
          boxShadow: `0 4px 20px ${theme.colors.surfaceLight}40`,
        }}
      />

      {/* 说明 */}
      <div
        style={{
          marginTop: 30,
          fontSize: 18,
          color: theme.colors.textSecondary,
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        {sources === 2
          ? "双缝干涉：两列波叠加形成明暗相间的干涉条纹"
          : `${sources} 个波源的干涉图样`}
      </div>

      {/* 参数显示 */}
      <div
        style={{
          marginTop: 15,
          display: "flex",
          gap: 30,
          fontSize: 16,
          color: theme.colors.textSecondary,
          fontFamily: theme.fonts.mono,
        }}
      >
        <div>波长 λ = {wavelength.toFixed(1)} px</div>
        <div>振幅 A = {amplitude.toFixed(1)}</div>
        <div>波源数 = {sources}</div>
      </div>
    </div>
  );
};
