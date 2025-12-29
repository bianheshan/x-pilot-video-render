import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ListBulletPoints, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景索引：5
 * 场景 ID：scene_6
 * 场景目标：Reinforce safety rules with 'should'.
 * 布局方式：main-content.center
 * 持续时间：17.0 秒 (510 帧)
 * 
 * 组件清单：
 * - S6_Safety_List: bullet-points (Safety Rules)
 * 
 * 时间轴事件：
 * - 0.0s - 17.0s: List the safety rules clearly.
 */
export default function Scene6() {
  const theme = useTheme();

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at center, #ffffff, #e0f2f1)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 核心内容：安全规则列表 */}
      <Sequence from={0} durationInFrames={510}>
        <div style={{ width: "80%", maxWidth: 800 }}>
          <ListBulletPoints
            title="Safety Rules"
            items={[
              { 
                text: "Wear a helmet", 
                icon: "⛑️", 
                description: "Protect your head" 
              },
              { 
                text: "Ride carefully", 
                icon: "👀", 
                description: "Watch the road" 
              },
              { 
                text: "Follow traffic rules", 
                icon: "🚦", 
                description: "Stop at red lights" 
              }
            ]}
            highlightColor={theme.colors.secondary} // 使用绿色强调安全
            showIndex={true}
            staggerDelay={45} // 稍微慢一点的交错动画，配合语音节奏
          />
        </div>
      </Sequence>

      {/* 字幕层 */}
      <Sequence from={0} durationInFrames={120}>
        <Subtitle
          text="You should wear a helmet."
          startFrame={0}
          durationInFrames={120}
        />
      </Sequence>
      
      <Sequence from={120} durationInFrames={120}>
        <Subtitle
          text="You should ride carefully."
          startFrame={0}
          durationInFrames={120}
        />
      </Sequence>

      <Sequence from={240} durationInFrames={135}>
        <Subtitle
          text="You should follow traffic rules."
          startFrame={0}
          durationInFrames={135}
        />
      </Sequence>

      <Sequence from={375} durationInFrames={135}>
        <Subtitle
          text="Pause. Repeat."
          startFrame={0}
          durationInFrames={135}
          variant="blur" 
        />
      </Sequence>
    </AbsoluteFill>
  );
}
