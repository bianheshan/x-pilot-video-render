import React from "react";
import { TimelineLayout, TimelineItem } from "../TimelineLayout";
import { useTheme } from "../../../contexts/ThemeContext";

/**
 * 时间轴布局示例 - 展示产品发展历程
 */
export const TimelineLayoutExample: React.FC = () => {
  const theme = useTheme();

  const milestones: TimelineItem[] = [
    {
      content: (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding: 30,
            maxWidth: 400,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: theme.colors.primary,
              marginBottom: 15,
            }}
          >
            项目启动
          </h3>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
            确定技术栈，搭建基础架构，完成核心组件开发框架设计。
          </p>
        </div>
      ),
      label: "Phase 1",
      timestamp: "2024-01",
      side: "left",
      icon: "🚀",
      delay: 0,
    },
    {
      content: (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding: 30,
            maxWidth: 400,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: theme.colors.secondary,
              marginBottom: 15,
            }}
          >
            组件库开发
          </h3>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
            开发 100+ 可复用组件，涵盖图表、动画、3D、文字排版等多个类别。
          </p>
        </div>
      ),
      label: "Phase 2",
      timestamp: "2024-03",
      side: "right",
      icon: "🎨",
      delay: 10,
    },
    {
      content: (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding: 30,
            maxWidth: 400,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#4facfe",
              marginBottom: 15,
            }}
          >
            布局系统升级
          </h3>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
            实现 9 种高级布局模式，支持复杂的动画效果和视差滚动。
          </p>
        </div>
      ),
      label: "Phase 3",
      timestamp: "2024-06",
      side: "left",
      icon: "📐",
      delay: 20,
    },
    {
      content: (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding: 30,
            maxWidth: 400,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#f093fb",
              marginBottom: 15,
            }}
          >
            AI 集成
          </h3>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
            集成 AI 能力，支持智能场景生成、自动配色、内容推荐等功能。
          </p>
        </div>
      ),
      label: "Phase 4",
      timestamp: "2024-09",
      side: "right",
      icon: "🤖",
      delay: 30,
    },
    {
      content: (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding: 30,
            maxWidth: 400,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#fa709a",
              marginBottom: 15,
            }}
          >
            正式发布
          </h3>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
            完成测试和优化，正式发布 v1.0 版本，开始服务用户。
          </p>
        </div>
      ),
      label: "Phase 5",
      timestamp: "2024-12",
      side: "left",
      icon: "🎉",
      delay: 40,
    },
  ];

  return (
    <TimelineLayout
      items={milestones}
      orientation="vertical"
      lineColor="rgba(255,255,255,0.2)"
      lineWidth={3}
      dotSize={24}
      dotColor={theme.colors.primary}
      spacing={150}
      padding={80}
      backgroundColor="#0a0a0a"
      staggerDelay={10}
      autoAlternate={true}
    />
  );
};
