import React from "react";
import { Composition, Folder } from "remotion";
import { VideoComposition } from "./VideoComposition";
import manifestJson from "./scenes/manifest.json";

// 场景清单类型（由 Python 推送/生成 manifest.json）
export interface SceneManifest {
  id: string;
  name: string;
  durationInFrames: number;
  component: string; // 组件文件路径（相对 ./scenes/）
  props?: Record<string, unknown>;
}

export interface Manifest {
  version: string;
  fps: number;
  width: number;
  height: number;
  scenes: SceneManifest[];
  theme?: string; // 主题 ID
}

const manifest = manifestJson as Manifest;

export const RemotionRoot: React.FC = () => {
  const totalDuration = Math.max(
    1,
    (manifest.scenes ?? []).reduce((total, scene) => total + scene.durationInFrames, 0)
  );

  return (
    <Folder name="AI-Generated-Videos">
      <Composition
        id="MainVideo"
        component={VideoComposition as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={totalDuration}
        fps={manifest.fps}
        width={manifest.width}
        height={manifest.height}
        defaultProps={{ manifest }}
      />
    </Folder>
  );
};
