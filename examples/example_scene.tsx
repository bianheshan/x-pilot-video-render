import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TitleCard, Subtitle, AISpeaker, FullScreen } from "../src/components";

/**
 * 示例场景 - DNA 双链结构介绍
 * 这是一个完整的场景示例，展示如何使用公共组件
 */
export const DNAIntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // 背景渐变动画
  const bgOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <FullScreen
      backgroundColor="#0f172a"
      overlay={false}
    >
      {/* AI 讲解者 */}
      <AISpeaker
        name="AI 生物老师"
        position="right"
        size={180}
        speaking={true}
      />

      {/* 主要内容区域 */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: "60%",
          opacity: bgOpacity,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            color: "white",
            marginBottom: 40,
            fontWeight: "bold",
          }}
        >
          DNA 双链结构
        </h1>
        <p
          style={{
            fontSize: 36,
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: 30,
          }}
        >
          DNA（脱氧核糖核酸）是生物遗传信息的载体，
          由两条互补的核苷酸链组成双螺旋结构。
        </p>
        <ul
          style={{
            fontSize: 32,
            color: "#cbd5e1",
            lineHeight: 2,
            listStyle: "none",
            padding: 0,
          }}
        >
          <li>✓ 双螺旋结构</li>
          <li>✓ 碱基配对原则</li>
          <li>✓ 遗传信息存储</li>
        </ul>
      </div>

      {/* 字幕 */}
      <Subtitle
        text="DNA 是生命的蓝图"
        position="bottom"
        startFrame={30}
        durationInFrames={60}
      />
    </FullScreen>
  );
};

export default DNAIntroScene;
