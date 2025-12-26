import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface AISpeakerProps {
  name?: string;
  avatar?: string;
  position?: "left" | "right";
  size?: number;
  speaking?: boolean;
}

/**
 * AI 数字人组件 - 模拟讲解者形象
 * 可以放置在视频的左侧或右侧
 */
export const AISpeaker: React.FC<AISpeakerProps> = ({
  name = "AI Assistant",
  avatar,
  position = "right",
  size = 200,
  speaking = true,
}) => {
  const frame = useCurrentFrame();

  // 呼吸动画效果
  const scale = speaking
    ? interpolate(frame % 60, [0, 30, 60], [1, 1.05, 1])
    : 1;

  // 光晕动画
  const glowOpacity = speaking
    ? interpolate(frame % 60, [0, 30, 60], [0.3, 0.6, 0.3])
    : 0.3;

  const positionStyle: React.CSSProperties =
    position === "left"
      ? { left: 40, top: "50%", transform: "translateY(-50%)" }
      : { right: 40, top: "50%", transform: "translateY(-50%)" };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {/* 头像容器 */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid #3b82f6",
          boxShadow: `0 0 ${30 * scale}px rgba(59, 130, 246, ${glowOpacity})`,
          transform: `scale(${scale})`,
          transition: "transform 0.3s ease",
          backgroundColor: "#1e293b",
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          // 默认头像：渐变圆形
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: size * 0.4,
              color: "white",
              fontWeight: "bold",
            }}
          >
            AI
          </div>
        )}
      </div>

      {/* 名称标签 */}
      <div
        style={{
          marginTop: 12,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "8px 16px",
          borderRadius: 8,
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: 20,
            margin: 0,
            fontWeight: 600,
          }}
        >
          {name}
        </p>
      </div>

      {/* 说话指示器 */}
      {speaking && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            gap: 4,
          }}
        >
          {[0, 1, 2].map((i) => {
            const height = interpolate(
              (frame + i * 10) % 30,
              [0, 15, 30],
              [4, 16, 4]
            );
            return (
              <div
                key={i}
                style={{
                  width: 4,
                  height,
                  backgroundColor: "#3b82f6",
                  borderRadius: 2,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
