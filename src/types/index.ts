/**
 * 全局类型定义
 */

import { CSSProperties } from "react";

// 场景清单类型
export interface SceneManifest {
  id: string;
  name: string;
  durationInFrames: number;
  component: string;
  props?: Record<string, any>;
}

export interface Manifest {
  version: string;
  fps: number;
  width: number;
  height: number;
  scenes: SceneManifest[];
}

// 位置类型
export type Position = "top" | "center" | "bottom";
export type HorizontalPosition = "left" | "center" | "right";
export type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

// 动画类型
export type AnimationType = "fade" | "slide" | "scale" | "none";

// 组件通用 Props
export interface BaseComponentProps {
  style?: CSSProperties;
  className?: string;
}

// 字幕 Props
export interface SubtitleProps extends BaseComponentProps {
  text: string;
  startFrame?: number;
  durationInFrames?: number;
  position?: Position;
  animate?: boolean;
}

// 标题卡 Props
export interface TitleCardProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  durationInFrames?: number;
}

// 代码块 Props
export interface CodeBlockProps extends BaseComponentProps {
  code: string;
  language?: string;
  title?: string;
  highlightLines?: number[];
  durationInFrames?: number;
  backgroundColor?: string;
}

// AI 数字人 Props
export interface AISpeakerProps extends BaseComponentProps {
  name?: string;
  avatar?: string;
  position?: "left" | "right";
  size?: number;
  speaking?: boolean;
}

// 布局 Props
export interface SplitScreenProps extends BaseComponentProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: number;
  gap?: number;
  backgroundColor?: string;
}

export interface PictureInPictureProps extends BaseComponentProps {
  main: React.ReactNode;
  pip: React.ReactNode;
  position?: CornerPosition;
  pipSize?: { width: number; height: number };
  offset?: { x: number; y: number };
}

export interface FullScreenProps extends BaseComponentProps {
  children: React.ReactNode;
  backgroundColor?: string;
  backgroundImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

// 资产类型
export interface Asset {
  id: string;
  type: "image" | "video" | "audio" | "font";
  url: string;
  name?: string;
  metadata?: Record<string, any>;
}

// 场景组件基础类型
export interface SceneProps {
  [key: string]: any;
}
