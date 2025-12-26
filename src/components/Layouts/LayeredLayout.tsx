import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export type Layer = {
  content: React.ReactNode;
  zIndex?: number;
  position?: {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
  };
  size?: {
    width?: number | string;
    height?: number | string;
  };
  animation?: "fade" | "slide" | "scale" | "parallax" | "spring" | "none";
  parallaxSpeed?: number;
  delay?: number;
  blur?: number;
  opacity?: number;
};

interface LayeredLayoutProps {
  layers: Layer[];
  backgroundColor?: string;
  perspective?: number;
}

/**
 * 分层布局组件 - 支持多层内容叠加、视差效果
 * 适用于复杂的视觉层次、景深效果、视差滚动
 */
export const LayeredLayout: React.FC<LayeredLayoutProps> = ({
  layers,
  backgroundColor = "transparent",
  perspective = 1000,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const getLayerAnimation = (layer: Layer, index: number) => {
    const animation = layer.animation || "fade";
    const delay = layer.delay || index * 5;
    const startFrame = delay;

    if (animation === "none") {
      return {
        opacity: layer.opacity ?? 1,
        transform: "none",
        filter: layer.blur ? `blur(${layer.blur}px)` : "none",
      };
    }

    if (animation === "spring") {
      const progress = spring({
        frame: frame - startFrame,
        fps,
        config: {
          damping: 20,
          stiffness: 100,
          mass: 1,
        },
      });

      return {
        opacity: interpolate(frame, [startFrame, startFrame + 10], [0, layer.opacity ?? 1], {
          extrapolateRight: "clamp",
        }),
        transform: `scale(${progress}) translateZ(${(1 - progress) * 50}px)`,
        filter: layer.blur ? `blur(${layer.blur}px)` : "none",
      };
    }

    if (animation === "fade") {
      const opacity = interpolate(
        frame,
        [startFrame, startFrame + 30],
        [0, layer.opacity ?? 1],
        {
          extrapolateRight: "clamp",
        }
      );
      return {
        opacity,
        transform: "none",
        filter: layer.blur ? `blur(${layer.blur}px)` : "none",
      };
    }

    if (animation === "slide") {
      const slideY = interpolate(frame, [startFrame, startFrame + 40], [100, 0], {
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(
        frame,
        [startFrame, startFrame + 30],
        [0, layer.opacity ?? 1],
        {
          extrapolateRight: "clamp",
        }
      );
      return {
        opacity,
        transform: `translateY(${slideY}px)`,
        filter: layer.blur ? `blur(${layer.blur}px)` : "none",
      };
    }

    if (animation === "scale") {
      const scale = interpolate(frame, [startFrame, startFrame + 40], [0.8, 1], {
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(
        frame,
        [startFrame, startFrame + 30],
        [0, layer.opacity ?? 1],
        {
          extrapolateRight: "clamp",
        }
      );
      return {
        opacity,
        transform: `scale(${scale})`,
        filter: layer.blur ? `blur(${layer.blur}px)` : "none",
      };
    }

    if (animation === "parallax") {
      const speed = layer.parallaxSpeed || 1;
      const parallaxY = interpolate(frame, [0, 300], [0, -100 * speed], {
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(
        frame,
        [startFrame, startFrame + 30],
        [0, layer.opacity ?? 1],
        {
          extrapolateRight: "clamp",
        }
      );
      return {
        opacity,
        transform: `translateY(${parallaxY}px)`,
        filter: layer.blur ? `blur(${layer.blur}px)` : "none",
      };
    }

    return {
      opacity: layer.opacity ?? 1,
      transform: "none",
      filter: layer.blur ? `blur(${layer.blur}px)` : "none",
    };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
    >
      {layers.map((layer, index) => {
        const animation = getLayerAnimation(layer, index);
        const position = layer.position || {};
        const size = layer.size || {};

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              zIndex: layer.zIndex ?? index,
              top: position.top ?? "auto",
              left: position.left ?? "auto",
              right: position.right ?? "auto",
              bottom: position.bottom ?? "auto",
              width: size.width ?? "auto",
              height: size.height ?? "auto",
              ...animation,
            }}
          >
            {layer.content}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
