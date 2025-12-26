import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TechApiRequestProps {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  requestData?: any;
  responseData?: any;
  showDatabase?: boolean;
}

export const TechApiRequest: React.FC<TechApiRequestProps> = ({
  endpoint = "/api/users",
  method = "GET",
  requestData = { userId: 123 },
  responseData = {
    id: 123,
    name: "John Doe",
    email: "john@example.com",
  },
  showDatabase = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 动画阶段
  const stages = {
    request: { start: 0, end: 40 },
    processing: { start: 40, end: 100 },
    database: { start: 60, end: 120 },
    response: { start: 120, end: 160 },
  };

  // 请求数据包位置
  const requestProgress = interpolate(
    frame,
    [stages.request.start, stages.request.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 数据库查询进度
  const dbProgress = interpolate(
    frame,
    [stages.database.start, stages.database.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 响应数据包位置
  const responseProgress = interpolate(
    frame,
    [stages.response.start, stages.response.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const methodColors = {
    GET: "#4EC9B0",
    POST: "#DCDCAA",
    PUT: "#569CD6",
    DELETE: "#F48771",
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
      <svg width="1080" height="720">
        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="28"
          fontWeight="bold"
          textAnchor="middle"
        >
          🌐 API Request Flow
        </text>

        {/* 客户端 */}
        <g transform="translate(100, 300)">
          <rect
            width="150"
            height="120"
            fill={theme.colors.primary}
            stroke={theme.colors.text}
            strokeWidth="2"
            rx="8"
          />
          <text
            x="75"
            y="40"
            fill="#FFFFFF"
            fontSize="40"
            textAnchor="middle"
          >
            💻
          </text>
          <text
            x="75"
            y="80"
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Client
          </text>
          <text
            x="75"
            y="100"
            fill="#FFFFFF"
            fontSize="11"
            textAnchor="middle"
            opacity="0.8"
          >
            Browser/App
          </text>
        </g>

        {/* 服务器 */}
        <g transform="translate(465, 300)">
          <rect
            width="150"
            height="120"
            fill={theme.colors.accent}
            stroke={theme.colors.text}
            strokeWidth="2"
            rx="8"
          />
          <text
            x="75"
            y="40"
            fill="#FFFFFF"
            fontSize="40"
            textAnchor="middle"
          >
            🖥️
          </text>
          <text
            x="75"
            y="80"
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Server
          </text>
          <text
            x="75"
            y="100"
            fill="#FFFFFF"
            fontSize="11"
            textAnchor="middle"
            opacity="0.8"
          >
            API Backend
          </text>
        </g>

        {/* 数据库 */}
        {showDatabase && (
          <g transform="translate(830, 300)">
            <rect
              width="150"
              height="120"
              fill="#569CD6"
              stroke={theme.colors.text}
              strokeWidth="2"
              rx="8"
            />
            <text
              x="75"
              y="40"
              fill="#FFFFFF"
              fontSize="40"
              textAnchor="middle"
            >
              🗄️
            </text>
            <text
              x="75"
              y="80"
              fill="#FFFFFF"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
            >
              Database
            </text>
            <text
              x="75"
              y="100"
              fill="#FFFFFF"
              fontSize="11"
              textAnchor="middle"
              opacity="0.8"
            >
              PostgreSQL
            </text>
          </g>
        )}

        {/* 请求箭头 */}
        {requestProgress > 0 && (
          <>
            <line
              x1={250 + requestProgress * 215}
              y1="360"
              x2={250}
              y2="360"
              stroke={methodColors[method]}
              strokeWidth="3"
              markerEnd="url(#arrowhead-request)"
            />
            {/* 请求数据包 */}
            <g transform={`translate(${250 + requestProgress * 215}, 360)`}>
              <rect
                x="-40"
                y="-30"
                width="80"
                height="60"
                fill={methodColors[method]}
                rx="5"
              />
              <text
                x="0"
                y="-5"
                fill="#FFFFFF"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                {method}
              </text>
              <text
                x="0"
                y="15"
                fill="#FFFFFF"
                fontSize="10"
                textAnchor="middle"
              >
                {endpoint}
              </text>
            </g>
          </>
        )}

        {/* 数据库查询箭头 */}
        {showDatabase && dbProgress > 0 && (
          <>
            <line
              x1={615 + dbProgress * 215}
              y1="360"
              x2={615}
              y2="360"
              stroke="#569CD6"
              strokeWidth="3"
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead-db)"
            />
            {/* SQL 查询 */}
            <g transform={`translate(${615 + dbProgress * 215}, 360)`}>
              <rect
                x="-50"
                y="-25"
                width="100"
                height="50"
                fill="#569CD6"
                rx="5"
              />
              <text
                x="0"
                y="-5"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                SELECT *
              </text>
              <text
                x="0"
                y="10"
                fill="#FFFFFF"
                fontSize="9"
                textAnchor="middle"
              >
                FROM users
              </text>
            </g>
          </>
        )}

        {/* 响应箭头 */}
        {responseProgress > 0 && (
          <>
            <line
              x1={465 - responseProgress * 215}
              y1="400"
              x2={465}
              y2="400"
              stroke="#4EC9B0"
              strokeWidth="3"
              markerEnd="url(#arrowhead-response)"
            />
            {/* 响应数据包 */}
            <g transform={`translate(${465 - responseProgress * 215}, 400)`}>
              <rect
                x="-40"
                y="-30"
                width="80"
                height="60"
                fill="#4EC9B0"
                rx="5"
              />
              <text
                x="0"
                y="-5"
                fill="#FFFFFF"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                200 OK
              </text>
              <text
                x="0"
                y="15"
                fill="#FFFFFF"
                fontSize="10"
                textAnchor="middle"
              >
                JSON Data
              </text>
            </g>
          </>
        )}

        {/* 请求详情 */}
        {frame >= stages.request.end && (
          <g transform="translate(100, 480)">
            <text
              x="0"
              y="0"
              fill={theme.colors.text}
              fontSize="14"
              fontWeight="bold"
            >
              Request:
            </text>
            <text x="0" y="20" fill={theme.colors.text} fontSize="12">
              {JSON.stringify(requestData, null, 2)}
            </text>
          </g>
        )}

        {/* 响应详情 */}
        {frame >= stages.response.end && (
          <g transform="translate(700, 480)">
            <text
              x="0"
              y="0"
              fill={theme.colors.text}
              fontSize="14"
              fontWeight="bold"
            >
              Response:
            </text>
            <text x="0" y="20" fill={theme.colors.text} fontSize="12">
              {JSON.stringify(responseData, null, 2)
                .split("\n")
                .map((line, i) => (
                  <tspan key={i} x="0" dy={i === 0 ? 0 : 15}>
                    {line}
                  </tspan>
                ))}
            </text>
          </g>
        )}

        {/* 箭头标记 */}
        <defs>
          <marker
            id="arrowhead-request"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill={methodColors[method]} />
          </marker>
          <marker
            id="arrowhead-db"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#569CD6" />
          </marker>
          <marker
            id="arrowhead-response"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#4EC9B0" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};
