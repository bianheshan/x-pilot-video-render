import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface GitCommit {
  id: string;
  message: string;
  branch: string;
  x: number;
  y: number;
  author?: string;
}

export interface GitBranch {
  name: string;
  color: string;
  y: number;
}

export interface TechGitBranchProps {
  commits?: GitCommit[];
  branches?: GitBranch[];
  animateCommits?: boolean;
}

export const TechGitBranch: React.FC<TechGitBranchProps> = ({
  commits = [
    { id: "c1", message: "Initial commit", branch: "main", x: 100, y: 300 },
    { id: "c2", message: "Add feature A", branch: "main", x: 250, y: 300 },
    { id: "c3", message: "Start feature B", branch: "feature", x: 400, y: 200 },
    { id: "c4", message: "Fix bug", branch: "main", x: 400, y: 300 },
    { id: "c5", message: "Complete feature B", branch: "feature", x: 550, y: 200 },
    { id: "c6", message: "Merge feature B", branch: "main", x: 700, y: 300 },
  ],
  branches = [
    { name: "main", color: "#4EC9B0", y: 300 },
    { name: "feature", color: "#DCDCAA", y: 200 },
  ],
  animateCommits = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 渲染提交节点
  const renderCommit = (commit: GitCommit, index: number) => {
    const delay = index * 20;
    const opacity = animateCommits
      ? interpolate(frame - delay, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

    const scale = animateCommits
      ? interpolate(frame - delay, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

    const branch = branches.find((b) => b.name === commit.branch);
    const color = branch?.color || "#FFFFFF";

    return (
      <g
        key={commit.id}
        transform={`translate(${commit.x}, ${commit.y}) scale(${scale})`}
        style={{ opacity }}
      >
        {/* 提交节点 */}
        <circle r="15" fill={color} stroke={theme.colors.text} strokeWidth="2" />

        {/* 提交 ID */}
        <text
          y="5"
          fill={theme.colors.background}
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          {commit.id}
        </text>

        {/* 提交信息 */}
        <text
          y="-25"
          fill={theme.colors.text}
          fontSize="13"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          {commit.message}
        </text>
      </g>
    );
  };

  // 渲染连接线
  const renderConnections = () => {
    const connections: React.ReactNode[] = [];

    for (let i = 0; i < commits.length - 1; i++) {
      const from = commits[i];
      const to = commits[i + 1];

      const delay = i * 20 + 15;
      const opacity = animateCommits
        ? interpolate(frame - delay, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : 1;

      // 检查是否是分支或合并
      const isBranch = from.branch !== to.branch && i === 1;
      const isMerge = from.branch !== to.branch && i === commits.length - 2;

      if (isBranch || isMerge) {
        // 贝塞尔曲线
        const controlX = (from.x + to.x) / 2;
        const path = `M ${from.x} ${from.y} Q ${controlX} ${(from.y + to.y) / 2} ${to.x} ${to.y}`;

        connections.push(
          <path
            key={`${from.id}-${to.id}`}
            d={path}
            fill="none"
            stroke={branches.find((b) => b.name === to.branch)?.color || "#FFFFFF"}
            strokeWidth="3"
            opacity={opacity}
            markerEnd="url(#arrowhead)"
          />
        );
      } else if (from.branch === to.branch) {
        // 直线
        connections.push(
          <line
            key={`${from.id}-${to.id}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={branches.find((b) => b.name === from.branch)?.color || "#FFFFFF"}
            strokeWidth="3"
            opacity={opacity}
            markerEnd="url(#arrowhead)"
          />
        );
      }
    }

    return connections;
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
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill={theme.colors.text} />
          </marker>
        </defs>

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
          🌿 Git Branch Flow
        </text>

        {/* 分支标签 */}
        {branches.map((branch) => (
          <g key={branch.name} transform={`translate(50, ${branch.y})`}>
            <rect
              width="80"
              height="30"
              fill={branch.color}
              rx="15"
              opacity="0.8"
            />
            <text
              x="40"
              y="20"
              fill={theme.colors.background}
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="'Fira Code', monospace"
            >
              {branch.name}
            </text>
          </g>
        ))}

        {/* 渲染连接线 */}
        {renderConnections()}

        {/* 渲染提交节点 */}
        {commits.map((commit, index) => renderCommit(commit, index))}

        {/* 图例 */}
        <g transform="translate(800, 500)">
          <text
            x="0"
            y="0"
            fill={theme.colors.text}
            fontSize="14"
            fontWeight="bold"
            fontFamily="'Fira Code', monospace"
          >
            Legend:
          </text>
          <circle cx="10" cy="25" r="8" fill="#4EC9B0" />
          <text
            x="25"
            y="30"
            fill={theme.colors.text}
            fontSize="12"
            fontFamily="'Fira Code', monospace"
          >
            Commit
          </text>
          <line
            x1="10"
            y1="50"
            x2="50"
            y2="50"
            stroke="#4EC9B0"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />
          <text
            x="60"
            y="55"
            fill={theme.colors.text}
            fontSize="12"
            fontFamily="'Fira Code', monospace"
          >
            Flow
          </text>
        </g>
      </svg>
    </div>
  );
};
