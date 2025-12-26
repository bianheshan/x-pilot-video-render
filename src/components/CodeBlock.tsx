import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  highlightLines?: number[];
  durationInFrames?: number;
  backgroundColor?: string;
}

/**
 * 代码块组件 - 用于展示代码片段
 * 支持语法高亮提示、行号、标题等
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "javascript",
  title,
  highlightLines = [],
  durationInFrames = 120,
  backgroundColor = "#1e293b",
}) => {
  const frame = useCurrentFrame();

  // 淡入动画
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 代码行
  const lines = code.split("\n");

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: "#0f172a",
          borderRadius: 16,
          padding: 40,
          maxWidth: "90%",
          maxHeight: "80%",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {title && (
          <div
            style={{
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: "2px solid #334155",
            }}
          >
            <h3
              style={{
                color: "#e2e8f0",
                fontSize: 36,
                margin: 0,
                fontWeight: 600,
              }}
            >
              {title}
            </h3>
            <span
              style={{
                color: "#64748b",
                fontSize: 24,
                marginTop: 8,
                display: "inline-block",
              }}
            >
              {language}
            </span>
          </div>
        )}
        <pre
          style={{
            margin: 0,
            fontFamily: "'Fira Code', monospace",
            fontSize: 28,
            lineHeight: 1.6,
            color: "#e2e8f0",
            overflow: "auto",
          }}
        >
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightLines.includes(lineNumber);

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  backgroundColor: isHighlighted
                    ? "rgba(59, 130, 246, 0.2)"
                    : "transparent",
                  padding: "4px 12px",
                  borderLeft: isHighlighted
                    ? "4px solid #3b82f6"
                    : "4px solid transparent",
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  style={{
                    color: "#64748b",
                    marginRight: 24,
                    userSelect: "none",
                    minWidth: 40,
                    textAlign: "right",
                  }}
                >
                  {lineNumber}
                </span>
                <code style={{ color: "#e2e8f0" }}>{line}</code>
              </div>
            );
          })}
        </pre>
      </div>
    </AbsoluteFill>
  );
};
