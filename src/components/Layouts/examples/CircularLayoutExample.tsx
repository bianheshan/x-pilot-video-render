import React from "react";
import { CircularLayout, CircularItem } from "../CircularLayout";
import { useTheme } from "../../../contexts/ThemeContext";

/**
 * 环形布局示例 - 展示技术栈
 */
export const CircularLayoutExample: React.FC = () => {
  const theme = useTheme();

  const techStack: CircularItem[] = [
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.5)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 5 }}>⚛️</div>
          <div style={{ fontSize: 12, fontWeight: "bold" }}>React</div>
        </div>
      ),
      size: 100,
      animation: "orbit",
      delay: 0,
    },
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f093fb, #f5576c)",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(240, 147, 251, 0.5)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 5 }}>📹</div>
          <div style={{ fontSize: 12, fontWeight: "bold" }}>Remotion</div>
        </div>
      ),
      size: 100,
      animation: "orbit",
      delay: 5,
    },
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #4facfe, #00f2fe)",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(79, 172, 254, 0.5)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 5 }}>📘</div>
          <div style={{ fontSize: 12, fontWeight: "bold" }}>TypeScript</div>
        </div>
      ),
      size: 100,
      animation: "orbit",
      delay: 10,
    },
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #fa709a, #fee140)",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(250, 112, 154, 0.5)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 5 }}>🎨</div>
          <div style={{ fontSize: 12, fontWeight: "bold" }}>Tailwind</div>
        </div>
      ),
      size: 100,
      animation: "orbit",
      delay: 15,
    },
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #30cfd0, #330867)",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(48, 207, 208, 0.5)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 5 }}>📊</div>
          <div style={{ fontSize: 12, fontWeight: "bold" }}>D3.js</div>
        </div>
      ),
      size: 100,
      animation: "orbit",
      delay: 20,
    },
    {
      content: (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #a8edea, #fed6e3)",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#333",
            boxShadow: "0 10px 30px rgba(168, 237, 234, 0.5)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 5 }}>🎭</div>
          <div style={{ fontSize: 12, fontWeight: "bold" }}>Three.js</div>
        </div>
      ),
      size: 100,
      animation: "orbit",
      delay: 25,
    },
  ];

  const centerContent = (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        boxShadow: `0 20px 60px ${theme.colors.primary}80`,
        border: "4px solid rgba(255,255,255,0.2)",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 10 }}>🎬</div>
      <div style={{ fontSize: 20, fontWeight: "bold" }}>视频引擎</div>
    </div>
  );

  return (
    <CircularLayout
      items={techStack}
      radius={320}
      centerContent={centerContent}
      centerSize={180}
      startAngle={0}
      backgroundColor="#0a0a0a"
      rotationSpeed={0.2}
      staggerDelay={5}
    />
  );
};
