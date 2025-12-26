import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TechMobileDeviceProps {
  deviceType?: "iphone" | "android";
  appName?: string;
  showNotification?: boolean;
  content?: React.ReactNode;
}

export const TechMobileDevice: React.FC<TechMobileDeviceProps> = ({
  deviceType = "iphone",
  appName = "Demo App",
  showNotification = true,
  content,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const fps = 30;

  // 设备入场动画
  const deviceScale = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });

  // 通知动画
  const notificationY = showNotification
    ? interpolate(frame - 60, [0, 20, 100, 120], [-100, 20, 20, -100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : -100;

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
      {/* 手机外壳 */}
      <div
        style={{
          width: "375px",
          height: "667px",
          backgroundColor: "#000000",
          borderRadius: "40px",
          padding: "15px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          transform: `scale(${deviceScale})`,
          position: "relative",
        }}
      >
        {/* 屏幕 */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: "30px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* 状态栏 */}
          <div
            style={{
              height: "44px",
              backgroundColor: "#F8F8F8",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            <span>9:41</span>
            <div style={{ display: "flex", gap: "5px" }}>
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          {/* 应用内容 */}
          <div
            style={{
              height: "calc(100% - 44px)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {content || (
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  {appName}
                </h2>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: "80px",
                      backgroundColor: "#F0F0F0",
                      borderRadius: "12px",
                      padding: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: theme.colors.primary,
                        borderRadius: "25px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          height: "12px",
                          backgroundColor: "#D0D0D0",
                          borderRadius: "6px",
                          marginBottom: "8px",
                        }}
                      />
                      <div
                        style={{
                          height: "12px",
                          backgroundColor: "#E0E0E0",
                          borderRadius: "6px",
                          width: "60%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 通知 */}
          {showNotification && (
            <div
              style={{
                position: "absolute",
                top: `${notificationY}px`,
                left: "10px",
                right: "10px",
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                padding: "15px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: theme.colors.primary,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                📱
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {appName}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  New notification received
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Home 按钮 (iPhone) */}
        {deviceType === "iphone" && (
          <div
            style={{
              position: "absolute",
              bottom: "5px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "134px",
              height: "5px",
              backgroundColor: "#FFFFFF",
              borderRadius: "3px",
            }}
          />
        )}
      </div>
    </div>
  );
};
