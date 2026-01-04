import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Manifest } from "./Root";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles.css";

type SceneErrorBoundaryProps = {
  sceneId: string;
  sceneName: string;
  componentPath: string;
  children: React.ReactNode;
};

type SceneErrorBoundaryState = {
  error: Error | null;
};

/**
 * Project-level safety net for AI-generated scenes.
 *
 * - Prevents one broken scene from crashing the whole `MainVideo` preview.
 * - In e2b/headless render, you can opt-in to fail fast by setting:
 *   `REMOTION_FAIL_ON_SCENE_ERROR=1`
 */
class SceneErrorBoundary extends React.Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): SceneErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Keep logs discoverable in Studio / render logs.
    console.error(
      `[SceneErrorBoundary] Scene crashed: ${this.props.sceneId} (${this.props.componentPath})`,
      error
    );
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    // In headless render, you may prefer failing the render instead of showing placeholders.
    // eslint-disable-next-line no-process-env
    const failFast = process.env.REMOTION_FAIL_ON_SCENE_ERROR === "1";
    if (failFast) {
      throw error;
    }

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#111827",
          color: "#ffffff",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
        }}
      >
        <div style={{ maxWidth: 1400 }}>
          <div style={{ fontSize: 42, fontWeight: 800, marginBottom: 18 }}>
            Scene Runtime Error
          </div>
          <div style={{ fontSize: 22, opacity: 0.9, marginBottom: 18 }}>
            <div>
              <b>sceneId</b>: {this.props.sceneId}
            </div>
            <div>
              <b>name</b>: {this.props.sceneName}
            </div>
            <div>
              <b>component</b>: {this.props.componentPath}
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: 20,
              fontSize: 18,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {error.stack ?? error.message}
          </div>
          <div style={{ marginTop: 18, fontSize: 18, opacity: 0.85 }}>
            说明：这是模板项目级兜底。请修复生成 Prompt（`generator-scene-code.md`）以避免此类错误再次生成。
          </div>
        </div>
      </AbsoluteFill>
    );
  }
}

export interface VideoCompositionProps {
  manifest: Manifest;
}

// 动态加载场景组件
const loadSceneComponent = (componentPath: string) => {
  try {
    // 移除 .tsx 扩展名（如果有）
    const cleanPath = componentPath.replace(/\.tsx?$/, "");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const moduleExports = require(`./scenes/${cleanPath}`) as Record<string, unknown>;
    const maybeDefault = (moduleExports as { default?: unknown }).default;
    const maybeNamed = moduleExports[Object.keys(moduleExports)[0]];
    return (maybeDefault ?? maybeNamed) as React.ComponentType<Record<string, unknown>>;
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
        {sceneTimings.map((scene) => {
          const SceneComponent = loadSceneComponent(scene.component);
          return (
            <Sequence
              key={scene.id}
              from={scene.startFrame}
              durationInFrames={scene.durationInFrames}
              name={scene.name}
            >
              <SceneErrorBoundary
                sceneId={scene.id}
                sceneName={scene.name}
                componentPath={scene.component}
              >
                <SceneComponent {...(scene.props || {})} />
              </SceneErrorBoundary>
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </ThemeProvider>
  );
};
