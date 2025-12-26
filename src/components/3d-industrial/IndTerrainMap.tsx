import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import * as d3 from "d3";

interface IndTerrainMapProps {
  resolution?: number;
  showContours?: boolean;
  showWater?: boolean;
}

/**
 * IndTerrainMap - 3D 地形图可视化（使用 D3.js 等高线）
 * 
 * 使用 D3.js 的 contours 生成真实的等高线
 * 
 * 特性：
 * - D3 等高线生成
 * - Perlin 噪声地形
 * - 颜色比例尺
 * - 3D 投影
 * - 水体模拟
 */
export const IndTerrainMap: React.FC<IndTerrainMapProps> = ({
  resolution = 40,
  showContours = true,
  showWater = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 简化的 Perlin 噪声函数
  const noise = (x: number, y: number): number => {
    const seed = 12345;
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
  };

  // 多层噪声（模拟真实地形）
  const terrainHeight = (x: number, y: number): number => {
    let height = 0;
    let amplitude = 1;
    let frequency = 1;

    // 多个八度的噪声叠加
    for (let i = 0; i < 4; i++) {
      height += noise(x * frequency * 0.05, y * frequency * 0.05) * amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return height;
  };

  // 生成地形数据
  const terrainData = useMemo(() => {
    const data: number[] = [];
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        data.push(terrainHeight(x, y));
      }
    }
    return data;
  }, [resolution]);

  // 使用 D3 生成等高线
  const contours = useMemo(() => {
    if (!showContours) return [];

    const contourGenerator = d3
      .contours()
      .size([resolution, resolution])
      .thresholds(d3.range(0.2, 1, 0.1));

    return contourGenerator(terrainData);
  }, [terrainData, resolution, showContours]);

  // 使用 D3 颜色比例尺
  const colorScale = useMemo(() => {
    return d3
      .scaleSequential(d3.interpolateRdYlGn)
      .domain([0, 1]);
  }, []);

  // 获取高度颜色（使用 D3 颜色插值）
  const getHeightColor = (height: number): string => {
    if (height < 0.3) return d3.interpolateBlues(0.8); // 深水
    if (height < 0.35) return d3.interpolateBlues(0.5); // 浅水
    if (height < 0.4) return "#D9B08C"; // 沙滩
    return colorScale(height); // 使用 D3 颜色比例尺
  };

  // 3D 投影
  const project3D = (x: number, y: number, z: number) => {
    const rotateX = interpolate(frame, [0, 300], [30, 50], {
      extrapolateRight: "clamp",
    });
    const rotateZ = interpolate(frame, [0, 300], [0, 360]);

    // 旋转变换
    const radX = (rotateX * Math.PI) / 180;
    const radZ = (rotateZ * Math.PI) / 180;

    // 绕 Z 轴旋转
    const x1 = x * Math.cos(radZ) - y * Math.sin(radZ);
    const y1 = x * Math.sin(radZ) + y * Math.cos(radZ);

    // 绕 X 轴旋转
    const y2 = y1 * Math.cos(radX) - z * Math.sin(radX);
    const z2 = y1 * Math.sin(radX) + z * Math.cos(radX);

    // 透视投影
    const perspective = 800;
    const scale = perspective / (perspective + z2);

    return {
      x: 540 + x1 * scale * 8,
      y: 360 + y2 * scale * 8,
      z: z2,
      scale,
    };
  };

  // 渲染地形网格
  const renderTerrainGrid = () => {
    const faces: Array<{
      points: Array<{ x: number; y: number }>;
      z: number;
      color: string;
    }> = [];

    const centerX = resolution / 2;
    const centerY = resolution / 2;

    for (let y = 0; y < resolution - 1; y++) {
      for (let x = 0; x < resolution - 1; x++) {
        const h1 = terrainData[y * resolution + x] * 100;
        const h2 = terrainData[y * resolution + (x + 1)] * 100;
        const h3 = terrainData[(y + 1) * resolution + (x + 1)] * 100;
        const h4 = terrainData[(y + 1) * resolution + x] * 100;

        const p1 = project3D(x - centerX, y - centerY, h1);
        const p2 = project3D(x + 1 - centerX, y - centerY, h2);
        const p3 = project3D(x + 1 - centerX, y + 1 - centerY, h3);
        const p4 = project3D(x - centerX, y + 1 - centerY, h4);

        const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
        const avgHeight = (h1 + h2 + h3 + h4) / 400;

        faces.push({
          points: [p1, p2, p3, p4],
          z: avgZ,
          color: getHeightColor(avgHeight),
        });
      }
    }

    // 按 Z 深度排序（画家算法）
    faces.sort((a, b) => a.z - b.z);

    return faces.map((face, i) => {
      const pathData =
        face.points.map((p, j) => `${j === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

      return (
        <path
          key={`face-${i}`}
          d={pathData}
          fill={face.color}
          stroke={theme.colors.text}
          strokeWidth="0.5"
          opacity="0.9"
        />
      );
    });
  };

  // 渲染等高线（使用 D3 生成的等高线）
  const renderContours = () => {
    if (!showContours) return null;

    const pathGenerator = d3.geoPath();
    const centerX = resolution / 2;
    const centerY = resolution / 2;

    return contours.map((contour, i) => {
      // 将等高线投影到 3D 空间
      const coordinates = contour.coordinates[0];
      if (!coordinates) return null;

      const points = coordinates[0].map((coord: [number, number]) => {
        const [x, y] = coord;
        const height = contour.value * 100;
        return project3D(x - centerX, y - centerY, height);
      });

      const pathData = points.map((p, j) => `${j === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

      return (
        <path
          key={`contour-${i}`}
          d={pathData}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth="1.5"
          opacity="0.6"
        />
      );
    });
  };

  // 渲染水体
  const renderWater = () => {
    if (!showWater) return null;

    const waterLevel = 0.35;
    const waveOffset = Math.sin(frame * 0.1) * 2;
    const centerX = resolution / 2;
    const centerY = resolution / 2;

    const waterFaces: JSX.Element[] = [];

    for (let y = 0; y < resolution - 1; y++) {
      for (let x = 0; x < resolution - 1; x++) {
        const h = terrainData[y * resolution + x];
        if (h < waterLevel) {
          const p1 = project3D(x - centerX, y - centerY, waterLevel * 100 + waveOffset);
          const p2 = project3D(x + 1 - centerX, y - centerY, waterLevel * 100 + waveOffset);
          const p3 = project3D(x + 1 - centerX, y + 1 - centerY, waterLevel * 100 + waveOffset);
          const p4 = project3D(x - centerX, y + 1 - centerY, waterLevel * 100 + waveOffset);

          const pathData = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`;

          waterFaces.push(
            <path
              key={`water-${y}-${x}`}
              d={pathData}
              fill="#4A90E2"
              stroke="#2E5266"
              strokeWidth="0.5"
              opacity="0.7"
            />
          );
        }
      }
    }

    return <g opacity="0.6">{waterFaces}</g>;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg width="1080" height="720" style={{ overflow: "visible" }}>
        {/* 背景 */}
        <rect width="1080" height="720" fill="#1a1a2e" />

        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
        >
          3D 地形图可视化
        </text>

        {/* 信息面板 */}
        <g transform="translate(50, 80)">
          <rect width="220" height="160" fill={theme.colors.surface} opacity="0.9" rx="8" />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold">
            地形参数
          </text>
          <text x="15" y="55" fill={theme.colors.text} fontSize="14">
            分辨率: {resolution}x{resolution}
          </text>
          <text x="15" y="75" fill={theme.colors.text} fontSize="14">
            等高线: {showContours ? "开启" : "关闭"}
          </text>
          <text x="15" y="95" fill={theme.colors.text} fontSize="14">
            水体: {showWater ? "开启" : "关闭"}
          </text>
          <text x="15" y="115" fill={theme.colors.text} fontSize="14">
            算法: Perlin Noise
          </text>
          <text x="15" y="135" fill={theme.colors.text} fontSize="14">
            等高线: D3 Contours
          </text>
        </g>

        {/* 高度图例 */}
        <g transform="translate(880, 80)">
          <rect width="150" height="220" fill={theme.colors.surface} opacity="0.9" rx="8" />
          <text x="15" y="25" fill={theme.colors.text} fontSize="14" fontWeight="bold">
            高度图例
          </text>
          {[
            { color: d3.interpolateRdYlGn(1), label: "雪山" },
            { color: d3.interpolateRdYlGn(0.8), label: "山地" },
            { color: d3.interpolateRdYlGn(0.6), label: "森林" },
            { color: d3.interpolateRdYlGn(0.4), label: "草地" },
            { color: "#D9B08C", label: "沙滩" },
            { color: d3.interpolateBlues(0.5), label: "浅水" },
            { color: d3.interpolateBlues(0.8), label: "深水" },
          ].map((item, i) => (
            <g key={`legend-${i}`} transform={`translate(15, ${40 + i * 25})`}>
              <rect width="20" height="15" fill={item.color} />
              <text x="25" y="12" fill={theme.colors.text} fontSize="12">
                {item.label}
              </text>
            </g>
          ))}
        </g>

        {/* 地形渲染 */}
        <g>
          {renderTerrainGrid()}
          {renderWater()}
          {renderContours()}
        </g>

        {/* 坐标轴 */}
        <g transform="translate(540, 360)">
          <line x1="0" y1="0" x2="100" y2="0" stroke="#FF0000" strokeWidth="2" />
          <text x="105" y="5" fill="#FF0000" fontSize="12">
            X
          </text>
          <line x1="0" y1="0" x2="0" y2="100" stroke="#00FF00" strokeWidth="2" />
          <text x="5" y="115" fill="#00FF00" fontSize="12">
            Y
          </text>
          <line x1="0" y1="0" x2="0" y2="-100" stroke="#0000FF" strokeWidth="2" />
          <text x="5" y="-105" fill="#0000FF" fontSize="12">
            Z
          </text>
        </g>

        {/* 统计信息 */}
        <g transform="translate(50, 600)">
          <text x="0" y="0" fill={theme.colors.text} fontSize="14">
            最高点: {(Math.max(...terrainData) * 100).toFixed(0)}m
          </text>
          <text x="0" y="20" fill={theme.colors.text} fontSize="14">
            最低点: {(Math.min(...terrainData) * 100).toFixed(0)}m
          </text>
          <text x="0" y="40" fill={theme.colors.text} fontSize="14">
            平均高度: {((terrainData.reduce((a, b) => a + b, 0) / terrainData.length) * 100).toFixed(0)}m
          </text>
        </g>
      </svg>
    </div>
  );
};
