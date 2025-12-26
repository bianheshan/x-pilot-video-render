import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TechTerminalTypingProps {
  commands?: Array<{
    input: string;
    output: string[];
    delay?: number;
  }>;
  theme?: "dark" | "light" | "matrix";
  showPrompt?: boolean;
  promptText?: string;
  typingSpeed?: number;
}

export const TechTerminalTyping: React.FC<TechTerminalTypingProps> = ({
  commands = [
    {
      input: "npm install remotion",
      output: [
        "⠋ Installing dependencies...",
        "✓ remotion@4.0.0",
        "✓ react@19.0.0",
        "✓ Installation complete!",
      ],
      delay: 0,
    },
    {
      input: "npm run dev",
      output: [
        "Starting development server...",
        "Server running at http://localhost:3000",
        "✓ Ready in 1.2s",
      ],
      delay: 90,
    },
  ],
  theme: terminalTheme = "dark",
  showPrompt = true,
  promptText = "user@localhost:~$",
  typingSpeed = 2,
}) => {
  const frame = useCurrentFrame();
  const themeContext = useTheme();

  // 终端主题配置
  const themes = {
    dark: {
      bg: "#1E1E1E",
      text: "#D4D4D4",
      prompt: "#4EC9B0",
      cursor: "#FFFFFF",
      success: "#4EC9B0",
      error: "#F48771",
      warning: "#DCDCAA",
    },
    light: {
      bg: "#FFFFFF",
      text: "#000000",
      prompt: "#0066CC",
      cursor: "#000000",
      success: "#008000",
      error: "#FF0000",
      warning: "#FFA500",
    },
    matrix: {
      bg: "#000000",
      text: "#00FF00",
      prompt: "#00FF00",
      cursor: "#00FF00",
      success: "#00FF00",
      error: "#FF0000",
      warning: "#FFFF00",
    },
  };

  const colors = themes[terminalTheme];

  // 计算当前应该显示的内容
  const getCurrentContent = () => {
    const content: Array<{
      type: "prompt" | "input" | "output";
      text: string;
      color: string;
    }> = [];

    for (const cmd of commands) {
      const startFrame = cmd.delay || 0;

      // 输入阶段
      if (frame >= startFrame) {
        const inputProgress = Math.min(
          (frame - startFrame) / (cmd.input.length * typingSpeed),
          1
        );
        const visibleInput = cmd.input.slice(
          0,
          Math.floor(inputProgress * cmd.input.length)
        );

        if (showPrompt) {
          content.push({
            type: "prompt",
            text: promptText,
            color: colors.prompt,
          });
        }

        content.push({
          type: "input",
          text: visibleInput,
          color: colors.text,
        });

        // 光标
        if (inputProgress < 1) {
          content.push({
            type: "input",
            text: "█",
            color: colors.cursor,
          });
        }

        // 输出阶段
        const outputStartFrame = startFrame + cmd.input.length * typingSpeed;
        if (frame >= outputStartFrame && inputProgress >= 1) {
          const outputProgress = (frame - outputStartFrame) / 30;

          cmd.output.forEach((line, index) => {
            if (outputProgress >= index) {
              const lineProgress = Math.min(outputProgress - index, 1);
              const visibleLine = line.slice(
                0,
                Math.floor(lineProgress * line.length)
              );

              let lineColor = colors.text;
              if (line.includes("✓") || line.includes("complete")) {
                lineColor = colors.success;
              } else if (line.includes("✗") || line.includes("error")) {
                lineColor = colors.error;
              } else if (line.includes("⠋") || line.includes("...")) {
                lineColor = colors.warning;
              }

              content.push({
                type: "output",
                text: visibleLine,
                color: lineColor,
              });

              // 输出光标
              if (lineProgress < 1 && index === Math.floor(outputProgress)) {
                content.push({
                  type: "output",
                  text: "█",
                  color: colors.cursor,
                });
              }
            }
          });
        }
      }
    }

    return content;
  };

  const content = getCurrentContent();

  // 光标闪烁
  const cursorOpacity = interpolate(frame % 30, [0, 15, 30], [1, 0, 1]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeContext.colors.background,
        fontFamily: "'Courier New', monospace",
      }}
    >
      <div
        style={{
          width: "90%",
          height: "80%",
          backgroundColor: colors.bg,
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* 终端标题栏 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "30px",
            backgroundColor: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#FF5F56",
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#FFBD2E",
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#27C93F",
            }}
          />
          <span
            style={{
              marginLeft: "10px",
              fontSize: "12px",
              color: colors.text,
              opacity: 0.7,
            }}
          >
            Terminal
          </span>
        </div>

        {/* 终端内容 */}
        <div
          style={{
            marginTop: "40px",
            fontSize: "16px",
            lineHeight: "1.6",
            color: colors.text,
            fontFamily: "'Fira Code', 'Courier New', monospace",
          }}
        >
          {content.map((item, index) => (
            <span
              key={index}
              style={{
                color: item.color,
                opacity: item.text === "█" ? cursorOpacity : 1,
                display: item.type === "output" ? "block" : "inline",
                marginLeft: item.type === "output" ? "20px" : "0",
              }}
            >
              {item.text}
              {item.type === "prompt" && " "}
            </span>
          ))}
        </div>

        {/* 扫描线效果（Matrix 主题） */}
        {terminalTheme === "matrix" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              backgroundColor: colors.text,
              opacity: 0.3,
              transform: `translateY(${(frame * 5) % 600}px)`,
            }}
          />
        )}
      </div>
    </div>
  );
};
