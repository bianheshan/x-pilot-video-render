import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TechBrowserMockupProps {
  url?: string;
  pageTitle?: string;
  showScrolling?: boolean;
  content?: React.ReactNode;
}

export const TechBrowserMockup: React.FC<TechBrowserMockupProps> = ({
  url = "https://example.com",
  pageTitle = "Example Website",
  showScrolling = true,
  content,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 浏览器入场动画
  const entryProgress = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(entryProgress, [0, 1], [0.8, 1]);
  const opacity = entryProgress;

  // 滚动动画
  const scrollOffset = showScrolling
    ? interpolate(frame, [60, 180], [0, -500], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
        perspective: "1000px",
      }}
    >
      <div
        style={{
          width: "90%",
          height: "85%",
          transform: `scale(${scale}) rotateX(${interpolate(entryProgress, [0, 1], [10, 0])}deg)`,
          opacity,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* 浏览器标题栏 */}
        <div
          style={{
            height: "40px",
            backgroundColor: "#E8E8E8",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            gap: "8px",
            borderBottom: "1px solid #D0D0D0",
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
              marginLeft: "20px",
              fontSize: "13px",
              color: "#666",
              fontFamily: "'Fira Code', monospace",
            }}
          >
            {pageTitle}
          </span>
        </div>

        {/* 地址栏 */}
        <div
          style={{
            height: "50px",
            backgroundColor: "#F5F5F5",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: "10px",
            borderBottom: "1px solid #D0D0D0",
          }}
        >
          <div style={{ fontSize: "20px" }}>←</div>
          <div style={{ fontSize: "20px" }}>→</div>
          <div style={{ fontSize: "20px" }}>↻</div>
          <div
            style={{
              flex: 1,
              height: "32px",
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              padding: "0 15px",
              border: "1px solid #D0D0D0",
            }}
          >
            <span style={{ fontSize: "14px", marginRight: "8px" }}>🔒</span>
            <span
              style={{
                fontSize: "14px",
                color: "#666",
                fontFamily: "'Fira Code', monospace",
              }}
            >
              {url}
            </span>
          </div>
        </div>

        {/* 页面内容 */}
        <div
          style={{
            height: "calc(100% - 90px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              transform: `translateY(${scrollOffset}px)`,
            }}
          >
            {content || (
              <div style={{ padding: "40px" }}>
                {/* 默认页面内容 */}
                <h1
                  style={{
                    fontSize: "48px",
                    color: "#333",
                    marginBottom: "20px",
                  }}
                >
                  Welcome to {pageTitle}
                </h1>
                <p
                  style={{
                    fontSize: "18px",
                    color: "#666",
                    lineHeight: "1.6",
                    marginBottom: "30px",
                  }}
                >
                  This is a demo browser mockup showing how web pages are
                  displayed in a modern browser.
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginTop: "40px",
                  }}
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: "200px",
                        backgroundColor: "#F0F0F0",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        color: "#999",
                      }}
                    >
                      Card {i}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
