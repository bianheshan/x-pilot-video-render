import React from "react";
import { GridLayout, GridItem } from "../GridLayout";
import { useTheme } from "../../../contexts/ThemeContext";

/**
 * 网格布局示例 - 展示产品特性
 */
export const GridLayoutExample: React.FC = () => {
  const theme = useTheme();

  const features: GridItem[] = [
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
            borderRadius: 16,
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
          <h3 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>高性能</h3>
          <p style={{ fontSize: 16, opacity: 0.9, textAlign: "center" }}>
            基于 Remotion 的强大渲染引擎
          </p>
        </div>
      ),
      span: { rows: 2, cols: 1 },
      animation: "spring",
      delay: 0,
    },
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            borderRadius: 16,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 15 }}>🎨</div>
          <h3 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>灵活布局</h3>
          <p style={{ fontSize: 14, opacity: 0.9, textAlign: "center" }}>
            多种布局模式任意组合
          </p>
        </div>
      ),
      animation: "scale",
      delay: 5,
    },
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f093fb, #f5576c)",
            borderRadius: 16,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 15 }}>⚡</div>
          <h3 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>动画丰富</h3>
          <p style={{ fontSize: 14, opacity: 0.9, textAlign: "center" }}>
            Spring、插值等多种动画
          </p>
        </div>
      ),
      animation: "slide",
      delay: 10,
    },
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #4facfe, #00f2fe)",
            borderRadius: 16,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 15 }}>📱</div>
          <h3 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>响应式</h3>
          <p style={{ fontSize: 14, opacity: 0.9, textAlign: "center" }}>
            适配各种分辨率
          </p>
        </div>
      ),
      animation: "spring",
      delay: 15,
    },
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #fa709a, #fee140)",
            borderRadius: 16,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 15 }}>🎯</div>
          <h3 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>易用性</h3>
          <p style={{ fontSize: 14, opacity: 0.9, textAlign: "center" }}>
            简单的 API 设计
          </p>
        </div>
      ),
      animation: "fade",
      delay: 20,
    },
  ];

  return (
    <GridLayout
      items={features}
      columns={3}
      rows={2}
      gap={20}
      padding={60}
      backgroundColor="#0a0a0a"
      staggerDelay={5}
      globalAnimation="spring"
    />
  );
};
