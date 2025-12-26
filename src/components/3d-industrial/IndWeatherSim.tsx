import React from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

interface IndWeatherSimProps {
  weatherType?: "sunny" | "rainy" | "snowy" | "stormy" | "cycle";
  showWind?: boolean;
  showTemperature?: boolean;
}

/**
 * IndWeatherSim - 天气模拟系统
 * 
 * 展示不同天气条件下的气象现象
 * 
 * 特性：
 * - 多种天气类型
 * - 粒子系统（雨、雪）
 * - 风向风速
 * - 温度变化
 * - 云层运动
 */
export const IndWeatherSim: React.FC<IndWeatherSimProps> = ({
  weatherType = "cycle",
  showWind = true,
  showTemperature = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 天气循环
  const getCurrentWeather = (): "sunny" | "rainy" | "snowy" | "stormy" => {
    if (weatherType !== "cycle") return weatherType;

    const cycle = Math.floor(frame / 120) % 4;
    const types: Array<"sunny" | "rainy" | "snowy" | "stormy"> = [
      "sunny",
      "rainy",
      "snowy",
      "stormy",
    ];
    return types[cycle];
  };

  const currentWeather = getCurrentWeather();

  // 温度
  const temperature = React.useMemo(() => {
    const base = {
      sunny: 25,
      rainy: 15,
      snowy: -5,
      stormy: 10,
    };
    return base[currentWeather] + Math.sin(frame * 0.05) * 3;
  }, [currentWeather, frame]);

  // 风速和风向
  const windSpeed = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [5, 25]
  );
  const windDirection = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [0, 360]
  );

  // 生成雨滴
  const raindrops = React.useMemo(() => {
    if (currentWeather !== "rainy" && currentWeather !== "stormy") return [];

    const drops: Array<{ x: number; y: number; speed: number; length: number }> = [];
    const count = currentWeather === "stormy" ? 200 : 100;

    for (let i = 0; i < count; i++) {
      const seed = random(`rain-${i}`);
      const x = (seed * 1080 + frame * 5) % 1080;
      const speed = 10 + random(`rain-speed-${i}`) * 10;
      const y = ((frame * speed + i * 10) % 720);

      drops.push({
        x,
        y,
        speed,
        length: currentWeather === "stormy" ? 20 : 15,
      });
    }

    return drops;
  }, [currentWeather, frame]);

  // 生成雪花
  const snowflakes = React.useMemo(() => {
    if (currentWeather !== "snowy") return [];

    const flakes: Array<{ x: number; y: number; size: number; drift: number }> = [];
    const count = 150;

    for (let i = 0; i < count; i++) {
      const seed = random(`snow-${i}`);
      const speed = 2 + random(`snow-speed-${i}`) * 3;
      const drift = Math.sin((frame + i * 10) * 0.05) * 30;
      const x = (seed * 1080 + drift) % 1080;
      const y = ((frame * speed + i * 10) % 720);

      flakes.push({
        x,
        y,
        size: 3 + random(`snow-size-${i}`) * 4,
        drift,
      });
    }

    return flakes;
  }, [currentWeather, frame]);

  // 生成云层
  const clouds = React.useMemo(() => {
    const result: Array<{ x: number; y: number; width: number; opacity: number }> = [];
    const count = currentWeather === "sunny" ? 3 : 8;

    for (let i = 0; i < count; i++) {
      const seed = random(`cloud-${i}`);
      const x = ((seed * 1080 + frame * 2) % 1200) - 100;
      const y = 50 + seed * 150;
      const width = 100 + random(`cloud-w-${i}`) * 100;
      const opacity = currentWeather === "sunny" ? 0.3 : 0.7;

      result.push({ x, y, width, opacity });
    }

    return result;
  }, [currentWeather, frame]);

  // 闪电
  const lightning = React.useMemo(() => {
    if (currentWeather !== "stormy") return null;
    if (frame % 60 < 3) {
      const x = random(`lightning-x-${Math.floor(frame / 60)}`) * 1080;
      return { x, visible: true };
    }
    return null;
  }, [currentWeather, frame]);

  // 获取天空颜色
  const getSkyColor = () => {
    const colors = {
      sunny: "#87CEEB",
      rainy: "#708090",
      snowy: "#B0C4DE",
      stormy: "#2F4F4F",
    };
    return colors[currentWeather];
  };

  // 渲染云层
  const renderCloud = (cloud: { x: number; y: number; width: number; opacity: number }, index: number) => {
    return (
      <g key={`cloud-${index}`} opacity={cloud.opacity}>
        <ellipse
          cx={cloud.x}
          cy={cloud.y}
          rx={cloud.width * 0.3}
          ry={cloud.width * 0.15}
          fill="#FFFFFF"
        />
        <ellipse
          cx={cloud.x + cloud.width * 0.2}
          cy={cloud.y - 10}
          rx={cloud.width * 0.25}
          ry={cloud.width * 0.2}
          fill="#FFFFFF"
        />
        <ellipse
          cx={cloud.x - cloud.width * 0.2}
          cy={cloud.y - 5}
          rx={cloud.width * 0.2}
          ry={cloud.width * 0.15}
          fill="#FFFFFF"
        />
      </g>
    );
  };

  // 渲染太阳
  const renderSun = () => {
    if (currentWeather !== "sunny") return null;

    const sunX = 900;
    const sunY = 100;

    return (
      <g>
        {/* 太阳光晕 */}
        <circle
          cx={sunX}
          cy={sunY}
          r="60"
          fill="#FFD700"
          opacity="0.3"
        />
        {/* 太阳主体 */}
        <circle
          cx={sunX}
          cy={sunY}
          r="40"
          fill="#FFD700"
        />
        {/* 太阳光线 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = sunX + Math.cos(angle) * 50;
          const y1 = sunY + Math.sin(angle) * 50;
          const x2 = sunX + Math.cos(angle) * 70;
          const y2 = sunY + Math.sin(angle) * 70;

          return (
            <line
              key={`ray-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FFD700"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </g>
    );
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
        {/* 天空背景 */}
        <rect width="1080" height="720" fill={getSkyColor()} />

        {/* 闪电效果 */}
        {lightning && (
          <>
            <rect width="1080" height="720" fill="#FFFFFF" opacity="0.3" />
            <path
              d={`M ${lightning.x} 0 L ${lightning.x + 20} 200 L ${lightning.x - 10} 200 L ${lightning.x + 10} 400`}
              stroke="#FFFF00"
              strokeWidth="4"
              fill="none"
              filter="url(#glow)"
            />
          </>
        )}

        {/* 滤镜定义 */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 太阳 */}
        {renderSun()}

        {/* 云层 */}
        {clouds.map(renderCloud)}

        {/* 雨滴 */}
        {raindrops.map((drop, i) => (
          <line
            key={`rain-${i}`}
            x1={drop.x}
            y1={drop.y}
            x2={drop.x}
            y2={drop.y + drop.length}
            stroke="#4A90E2"
            strokeWidth="1"
            opacity="0.6"
          />
        ))}

        {/* 雪花 */}
        {snowflakes.map((flake, i) => (
          <g key={`snow-${i}`}>
            <circle
              cx={flake.x}
              cy={flake.y}
              r={flake.size}
              fill="#FFFFFF"
              opacity="0.8"
            />
            {/* 雪花形状 */}
            {Array.from({ length: 6 }).map((_, j) => {
              const angle = (j * 60 * Math.PI) / 180;
              return (
                <line
                  key={`snowflake-arm-${j}`}
                  x1={flake.x}
                  y1={flake.y}
                  x2={flake.x + Math.cos(angle) * flake.size}
                  y2={flake.y + Math.sin(angle) * flake.size}
                  stroke="#FFFFFF"
                  strokeWidth="0.5"
                  opacity="0.8"
                />
              );
            })}
          </g>
        ))}

        {/* 地面 */}
        <rect
          y="650"
          width="1080"
          height="70"
          fill={currentWeather === "snowy" ? "#FFFFFF" : "#228B22"}
          opacity="0.8"
        />

        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
        >
          天气模拟系统
        </text>

        {/* 信息面板 */}
        <g transform="translate(50, 80)">
          <rect
            width="250"
            height="180"
            fill={theme.colors.surface}
            opacity="0.9"
            rx="8"
          />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold">
            气象参数
          </text>
          <text x="15" y="55" fill={theme.colors.text} fontSize="14">
            天气: {
              currentWeather === "sunny" ? "晴天☀️" :
              currentWeather === "rainy" ? "雨天🌧️" :
              currentWeather === "snowy" ? "雪天❄️" :
              "暴风雨⛈️"
            }
          </text>
          {showTemperature && (
            <text x="15" y="80" fill={theme.colors.text} fontSize="14">
              温度: {temperature.toFixed(1)}°C
            </text>
          )}
          {showWind && (
            <>
              <text x="15" y="105" fill={theme.colors.text} fontSize="14">
                风速: {windSpeed.toFixed(1)} m/s
              </text>
              <text x="15" y="130" fill={theme.colors.text} fontSize="14">
                风向: {windDirection.toFixed(0)}°
              </text>
            </>
          )}
          <text x="15" y="155" fill={theme.colors.text} fontSize="14">
            粒子数: {raindrops.length + snowflakes.length}
          </text>
        </g>

        {/* 风向指示器 */}
        {showWind && (
          <g transform="translate(880, 150)">
            <circle cx="0" cy="0" r="50" fill={theme.colors.surface} opacity="0.9" />
            <text x="0" y="-60" fill={theme.colors.text} fontSize="12" textAnchor="middle">
              N
            </text>
            <text x="0" y="70" fill={theme.colors.text} fontSize="12" textAnchor="middle">
              S
            </text>
            <text x="-60" y="5" fill={theme.colors.text} fontSize="12" textAnchor="middle">
              W
            </text>
            <text x="60" y="5" fill={theme.colors.text} fontSize="12" textAnchor="middle">
              E
            </text>
            
            {/* 风向箭头 */}
            <g transform={`rotate(${windDirection})`}>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-40"
                stroke={theme.colors.accent}
                strokeWidth="3"
              />
              <polygon
                points="0,-40 -5,-30 5,-30"
                fill={theme.colors.accent}
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
