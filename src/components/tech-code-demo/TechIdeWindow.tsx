import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TechIdeWindowProps {
  files?: Array<{ name: string; icon: string; content: string }>;
  activeFileIndex?: number;
  showSidebar?: boolean;
  showTerminal?: boolean;
  terminalContent?: string[];
}

export const TechIdeWindow: React.FC<TechIdeWindowProps> = ({
  files = [
    {
      name: "App.tsx",
      icon: "⚛️",
      content: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="app">\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;`,
    },
    {
      name: "index.css",
      icon: "🎨",
      content: `.app {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n\nh1 {\n  color: #333;\n  font-size: 2rem;\n}`,
    },
  ],
  activeFileIndex = 0,
  showSidebar = true,
  showTerminal = true,
  terminalContent = [
    "$ npm run dev",
    "Starting development server...",
    "✓ Server running at http://localhost:3000",
  ],
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const activeFile = files[activeFileIndex] || files[0];

  // 打字机效果
  const typingProgress = Math.min(frame / 120, 1);
  const visibleContent = activeFile.content.slice(
    0,
    Math.floor(typingProgress * activeFile.content.length)
  );

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
        backgroundColor: theme.colors.background,
      }}
    >
      <div
        style={{
          width: "95%",
          height: "90%",
          backgroundColor: "#1E1E1E",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 10px 50px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 标题栏 */}
        <div
          style={{
            height: "35px",
            backgroundColor: "#323233",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            gap: "8px",
            borderBottom: "1px solid #2D2D30",
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
              color: "#CCCCCC",
              fontSize: "13px",
            }}
          >
            Visual Studio Code
          </span>
        </div>

        {/* 主内容区 */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* 侧边栏 */}
          {showSidebar && (
            <div
              style={{
                width: "250px",
                backgroundColor: "#252526",
                borderRight: "1px solid #2D2D30",
                padding: "10px",
              }}
            >
              <div
                style={{
                  color: "#CCCCCC",
                  fontSize: "11px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                Explorer
              </div>
              <div style={{ marginLeft: "10px" }}>
                <div
                  style={{
                    color: "#CCCCCC",
                    fontSize: "13px",
                    marginBottom: "5px",
                  }}
                >
                  📁 src
                </div>
                {files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      marginLeft: "20px",
                      padding: "4px 8px",
                      backgroundColor:
                        index === activeFileIndex
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                      color: index === activeFileIndex ? "#FFFFFF" : "#CCCCCC",
                      fontSize: "13px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      marginBottom: "2px",
                    }}
                  >
                    {file.icon} {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 编辑器区域 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* 标签栏 */}
            <div
              style={{
                height: "35px",
                backgroundColor: "#2D2D30",
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #2D2D30",
              }}
            >
              {files.map((file, index) => (
                <div
                  key={index}
                  style={{
                    padding: "0 15px",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor:
                      index === activeFileIndex ? "#1E1E1E" : "transparent",
                    borderRight: "1px solid #2D2D30",
                    color: index === activeFileIndex ? "#FFFFFF" : "#969696",
                    fontSize: "13px",
                  }}
                >
                  {file.icon} {file.name}
                </div>
              ))}
            </div>

            {/* 代码编辑器 */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#1E1E1E",
                padding: "20px",
                overflow: "auto",
                fontFamily: "'Fira Code', monospace",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#D4D4D4",
              }}
            >
              <pre style={{ margin: 0 }}>
                {visibleContent.split("\n").map((line, index) => (
                  <div key={index} style={{ display: "flex" }}>
                    <span
                      style={{
                        color: "#858585",
                        marginRight: "20px",
                        minWidth: "30px",
                        textAlign: "right",
                        userSelect: "none",
                      }}
                    >
                      {index + 1}
                    </span>
                    <span>{line}</span>
                  </div>
                ))}
                <span
                  style={{
                    opacity: cursorOpacity,
                    backgroundColor: "#FFFFFF",
                    width: "8px",
                    height: "18px",
                    display: "inline-block",
                  }}
                />
              </pre>
            </div>

            {/* 终端 */}
            {showTerminal && (
              <div
                style={{
                  height: "150px",
                  backgroundColor: "#1E1E1E",
                  borderTop: "1px solid #2D2D30",
                  padding: "10px 20px",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "13px",
                  color: "#CCCCCC",
                  overflow: "auto",
                }}
              >
                <div
                  style={{
                    marginBottom: "10px",
                    color: "#858585",
                    fontSize: "11px",
                  }}
                >
                  TERMINAL
                </div>
                {terminalContent.map((line, index) => {
                  const lineFrame = frame - index * 30;
                  if (lineFrame < 0) return null;

                  const lineProgress = Math.min(lineFrame / 30, 1);
                  const visibleLine = line.slice(
                    0,
                    Math.floor(lineProgress * line.length)
                  );

                  return (
                    <div key={index} style={{ marginBottom: "5px" }}>
                      {visibleLine}
                      {lineProgress < 1 && (
                        <span
                          style={{
                            opacity: cursorOpacity,
                            backgroundColor: "#FFFFFF",
                            width: "8px",
                            height: "14px",
                            display: "inline-block",
                            marginLeft: "2px",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
