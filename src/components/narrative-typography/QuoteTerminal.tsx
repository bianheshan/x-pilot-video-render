import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface QuoteTerminalProps {
  quote: string;
  author?: string;
  language?: string;
}

/**
 * 代码注释风引言
 * 像代码注释一样的绿色字体，适合技术引用
 */
export const QuoteTerminal: React.FC<QuoteTerminalProps> = ({
  quote,
  author,
  language = "javascript",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // 打字机效果
  const charsToShow = Math.floor(
    interpolate(frame, [0, 90], [0, quote.length + (author ? author.length + 10 : 0)], {
      extrapolateRight: "clamp",
    })
  );

  const displayedQuote = quote.slice(0, Math.min(charsToShow, quote.length));
  const authorCharsStart = quote.length + 5;
  const displayedAuthor = author
    ? author.slice(0, Math.max(0, charsToShow - authorCharsStart))
    : "";

  // 光标闪烁
  const cursorOpacity = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  // 终端进入动画
  const terminalY = interpolate(frame, [0, 20], [50, 0], {
    extrapolateRight: "clamp",
  });

  const terminalOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 扫描线动画
  const scanlineY = (frame * 2) % 100;

  // 根据语言选择注释符号
  const getCommentSymbol = () => {
    switch (language) {
      case "python":
        return "#";
      case "html":
        return "<!--";
      case "css":
        return "/*";
      default:
        return "//";
    }
  };

  const commentSymbol = getCommentSymbol();
  const closeComment = language === "html" ? " -->" : language === "css" ? " */" : "";

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
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
            linear-gradient(${theme.colors.surfaceLight} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.colors.surfaceLight} 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* 扫描线 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: 2,
          top: `${scanlineY}%`,
          background: theme.colors.primary,
          boxShadow: `0 0 10px ${theme.colors.primary}`,
        }}
      />

      {/* 终端窗口 */}
      <div
        style={{
          width: "90%",
          maxWidth: 1200,
          backgroundColor: theme.colors.surface,
          borderRadius: 10,
          border: `1px solid ${theme.colors.primary}`,
          boxShadow: `0 0 40px ${theme.colors.primary}33`,
          overflow: "hidden",
          transform: `translateY(${terminalY}px)`,
          opacity: terminalOpacity,
        }}
      >
        {/* 终端标题栏 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 20px",
            backgroundColor: theme.colors.background,
            borderBottom: `1px solid ${theme.colors.primary}`,
          }}
        >
          {/* 窗口控制按钮 */}
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ff5f56",
                boxShadow: "0 0 5px #ff5f56",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ffbd2e",
                boxShadow: "0 0 5px #ffbd2e",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#27c93f",
                boxShadow: "0 0 5px #27c93f",
              }}
            />
          </div>

          {/* 终端标题 */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 14,
              color: theme.colors.primary,
              fontFamily: theme.fonts.mono,
              letterSpacing: 1,
            }}
          >
            terminal — {language}
          </div>
        </div>

        {/* 终端内容 */}
        <div
          style={{
            padding: "40px 50px",
            fontFamily: theme.fonts.mono,
            fontSize: 24,
            lineHeight: 1.8,
            color: theme.colors.success,
            minHeight: 300,
          }}
        >
          {/* 提示符 */}
          <div style={{ marginBottom: 20, opacity: 0.7 }}>
            <span style={{ color: theme.colors.success }}>user@terminal</span>
            <span style={{ color: theme.colors.text }}>:</span>
            <span style={{ color: theme.colors.secondary }}>~/quotes</span>
            <span style={{ color: theme.colors.text }}>$ cat quote.{language}</span>
          </div>

          {/* 引言 */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ color: theme.colors.textSecondary, marginRight: 10 }}>
              {commentSymbol}
            </span>
            <span style={{ color: theme.colors.success }}>
              {displayedQuote}
              {charsToShow <= quote.length && (
                <span
                  style={{
                    opacity: cursorOpacity,
                    marginLeft: 2,
                  }}
                >
                  ▊
                </span>
              )}
            </span>
            {language === "html" || language === "css" ? (
              <span style={{ color: "#666666" }}>{closeComment}</span>
            ) : null}
          </div>

          {/* 作者 */}
          {author && charsToShow > authorCharsStart && (
            <div>
              <span style={{ color: "#666666", marginRight: 10 }}>
                {commentSymbol}
              </span>
              <span style={{ color: "#00d4ff" }}>
                — {displayedAuthor}
                {charsToShow < quote.length + author.length + 10 && (
                  <span
                    style={{
                      opacity: cursorOpacity,
                      marginLeft: 2,
                    }}
                  >
                    ▊
                  </span>
                )}
              </span>
              {language === "html" || language === "css" ? (
                <span style={{ color: theme.colors.textSecondary }}>{closeComment}</span>
              ) : null}
            </div>
          )}

          {/* 完成提示 */}
          {charsToShow >= quote.length + (author ? author.length + 10 : 0) && (
            <div
              style={{
                marginTop: 30,
                opacity: interpolate(
                  frame,
                  [90, 110],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }
                ),
              }}
            >
              <span style={{ color: theme.colors.success }}>user@terminal</span>
              <span style={{ color: theme.colors.text }}>:</span>
              <span style={{ color: theme.colors.secondary }}>~/quotes</span>
              <span style={{ color: theme.colors.text }}>$ </span>
              <span
                style={{
                  opacity: cursorOpacity,
                }}
              >
                ▊
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 行号指示器 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 80,
          fontSize: 14,
          color: "#00ff00",
          fontFamily: "monospace",
          opacity: 0.5,
        }}
      >
        {Math.floor(frame / fps)}s
      </div>

      {/* 底部状态栏 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "10px 20px",
          backgroundColor: "#0d0d0d",
          borderTop: "1px solid #00ff00",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 14,
          color: "#00ff00",
          fontFamily: "monospace",
        }}
      >
        <span>TERMINAL MODE</span>
        <span>
          {displayedQuote.length} / {quote.length} chars
        </span>
        <span>{language.toUpperCase()}</span>
      </div>
    </div>
  );
};
