import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Manifest } from "./Root";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles.css";

export interface VideoCompositionProps {
  manifest: Manifest;
}

// 动态加载场景组件
const loadSceneComponent = (componentPath: string) => {
  try {
    // 移除 .tsx 扩展名（如果有）
    const cleanPath = componentPath.replace(/\.tsx?$/, "");
    const component = require(`./scenes/${cleanPath}`);
    return component.default || component[Object.keys(component)[0]];
  } catch (error) {
    console.error(`Failed to load scene component: ${componentPath}`, error);
    // 返回错误占位组件
    return () => (
      <AbsoluteFill
        style={{
          backgroundColor: "#1a1a1a",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 48, marginBottom: 20 }}>⚠️ Scene Load Error</h1>
          <p style={{ fontSize: 24 }}>Component: {componentPath}</p>
        </div>
      </AbsoluteFill>
    );
  }
};

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  manifest,
}) => {
  const frame = useCurrentFrame();

  // 如果没有场景，显示欢迎界面
  if (!manifest.scenes || manifest.scenes.length === 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#0f172a",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 800, padding: 40 }}>
          <h1 style={{ fontSize: 64, marginBottom: 30, fontWeight: "bold" }}>
            🎬 X-Pilot Video Template
          </h1>
          <p style={{ fontSize: 28, lineHeight: 1.6, opacity: 0.8 }}>
            Ready for AI-generated scenes
          </p>
          <p style={{ fontSize: 20, marginTop: 40, opacity: 0.6 }}>
            Push your scenes using the Python API
          </p>
        </div>
      </AbsoluteFill>
    );
  }

  // 计算每个场景的起始帧
  let currentFrame = 0;
  const sceneTimings = manifest.scenes.map((scene) => {
    const start = currentFrame;
    currentFrame += scene.durationInFrames;
    return { ...scene, startFrame: start };
  });

  return (
    <ThemeProvider themeId={manifest.theme}>
      <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
        {sceneTimings.map((scene, index) => {
          const SceneComponent = loadSceneComponent(scene.component);
          return (
            <Sequence
              key={scene.id}
              from={scene.startFrame}
              durationInFrames={scene.durationInFrames}
              name={scene.name}
            >
              <SceneComponent {...(scene.props || {})} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </ThemeProvider>
  );
};
