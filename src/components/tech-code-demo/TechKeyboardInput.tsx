import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TechKeyboardInputProps {
  text?: string;
  showKeyboard?: boolean;
  typingSpeed?: number;
  keyboardLayout?: "qwerty" | "minimal";
}

export const TechKeyboardInput: React.FC<TechKeyboardInputProps> = ({
  text = "Hello, World!",
  showKeyboard = true,
  typingSpeed = 5,
  keyboardLayout = "qwerty",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 打字进度
  const typedLength = Math.min(
    Math.floor(frame / typingSpeed),
    text.length
  );
  const typedText = text.slice(0, typedLength);
  const currentChar = text[typedLength] || "";

  // 光标闪烁
  const cursorOpacity = interpolate(frame % 30, [0, 15, 30], [1, 0, 1]);

  // 键盘布局
  const keyboardKeys = {
    qwerty: [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Z", "X", "C", "V", "B", "N", "M", ",", "."],
    ],
    minimal: [
      ["H", "E", "L", "O", "W", "R", "D"],
      ["!", ",", ".", " "],
    ],
  };

  const keys = keyboardKeys[keyboardLayout];

  // 检查当前按键
  const isKeyPressed = (key: string) => {
    return currentChar.toUpperCase() === key.toUpperCase() ||
           (key === " " && currentChar === " ");
  };

  // 渲染键盘
  const renderKeyboard = () => {
    const keySize = 60;
    const gap = 10;
    const startX = 200;
    const startY = 450;

    return (
      <g transform={`translate(${startX}, ${startY})`}>
        {keys.map((row, rowIndex) => (
          <g key={rowIndex} transform={`translate(${rowIndex * 30}, ${rowIndex * (keySize + gap)})`}>
            {row.map((key, keyIndex) => {
              const pressed = isKeyPressed(key);
              const x = keyIndex * (keySize + gap);
              const y = 0;

              return (
                <g key={key} transform={`translate(${x}, ${y})`}>
                  <rect
                    width={key === " " ? keySize * 3 : keySize}
                    height={keySize}
                    fill={pressed ? theme.colors.accent : theme.colors.primary}
                    stroke={theme.colors.text}
                    strokeWidth="2"
                    rx="8"
                    transform={pressed ? "translate(0, 5)" : ""}
                  />
                  <text
                    x={(key === " " ? keySize * 3 : keySize) / 2}
                    y={keySize / 2 + 8}
                    fill="#FFFFFF"
                    fontSize="20"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="'Fira Code', monospace"
                    transform={pressed ? "translate(0, 5)" : ""}
                  >
                    {key === " " ? "SPACE" : key}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </g>
    );
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
      }}
    >
      <svg width="1080" height="720">
        {/* 标题 */}
        <text
          x="540"
          y="50"
          fill={theme.colors.text}
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          ⌨️ Keyboard Input
        </text>

        {/* 屏幕显示 */}
        <g transform="translate(200, 150)">
          <rect
            width="680"
            height="200"
            fill="#1E1E1E"
            stroke={theme.colors.primary}
            strokeWidth="3"
            rx="10"
          />
          
          {/* 屏幕内容 */}
          <text
            x="340"
            y="110"
            fill="#4EC9B0"
            fontSize="48"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="'Fira Code', monospace"
          >
            {typedText}
            <tspan
              fill="#FFFFFF"
              opacity={cursorOpacity}
            >
              |
            </tspan>
          </text>

          {/* 字符计数 */}
          <text
            x="650"
            y="180"
            fill={theme.colors.text}
            fontSize="14"
            textAnchor="end"
            opacity="0.7"
            fontFamily="'Fira Code', monospace"
          >
            {typedLength} / {text.length}
          </text>
        </g>

        {/* 键盘 */}
        {showKeyboard && renderKeyboard()}

        {/* 提示文本 */}
        <text
          x="540"
          y="680"
          fill={theme.colors.text}
          fontSize="14"
          textAnchor="middle"
          opacity="0.7"
          fontFamily="'Fira Code', monospace"
        >
          Typing: "{text}"
        </text>
      </svg>
    </div>
  );
};
