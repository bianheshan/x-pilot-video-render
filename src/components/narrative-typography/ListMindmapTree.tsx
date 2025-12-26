import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface ListMindmapTreeProps {
  rootNode: TreeNode;
  accentColor?: string;
  title?: string;
}

/**
 * 树状列表
 * 列表项以树枝分叉形式展开，展示从属关系
 */
export const ListMindmapTree: React.FC<ListMindmapTreeProps> = ({
  rootNode,
  accentColor,
  title,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  
  // 使用主题颜色或传入的颜色
  const treeColor = accentColor || theme.colors.primary;

  // 递归渲染树节点
  const renderNode = (
    node: TreeNode,
    level: number,
    index: number,
    parentDelay: number
  ): React.ReactElement => {
    const nodeDelay = parentDelay + index * 15;

    // 节点进入动画
    const nodeOpacity = interpolate(
      frame,
      [nodeDelay, nodeDelay + 20],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    const nodeScale = interpolate(
      frame,
      [nodeDelay, nodeDelay + 20],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    // 连接线生长动画
    const lineGrowth = interpolate(
      frame,
      [nodeDelay - 10, nodeDelay + 5],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    const hasChildren = node.children && node.children.length > 0;
    const nodeSize = level === 0 ? 120 : level === 1 ? 100 : 80;
    const fontSize = level === 0 ? 24 : level === 1 ? 20 : 18;

    return (
      <div
        key={node.id}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* 节点 */}
        <div
          style={{
            width: nodeSize,
            height: nodeSize,
            borderRadius: "50%",
            background:
              level === 0
                ? `linear-gradient(135deg, ${treeColor}, ${treeColor}cc)`
                : level === 1
                ? `linear-gradient(135deg, ${treeColor}cc, ${treeColor}99)`
                : `linear-gradient(135deg, ${treeColor}99, ${treeColor}66)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 15,
            boxShadow: `0 0 ${20 + level * 5}px ${treeColor}${level === 0 ? "88" : level === 1 ? "66" : "44"}`,
            border: `3px solid ${level === 0 ? theme.colors.text : theme.colors.textSecondary}`,
            transform: `scale(${nodeScale})`,
            opacity: nodeOpacity,
            position: "relative",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: fontSize,
              fontWeight: level === 0 ? "bold" : "600",
              color: theme.colors.text,
              textAlign: "center",
              fontFamily: theme.fonts.body,
              lineHeight: 1.2,
            }}
          >
            {node.label}
          </span>

          {/* 脉冲效果 */}
          {level === 0 && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: `3px solid ${treeColor}`,
                opacity: 0.6 + Math.sin(frame / 15) * 0.4,
                transform: `scale(${1 + Math.sin(frame / 15) * 0.2})`,
              }}
            />
          )}
        </div>

        {/* 子节点容器 */}
        {hasChildren && (
          <div
            style={{
              display: "flex",
              gap: level === 0 ? 80 : 60,
              marginTop: 60,
              position: "relative",
            }}
          >
            {/* 垂直连接线 */}
            <div
              style={{
                position: "absolute",
                top: -60,
                left: "50%",
                width: 3,
                height: 60 * lineGrowth,
                background: `linear-gradient(to bottom, ${treeColor}, ${treeColor}88)`,
                transform: "translateX(-50%)",
                boxShadow: `0 0 10px ${treeColor}66`,
              }}
            />

            {/* 水平分支线 */}
            {node.children!.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  left: "10%",
                  width: `${80 * lineGrowth}%`,
                  height: 3,
                  background: `linear-gradient(to right, ${treeColor}88, ${treeColor}, ${treeColor}88)`,
                  boxShadow: `0 0 10px ${treeColor}66`,
                }}
              />
            )}

            {node.children!.map((child, childIndex) => (
              <div key={child.id} style={{ position: "relative" }}>
                {/* 子节点连接线 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    width: 3,
                    height: 60 * lineGrowth,
                    background: `linear-gradient(to bottom, ${treeColor}88, ${treeColor}66)`,
                    transform: "translateX(-50%)",
                    boxShadow: `0 0 8px ${treeColor}44`,
                  }}
                />

                {renderNode(child, level + 1, childIndex, nodeDelay + 20)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 标题动画
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: theme.colors.background,
        padding: 60,
        overflow: "hidden",
      }}
    >
      {/* 背景网格 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            radial-gradient(circle, ${treeColor}11 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.3,
        }}
      />

      {/* 标题 */}
      {title && (
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: theme.colors.text,
            marginBottom: 80,
            fontFamily: theme.fonts.heading,
            textTransform: "uppercase",
            letterSpacing: 3,
            textShadow: `0 0 20px ${treeColor}66`,
            opacity: titleOpacity,
          }}
        >
          {title}
        </h2>
      )}

      {/* 树状图 */}
      <div style={{ position: "relative" }}>
        {renderNode(rootNode, 0, 0, 20)}
      </div>

      {/* 装饰粒子 */}
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 500 + Math.sin(frame / 30 + i) * 30;
        const x = Math.cos(angle + frame / 100) * radius;
        const y = Math.sin(angle + frame / 100) * radius;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: treeColor,
              transform: `translate(${x}px, ${y}px)`,
              opacity: 0.4,
              boxShadow: `0 0 8px ${treeColor}`,
            }}
          />
        );
      })}

      {/* 底部提示 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: 16,
          color: theme.colors.textSecondary,
          fontFamily: theme.fonts.mono,
          letterSpacing: 2,
        }}
      >
        MINDMAP TREE STRUCTURE
      </div>
    </div>
  );
};
