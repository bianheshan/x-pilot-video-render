import React from "react";
import { LayeredLayout, Layer } from "../LayeredLayout";
import { useTheme } from "../../../contexts/ThemeContext";

/**
 * 分层布局示例 - 展示视差效果和景深
 */
export const LayeredLayoutExample: React.FC = () => {
  const theme = useTheme();

  const layers: Layer[] = [
    // 背景层 - 最慢的视差
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 200,
              opacity: 0.1,
              fontWeight: "bold",
              color: theme.colors.primary,
            }}
          >
            LAYER
          </div>
        </div>
      ),
      zIndex: 0,
      animation: "parallax",
      parallaxSpeed: 0.3,
      blur: 2,
      opacity: 1,
    },

    // 装饰层 - 中等速度视差
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.colors.primary}40, ${theme.colors.secondary}40)`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
      ),
      zIndex: 1,
      animation: "parallax",
      parallaxSpeed: 0.6,
      blur: 1,
      opacity: 0.8,
      delay: 5,
    },

    // 主内容层 - 正常速度
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 60,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 24,
              padding: 60,
              maxWidth: 800,
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <h1
              style={{
                fontSize: 56,
                fontWeight: "bold",
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 30,
                textAlign: "center",
              }}
            >
              分层布局系统
            </h1>
            <p
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.8,
                textAlign: "center",
              }}
            >
              通过多层内容叠加和视差效果，创造出富有深度和动感的视觉体验。
              每一层都可以独立控制动画、模糊度和透明度。
            </p>
          </div>
        </div>
      ),
      zIndex: 2,
      position: { top: 0, left: 0 },
      size: { width: "100%", height: "100%" },
      animation: "spring",
      delay: 10,
    },

    // 前景装饰层 - 快速视差
    {
      content: (
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
            boxShadow: `0 20px 60px ${theme.colors.primary}80`,
          }}
        />
      ),
      zIndex: 3,
      position: { top: "10%", right: "10%" },
      animation: "parallax",
      parallaxSpeed: 1.2,
      delay: 15,
    },

    // 另一个前景装饰
    {
      content: (
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.primary})`,
            boxShadow: `0 20px 60px ${theme.colors.secondary}80`,
          }}
        />
      ),
      zIndex: 3,
      position: { bottom: "15%", left: "8%" },
      animation: "parallax",
      parallaxSpeed: 1.5,
      delay: 20,
    },

    // 浮动元素
    {
      content: (
        <div
          style={{
            padding: 20,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          💡 视差效果
        </div>
      ),
      zIndex: 4,
      position: { top: "20%", left: "15%" },
      animation: "scale",
      delay: 25,
    },
  ];

  return (
    <LayeredLayout
      layers={layers}
      backgroundColor="#0a0a0a"
      perspective={1200}
    />
  );
};
