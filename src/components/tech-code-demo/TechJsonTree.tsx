import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TechJsonTreeProps {
  data?: any;
  expandAll?: boolean;
  animateExpansion?: boolean;
  theme?: "dark" | "light";
}

export const TechJsonTree: React.FC<TechJsonTreeProps> = ({
  data = {
    user: {
      id: 12345,
      name: "John Doe",
      email: "john@example.com",
      roles: ["admin", "developer"],
      settings: {
        theme: "dark",
        notifications: true,
        language: "en",
      },
    },
    metadata: {
      timestamp: "2024-01-15T10:30:00Z",
      version: "1.0.0",
    },
  },
  expandAll = false,
  animateExpansion = true,
  theme: jsonTheme = "dark",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const colors = {
    dark: {
      bg: "#1E1E1E",
      text: "#D4D4D4",
      key: "#9CDCFE",
      string: "#CE9178",
      number: "#B5CEA8",
      boolean: "#569CD6",
      null: "#569CD6",
      bracket: "#FFD700",
    },
    light: {
      bg: "#FFFFFF",
      text: "#000000",
      key: "#0066CC",
      string: "#A31515",
      number: "#098658",
      boolean: "#0000FF",
      null: "#0000FF",
      bracket: "#FF8C00",
    },
  };

  const themeColors = colors[jsonTheme];

  // 递归渲染 JSON 树
  const renderValue = (
    value: any,
    key: string | number,
    depth: number = 0,
    path: string = ""
  ): React.ReactNode => {
    const currentPath = path ? `${path}.${key}` : String(key);
    const indent = depth * 20;

    // 动画进度
    const nodeFrame = frame - depth * 10;
    const opacity = animateExpansion
      ? interpolate(nodeFrame, [0, 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

    if (value === null) {
      return (
        <div
          key={currentPath}
          style={{
            marginLeft: `${indent}px`,
            opacity,
            transition: "opacity 0.3s",
          }}
        >
          <span style={{ color: themeColors.key }}>"{key}"</span>
          <span style={{ color: themeColors.text }}>: </span>
          <span style={{ color: themeColors.null }}>null</span>
        </div>
      );
    }

    if (typeof value === "string") {
      return (
        <div
          key={currentPath}
          style={{
            marginLeft: `${indent}px`,
            opacity,
            transition: "opacity 0.3s",
          }}
        >
          <span style={{ color: themeColors.key }}>"{key}"</span>
          <span style={{ color: themeColors.text }}>: </span>
          <span style={{ color: themeColors.string }}>"{value}"</span>
        </div>
      );
    }

    if (typeof value === "number") {
      return (
        <div
          key={currentPath}
          style={{
            marginLeft: `${indent}px`,
            opacity,
            transition: "opacity 0.3s",
          }}
        >
          <span style={{ color: themeColors.key }}>"{key}"</span>
          <span style={{ color: themeColors.text }}>: </span>
          <span style={{ color: themeColors.number }}>{value}</span>
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <div
          key={currentPath}
          style={{
            marginLeft: `${indent}px`,
            opacity,
            transition: "opacity 0.3s",
          }}
        >
          <span style={{ color: themeColors.key }}>"{key}"</span>
          <span style={{ color: themeColors.text }}>: </span>
          <span style={{ color: themeColors.boolean }}>
            {value ? "true" : "false"}
          </span>
        </div>
      );
    }

    if (Array.isArray(value)) {
      const isExpanded = expandAll || nodeFrame > 0;

      return (
        <div key={currentPath} style={{ opacity }}>
          <div
            style={{
              marginLeft: `${indent}px`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "5px",
                color: themeColors.text,
                fontSize: "12px",
              }}
            >
              {isExpanded ? "▼" : "▶"}
            </span>
            <span style={{ color: themeColors.key }}>"{key}"</span>
            <span style={{ color: themeColors.text }}>: </span>
            <span style={{ color: themeColors.bracket }}>[</span>
            {!isExpanded && (
              <span style={{ color: themeColors.text, marginLeft: "5px" }}>
                {value.length} items
              </span>
            )}
            {!isExpanded && (
              <span style={{ color: themeColors.bracket }}>]</span>
            )}
          </div>
          {isExpanded && (
            <>
              {value.map((item, index) =>
                renderValue(item, index, depth + 1, currentPath)
              )}
              <div
                style={{
                  marginLeft: `${indent}px`,
                  color: themeColors.bracket,
                }}
              >
                ]
              </div>
            </>
          )}
        </div>
      );
    }

    if (typeof value === "object") {
      const isExpanded = expandAll || nodeFrame > 0;
      const keys = Object.keys(value);

      return (
        <div key={currentPath} style={{ opacity }}>
          <div
            style={{
              marginLeft: `${indent}px`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "5px",
                color: themeColors.text,
                fontSize: "12px",
              }}
            >
              {isExpanded ? "▼" : "▶"}
            </span>
            <span style={{ color: themeColors.key }}>"{key}"</span>
            <span style={{ color: themeColors.text }}>: </span>
            <span style={{ color: themeColors.bracket }}>{"{"}</span>
            {!isExpanded && (
              <span style={{ color: themeColors.text, marginLeft: "5px" }}>
                {keys.length} keys
              </span>
            )}
            {!isExpanded && (
              <span style={{ color: themeColors.bracket }}>{"}"}</span>
            )}
          </div>
          {isExpanded && (
            <>
              {keys.map((k) =>
                renderValue(value[k], k, depth + 1, currentPath)
              )}
              <div
                style={{
                  marginLeft: `${indent}px`,
                  color: themeColors.bracket,
                }}
              >
                {"}"}
              </div>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
        fontFamily: "'Fira Code', monospace",
      }}
    >
      <div
        style={{
          width: "90%",
          height: "85%",
          backgroundColor: themeColors.bg,
          borderRadius: "8px",
          padding: "20px",
          overflow: "auto",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* 标题 */}
        <div
          style={{
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: `1px solid ${themeColors.text}33`,
          }}
        >
          <span
            style={{
              color: themeColors.text,
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            JSON Viewer
          </span>
        </div>

        {/* JSON 树 */}
        <div
          style={{
            fontSize: "14px",
            lineHeight: "1.8",
            color: themeColors.text,
          }}
        >
          <div style={{ color: themeColors.bracket }}>{"{"}</div>
          {Object.keys(data).map((key) => renderValue(data[key], key, 1))}
          <div style={{ color: themeColors.bracket }}>{"}"}</div>
        </div>
      </div>
    </div>
  );
};
