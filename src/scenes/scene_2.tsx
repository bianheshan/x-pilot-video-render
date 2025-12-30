import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Sequence, useVideoConfig } from "remotion";
import { 
  CardGlassmorphism, 
  ListStaggeredEntry, 
  Subtitle,
  SafeArea
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景索引：1
 * 场景 ID：scene_2
 * 场景目标：Define Satyagraha and list the early experiments.
 * 布局方式：main-content.center
 * 持续时间：14.0 秒 (420 帧)
 * 
 * 组件清单：
 * - S2_C1_Quote: quote-block
 * - S2_C2_Locations: bullet-points
 */
export default function Scene2() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // 场景配置
  const durationInSeconds = 14.0;
  const durationInFrames = durationInSeconds * fps;
  
  // 颜色配置 (来自 JSON config)
  const primaryColor = "#FF9933"; // Saffron
  const secondaryColor = "#138808"; // Green
  const accentColor = "#000080"; // Navy Blue
  const textColor = "#2C2C2C";
  const paperBg = "#F4E4BC";

  // 背景动画 (Parallax effect)
  const bgScale = interpolate(frame, [0, durationInFrames], [1.0, 1.15]);
  const bgOpacity = interpolate(frame, [0, 20], [0, 1]);

  // 引用卡片动画 (Scale up gentle)
  const quoteOpacity = interpolate(frame, [10, 40], [0, 1]);
  const quoteTranslateY = interpolate(frame, [10, 40], [20, 0], { extrapolateRight: "clamp" });

  // 列表动画 (Staggered fade in up)
  // ListStaggeredEntry 组件内部处理了 stagger，这里只需要控制整体容器的出现
  const listStartFrame = 60; // 2秒后开始显示列表
  
  return (
    <AbsoluteFill style={{ backgroundColor: paperBg }}>
      {/* 1. 背景层 - 历史图片 + 视差效果 */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img 
          src="https://server.x-pilot.ai/static/meta-doc/zip/6848983ab881878abaadf19c18e0cf86/images/16d421362bf6f0322e36273bc3a28cf9911595965c69c86f897dffff2a0166e5.jpg"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${bgScale})`,
            opacity: bgOpacity,
            filter: 'sepia(0.3) contrast(1.1)' // 增强历史感
          }}
        />
        {/* 叠加层，确保文字可读性 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(to bottom, ${paperBg}EE, ${paperBg}CC 40%, ${paperBg}EE)`,
        }} />
      </AbsoluteFill>

      <SafeArea>
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: 40,
          paddingBottom: 160 // 留出字幕空间
        }}>
          
          {/* 2. 顶部 - 核心引用 (S2_C1_Quote) */}
          <Sequence from={10}>
            <div style={{ 
              opacity: quoteOpacity, 
              transform: `translateY(${quoteTranslateY}px)`,
              display: 'flex',
              justifyContent: 'center'
            }}>
              <div style={{ maxWidth: 900 }}>
                <CardGlassmorphism
                  title="Mahatma Gandhi"
                  content={
                    <div style={{ 
                      fontFamily: theme.fonts.heading, // 使用 Merriweather 风格
                      fontSize: 32, 
                      lineHeight: 1.4,
                      fontStyle: 'italic',
                      color: textColor
                    }}>
                      "Satyagraha is not physical force... it is pure soul-force. Truth is the very substance of the soul."
                    </div>
                  }
                  icon="🕉️"
                  accentColor={primaryColor}
                  variant="light" // 浅色风格适配历史背景
                  footer="Source: Early Experiments with Truth"
                />
              </div>
            </div>
          </Sequence>

          {/* 3. 底部 - 早期运动列表 (S2_C2_Locations) */}
          <Sequence from={listStartFrame}>
            <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
              <ListStaggeredEntry 
                title="Early Satyagraha Movements"
                items={[
                  { 
                    title: "1917: Champaran", 
                    description: "Peasants struggle against indigo planters",
                    icon: "🌿",
                    accentColor: secondaryColor 
                  },
                  { 
                    title: "1917: Kheda", 
                    description: "Peasant revenue remission",
                    icon: "🌾",
                    accentColor: primaryColor
                  },
                  { 
                    title: "1918: Ahmedabad", 
                    description: "Cotton mill workers' satyagraha",
                    icon: "🏭",
                    accentColor: accentColor
                  }
                ]}
                staggerDelay={15}
                twoColumns={false} // 单列居中显示更稳重
              />
            </div>
          </Sequence>

        </div>
      </SafeArea>

      {/* 4. 字幕 */}
      <Subtitle
        text="In 1915, Mahatma Gandhi returned with a novel weapon: Satyagraha. It wasn't passive resistance, but pure soul-force based on truth and non-violence. He successfully organized movements in Champaran, Kheda, and Ahmedabad."
        startFrame={0}
        durationInFrames={durationInFrames}
        variant="solid" // 清晰的背景以保证在复杂纹理上可见
        speakerLabel="Narrator"
        emphasisWords={["Satyagraha", "soul-force", "truth", "non-violence", "Champaran", "Kheda", "Ahmedabad"]}
      />
    </AbsoluteFill>
  );
}
