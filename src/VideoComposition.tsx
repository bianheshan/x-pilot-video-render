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
    // Emit a single-line, machine-readable event for the E2B management platform.
    // This is intentionally JSON so upstream can classify/aggregate and send back to Dify.
    const payload = {
      schemaVersion: 1,
      kind: "scene_runtime_error",
      sceneId: this.props.sceneId,
      sceneName: this.props.sceneName,
      componentPath: this.props.componentPath,
      message: error.message,
      stack: error.stack ?? null,
    };

    console.error(`[E2B_SCENE_RUNTIME_ERROR] ${JSON.stringify(payload)}`);
    console.error(
      `[SceneErrorBoundary] Scene crashed: ${this.props.sceneId} (${this.props.componentPath})`,
      error
    );
  }


  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    // In headless render, you may prefer failing the render instead of showing placeholders.
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

// 场景注册表（由 predev 脚本生成）：避免 webpack 通过“动态路径 require”把整个 `src/scenes` 目录打包进来。
// 否则只要有一个 scene TSX 语法坏了，就会导致 Studio 启动直接失败。
const getSceneComponentFromRegistry = (componentPath: string) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getSceneComponent } = require("./scene-registry.generated") as {
    getSceneComponent: (
      componentPath: string
    ) => {
      Component: React.ComponentType<Record<string, unknown>>;
      issue?: { code: string; detail: string };
    };
  };

  return getSceneComponent(componentPath);
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
          const { Component: SceneComponent, issue } = getSceneComponentFromRegistry(
            scene.component
          );

          if (issue) {
            const payload = {
              schemaVersion: 1,
              kind: "scene_load_issue",
              sceneId: scene.id,
              sceneName: scene.name,
              componentPath: scene.component,
              issue,
            };
            console.warn(`[E2B_SCENE_LOAD_ISSUE] ${JSON.stringify(payload)}`);
            console.warn(
              `[SceneRegistry] Using placeholder for ${scene.id} (${scene.component}): ${issue.code}: ${issue.detail}`
            );
          }


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
