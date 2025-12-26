import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TechPixelGridProps {
  gridSize?: number;
  showKernel?: boolean;
  operation?: "blur" | "sharpen" | "edge" | "none";
  animateKernel?: boolean;
}

export const TechPixelGrid: React.FC<TechPixelGridProps> = ({
  gridSize = 16,
  showKernel = true,
  operation = "blur",
  animateKernel = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 生成随机像素数据
  const pixelData = useMemo(() => {
    const data: number[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: number[] = [];
      for (let x = 0; x < gridSize; x++) {
        // 创建一个简单的图案
        const value =
          Math.sin(x * 0.5) * Math.cos(y * 0.5) * 0.5 + 0.5;
        row.push(value);
      }
      data.push(row);
    }
    return data;
  }, [gridSize]);

  // 卷积核
  const kernels = {
    blur: [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ],
    sharpen: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    edge: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    none: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
  };

  const kernel = kernels[operation];

  // 卷积核位置动画
  const kernelX = animateKernel
    ? Math.floor(interpolate(frame, [0, 120], [0, gridSize - 3], {
        extrapolateRight: "clamp",
      }))
    : 0;
  const kernelY = animateKernel
    ? Math.floor(interpolate(frame, [0, 120], [0, gridSize - 3], {
        extrapolateRight: "clamp",
      }))
    : 0;

  // 应用卷积
  const applyConvolution = (x: number, y: number): number => {
    if (
      x < kernelX ||
      x >= kernelX + 3 ||
      y < kernelY ||
      y >= kernelY + 3
    ) {
      return pixelData[y][x];
    }

    let sum = 0;
    for (let ky = 0; ky < 3; ky++) {
      for (let kx = 0; kx < 3; kx++) {
        const px = x - kernelX + kx - 1;
        const py = y - kernelY + ky - 1;
        if (px >= 0 && px < gridSize && py >= 0 && py < gridSize) {
          sum += pixelData[py][px] * kernel[ky][kx];
        }
      }
    }
    return Math.max(0, Math.min(1, sum));
  };

  const cellSize = 25;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <svg width="1080" height="720">
        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="28"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          🔲 Image Convolution ({operation})
        </text>

        {/* 原始像素网格 */}
        <g transform="translate(100, 100)">
          <text
            x={gridSize * cellSize / 2}
            y="-10"
            fill={theme.colors.text}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="'Fira Code', monospace"
          >
            Input
          </text>
          {pixelData.map((row, y) =>
            row.map((value, x) => (
              <rect
                key={`input-${x}-${y}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize - 1}
                height={cellSize - 1}
                fill={`rgb(${value * 255}, ${value * 255}, ${value * 255})`}
                stroke={theme.colors.text}
                strokeWidth="0.5"
              />
            ))
          )}

          {/* 卷积核高亮 */}
          {showKernel && (
            <rect
              x={kernelX * cellSize}
              y={kernelY * cellSize}
              width={cellSize * 3}
              height={cellSize * 3}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth="3"
            />
          )}
        </g>

        {/* 处理后的像素网格 */}
        <g transform="translate(600, 100)">
          <text
            x={gridSize * cellSize / 2}
            y="-10"
            fill={theme.colors.text}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="'Fira Code', monospace"
          >
            Output
          </text>
          {pixelData.map((row, y) =>
            row.map((_, x) => {
              const value = applyConvolution(x, y);
              return (
                <rect
                  key={`output-${x}-${y}`}
                  x={x * cellSize}
                  y={y * cellSize}
                  width={cellSize - 1}
                  height={cellSize - 1}
                  fill={`rgb(${value * 255}, ${value * 255}, ${value * 255})`}
                  stroke={theme.colors.text}
                  strokeWidth="0.5"
                />
              );
            })
          )}
        </g>

        {/* 卷积核显示 */}
        {showKernel && (
          <g transform="translate(350, 550)">
            <text
              x="75"
              y="-10"
              fill={theme.colors.text}
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="'Fira Code', monospace"
            >
              Kernel ({operation})
            </text>
            {kernel.map((row, y) =>
              row.map((value, x) => (
                <g key={`kernel-${x}-${y}`}>
                  <rect
                    x={x * 50}
                    y={y * 50}
                    width={49}
                    height={49}
                    fill={value > 0 ? theme.colors.primary : theme.colors.accent}
                    stroke={theme.colors.text}
                    strokeWidth="2"
                    opacity={Math.abs(value) * 0.8 + 0.2}
                  />
                  <text
                    x={x * 50 + 25}
                    y={y * 50 + 30}
                    fill="#FFFFFF"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="'Fira Code', monospace"
                  >
                    {value.toFixed(2)}
                  </text>
                </g>
              ))
            )}
          </g>
        )}

        {/* 箭头 */}
        <g transform="translate(540, 300)">
          <line
            x1="-20"
            y1="0"
            x2="20"
            y2="0"
            stroke={theme.colors.primary}
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />
        </g>

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
      </svg>
    </div>
  );
};
