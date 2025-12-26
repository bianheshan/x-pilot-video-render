import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  fields: Array<{
    name: string;
    type: string;
    isPrimaryKey?: boolean;
    isForeignKey?: boolean;
  }>;
}

export interface Relation {
  from: string;
  to: string;
  fromField: string;
  toField: string;
  type: "one-to-one" | "one-to-many" | "many-to-many";
}

export interface TechDatabaseSchemaProps {
  tables?: Table[];
  relations?: Relation[];
  animateTables?: boolean;
  animateRelations?: boolean;
}

export const TechDatabaseSchema: React.FC<TechDatabaseSchemaProps> = ({
  tables = [
    {
      id: "users",
      name: "users",
      x: 100,
      y: 100,
      fields: [
        { name: "id", type: "INT", isPrimaryKey: true },
        { name: "username", type: "VARCHAR(50)" },
        { name: "email", type: "VARCHAR(100)" },
        { name: "created_at", type: "TIMESTAMP" },
      ],
    },
    {
      id: "posts",
      name: "posts",
      x: 500,
      y: 100,
      fields: [
        { name: "id", type: "INT", isPrimaryKey: true },
        { name: "user_id", type: "INT", isForeignKey: true },
        { name: "title", type: "VARCHAR(200)" },
        { name: "content", type: "TEXT" },
        { name: "created_at", type: "TIMESTAMP" },
      ],
    },
    {
      id: "comments",
      name: "comments",
      x: 500,
      y: 400,
      fields: [
        { name: "id", type: "INT", isPrimaryKey: true },
        { name: "post_id", type: "INT", isForeignKey: true },
        { name: "user_id", type: "INT", isForeignKey: true },
        { name: "content", type: "TEXT" },
        { name: "created_at", type: "TIMESTAMP" },
      ],
    },
  ],
  relations = [
    {
      from: "users",
      to: "posts",
      fromField: "id",
      toField: "user_id",
      type: "one-to-many",
    },
    {
      from: "posts",
      to: "comments",
      fromField: "id",
      toField: "post_id",
      type: "one-to-many",
    },
    {
      from: "users",
      to: "comments",
      fromField: "id",
      toField: "user_id",
      type: "one-to-many",
    },
  ],
  animateTables = true,
  animateRelations = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const fps = 30;

  // 表格动画
  const tableScale = animateTables
    ? spring({
        frame,
        fps,
        config: {
          damping: 15,
          stiffness: 100,
        },
      })
    : 1;

  // 关系线动画
  const relationProgress = animateRelations
    ? Math.min(frame / 60, 1)
    : 1;

  // 计算关系线路径
  const getRelationPath = (relation: Relation) => {
    const fromTable = tables.find((t) => t.id === relation.from);
    const toTable = tables.find((t) => t.id === relation.to);

    if (!fromTable || !toTable) return "";

    const fromFieldIndex = fromTable.fields.findIndex(
      (f) => f.name === relation.fromField
    );
    const toFieldIndex = toTable.fields.findIndex(
      (f) => f.name === relation.toField
    );

    const fromX = fromTable.x + 250;
    const fromY = fromTable.y + 40 + fromFieldIndex * 30 + 15;
    const toX = toTable.x;
    const toY = toTable.y + 40 + toFieldIndex * 30 + 15;

    // 贝塞尔曲线控制点
    const controlX1 = fromX + (toX - fromX) / 3;
    const controlX2 = fromX + ((toX - fromX) * 2) / 3;

    return `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;
  };

  // 渲染表格
  const renderTable = (table: Table, index: number) => {
    const delay = index * 15;
    const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <g
        key={table.id}
        transform={`translate(${table.x}, ${table.y}) scale(${tableScale})`}
        style={{ opacity }}
      >
        {/* 表格背景 */}
        <rect
          width="250"
          height={40 + table.fields.length * 30}
          fill={theme.colors.background}
          stroke={theme.colors.primary}
          strokeWidth="2"
          rx="8"
        />

        {/* 表头 */}
        <rect
          width="250"
          height="40"
          fill={theme.colors.primary}
          rx="8"
          ry="0"
        />
        <text
          x="125"
          y="25"
          fill="#FFFFFF"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          📊 {table.name}
        </text>

        {/* 字段列表 */}
        {table.fields.map((field, fieldIndex) => (
          <g key={field.name} transform={`translate(0, ${40 + fieldIndex * 30})`}>
            <line
              x1="0"
              y1="0"
              x2="250"
              y2="0"
              stroke={theme.colors.text}
              strokeWidth="1"
              opacity="0.2"
            />
            <text
              x="10"
              y="20"
              fill={
                field.isPrimaryKey
                  ? "#FFD700"
                  : field.isForeignKey
                  ? theme.colors.accent
                  : theme.colors.text
              }
              fontSize="13"
              fontFamily="'Fira Code', monospace"
            >
              {field.isPrimaryKey && "🔑 "}
              {field.isForeignKey && "🔗 "}
              {field.name}
            </text>
            <text
              x="240"
              y="20"
              fill={theme.colors.text}
              fontSize="11"
              textAnchor="end"
              opacity="0.7"
              fontFamily="'Fira Code', monospace"
            >
              {field.type}
            </text>
          </g>
        ))}
      </g>
    );
  };

  // 渲染关系线
  const renderRelation = (relation: Relation, index: number) => {
    const path = getRelationPath(relation);
    const delay = tables.length * 15 + index * 20;
    const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const pathLength = 500; // 估算路径长度
    const dashOffset = pathLength * (1 - relationProgress);

    return (
      <g key={`${relation.from}-${relation.to}-${index}`} style={{ opacity }}>
        <path
          d={path}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth="2"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
          markerEnd="url(#arrowhead)"
        />
        {/* 关系类型标签 */}
        {relationProgress >= 1 && (
          <text
            x={(tables.find((t) => t.id === relation.from)?.x || 0) + 300}
            y={
              (tables.find((t) => t.id === relation.from)?.y || 0) +
              ((tables.find((t) => t.id === relation.to)?.y || 0) -
                (tables.find((t) => t.id === relation.from)?.y || 0)) /
                2
            }
            fill={theme.colors.accent}
            fontSize="11"
            textAnchor="middle"
            fontFamily="'Fira Code', monospace"
          >
            {relation.type}
          </text>
        )}
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
      <svg
        width="1080"
        height="720"
        style={{
          backgroundColor: theme.colors.background,
        }}
      >
        <defs>
          {/* 箭头标记 */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill={theme.colors.accent}
            />
          </marker>
        </defs>

        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="24"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          Database Schema (ER Diagram)
        </text>

        {/* 渲染关系线 */}
        {relations.map((relation, index) => renderRelation(relation, index))}

        {/* 渲染表格 */}
        {tables.map((table, index) => renderTable(table, index))}
      </svg>
    </div>
  );
};
