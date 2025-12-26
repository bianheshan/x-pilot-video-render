import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TechCodeDiffProps {
  oldCode?: string;
  newCode?: string;
  language?: string;
  fileName?: string;
  showLineNumbers?: boolean;
  animationDuration?: number;
}

interface DiffLine {
  type: "add" | "remove" | "unchanged";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export const TechCodeDiff: React.FC<TechCodeDiffProps> = ({
  oldCode = `function hello() {
  console.log("Hello");
  return true;
}`,
  newCode = `function hello(name) {
  console.log("Hello, " + name);
  console.log("Welcome!");
  return true;
}`,
  language = "javascript",
  fileName = "example.js",
  showLineNumbers = true,
  animationDuration = 120,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 简单的 diff 算法
  const diffLines = useMemo(() => {
    const oldLines = oldCode.split("\n");
    const newLines = newCode.split("\n");
    const result: DiffLine[] = [];

    let oldIndex = 0;
    let newIndex = 0;

    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      const oldLine = oldLines[oldIndex];
      const newLine = newLines[newIndex];

      if (oldLine === newLine) {
        result.push({
          type: "unchanged",
          content: oldLine,
          oldLineNumber: oldIndex + 1,
          newLineNumber: newIndex + 1,
        });
        oldIndex++;
        newIndex++;
      } else {
        // 检查是否是删除
        if (oldIndex < oldLines.length && !newLines.includes(oldLine)) {
          result.push({
            type: "remove",
            content: oldLine,
            oldLineNumber: oldIndex + 1,
          });
          oldIndex++;
        }
        // 检查是否是添加
        else if (newIndex < newLines.length && !oldLines.includes(newLine)) {
          result.push({
            type: "add",
            content: newLine,
            newLineNumber: newIndex + 1,
          });
          newIndex++;
        }
        // 修改（删除旧的，添加新的）
        else {
          if (oldIndex < oldLines.length) {
            result.push({
              type: "remove",
              content: oldLine,
              oldLineNumber: oldIndex + 1,
            });
            oldIndex++;
          }
          if (newIndex < newLines.length) {
            result.push({
              type: "add",
              content: newLine,
              newLineNumber: newIndex + 1,
            });
            newIndex++;
          }
        }
      }
    }

    return result;
  }, [oldCode, newCode]);

  // 简单的语法高亮
  const highlightCode = (code: string) => {
    const keywords = [
      "function",
      "const",
      "let",
      "var",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "import",
      "export",
    ];
    const strings = code.match(/"[^"]*"|'[^']*'/g) || [];

    let highlighted = code;

    // 高亮字符串
    strings.forEach((str) => {
      highlighted = highlighted.replace(
        str,
        `<span style="color: #CE9178">${str}</span>`
      );
    });

    // 高亮关键字
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: #569CD6">${keyword}</span>`
      );
    });

    // 高亮函数名
    highlighted = highlighted.replace(
      /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
      '<span style="color: #DCDCAA">$1</span>('
    );

    return highlighted;
  };

  // 动画进度
  const progress = Math.min(frame / animationDuration, 1);
  const visibleLines = Math.floor(progress * diffLines.length);

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
          backgroundColor: "#1E1E1E",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* 文件头 */}
        <div
          style={{
            backgroundColor: "#2D2D30",
            padding: "10px 20px",
            borderBottom: "1px solid #3E3E42",
            display: "flex",
            alignItems: "center",
            gap: "10px",
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
              fontSize: "14px",
            }}
          >
            {fileName}
          </span>
          <span
            style={{
              marginLeft: "auto",
              color: "#858585",
              fontSize: "12px",
            }}
          >
            {language}
          </span>
        </div>

        {/* Diff 内容 */}
        <div
          style={{
            display: "flex",
            height: "calc(100% - 50px)",
            overflow: "hidden",
          }}
        >
          {/* 左侧（删除） */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#1E1E1E",
              padding: "20px 10px",
              overflow: "auto",
              borderRight: "1px solid #3E3E42",
            }}
          >
            {diffLines.slice(0, visibleLines).map((line, index) => {
              if (line.type === "add") return null;

              const bgColor =
                line.type === "remove"
                  ? "rgba(255, 0, 0, 0.2)"
                  : "transparent";

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    backgroundColor: bgColor,
                    padding: "2px 10px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  {showLineNumbers && (
                    <span
                      style={{
                        color: "#858585",
                        marginRight: "20px",
                        minWidth: "30px",
                        textAlign: "right",
                        userSelect: "none",
                      }}
                    >
                      {line.oldLineNumber || ""}
                    </span>
                  )}
                  <span
                    style={{
                      color: line.type === "remove" ? "#FF6B6B" : "#D4D4D4",
                    }}
                  >
                    {line.type === "remove" && "- "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightCode(line.content),
                      }}
                    />
                  </span>
                </div>
              );
            })}
          </div>

          {/* 右侧（添加） */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#1E1E1E",
              padding: "20px 10px",
              overflow: "auto",
            }}
          >
            {diffLines.slice(0, visibleLines).map((line, index) => {
              if (line.type === "remove") return null;

              const bgColor =
                line.type === "add" ? "rgba(0, 255, 0, 0.2)" : "transparent";

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    backgroundColor: bgColor,
                    padding: "2px 10px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  {showLineNumbers && (
                    <span
                      style={{
                        color: "#858585",
                        marginRight: "20px",
                        minWidth: "30px",
                        textAlign: "right",
                        userSelect: "none",
                      }}
                    >
                      {line.newLineNumber || ""}
                    </span>
                  )}
                  <span
                    style={{
                      color: line.type === "add" ? "#4EC9B0" : "#D4D4D4",
                    }}
                  >
                    {line.type === "add" && "+ "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightCode(line.content),
                      }}
                    />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
