import React from "react";
import { Composition, Folder } from "remotion";
import { VideoComposition } from "./VideoComposition";

// 动态导入场景的类型定义
export interface SceneManifest {
  id: string;
  name: string;
  durationInFrames: number;
  component: string; // 组件文件路径
  props?: Record<string, any>;
}

export interface Manifest {
  version: string;
  fps: number;
  width: number;
  height: number;
  scenes: SceneManifest[];
  theme?: string; // 主题 ID
}

// 尝试加载 manifest.json，如果不存在则返回默认配置
const loadManifest = (): Manifest => {
  try {
    // 在实际运行时，这会被 Python 脚本生成的 manifest.json 替换
    const manifest = require("./scenes/manifest.json");
    return manifest;
  } catch (error) {
    // 默认配置，用于初始化项目
    return {
      version: "1.0.0",
      fps: 30,
      width: 1920,
      height: 1080,
      scenes: [],
      theme: "tech", // 默认主题
    };
  }
};

export const RemotionRoot: React.FC = () => {
  console.log("🎬 RemotionRoot 组件正在渲染...");
  
  const manifest = loadManifest();
  console.log("📋 Manifest 加载成功:", manifest);

  // 计算总时长，至少为 1 帧以避免错误
  const totalDuration = Math.max(
    1,
    manifest.scenes.reduce(
      (total, scene) => total + scene.durationInFrames,
      0
    )
  );
  
  console.log("⏱️  总时长:", totalDuration, "帧");

  return (
    <>
      <Folder name="AI-Generated-Videos">
        <Composition
          id="MainVideo"
          component={VideoComposition as any}
          durationInFrames={totalDuration}
          fps={manifest.fps}
          width={manifest.width}
          height={manifest.height}
          defaultProps={{
            manifest,
          }}
        />
      </Folder>
    </>
  );
};
