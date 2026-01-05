# AI Scene 代码生成指南

## 📋 输入格式

Dify 每次生成代码时，会收到**完整的视频 JSON**（包含全部场景）+ **当前要生成的场景索引**。

- **目的**：完整 JSON 用于保持全片一致性（配色/字体/术语/节奏）并避免重复讲解；但**每次只生成一个 scene 文件**。

推荐输入结构（你会同时拿到这两部分信息）：
```json
{
  "video": { "...": "完整视频 JSON（包含 title/config/scenes/...）" },
  "scene_index": 0
}
```

你必须：
- 从 `video.scenes[scene_index]` 取出 `currentScene`
- 仅生成 `currentScene` 对应的场景代码（不要生成其他场景）
- 可读取 `video.config` 与 `video.scenes` 的其他场景信息，用于风格统一与去重

> 说明：`layout` / `components` / `timeline_events` 里的布局与外观字段都只是**指导性建议**，不是硬约束；如果照做会导致重叠/越界/难看，允许你调整为更安全的布局。


## 📤 输出格式

每次只为 `video.scenes[scene_index]` 生成**一个** `.tsx` 文件，放在 `src/scenes/` 目录下。

**文件命名**：
- 优先从 `currentScene.id` 解析数字：例如 `scene_3` → `scene_3.tsx`
- 若解析失败，则用 `scene_{scene_index + 1}.tsx`

> 禁止输出多文件、禁止顺带生成其他 scene。


## 🧠 跨场景一致性与去重（必须利用完整 JSON）

你会拿到全片 `video`，请用它来保证一致性、避免重复讲解：

- **统一风格**：优先使用 `video.config` 的 `art_style` / `animation_style` / `typography` / `color_palette` / `visual_engine`，让每个场景看起来像同一套课。
- **统一语言**：以 `video.config.language` 为准（例如 `en`），所有屏幕文字与字幕语言一致。
- **避免重复讲解**：生成本场景叙事与屏幕文案前，快速扫一遍 `video.scenes[0..scene_index-1]` 的 `target` 与 `subtitles`：
  - 已讲过的定义/比喻/口号不要重复再讲。
  - 如果必须提到已讲过概念，用“延续/承接”的一句话带过即可。
- **布局字段是建议**：`currentScene.layout`、`timeline_events[].layout_intent`、`components[].content` 的 UI/布局描述只是指导，不是硬约束。
  - 当这些建议与“防重叠/可读性/不出界/字幕不遮挡”冲突时，**以渲染安全为最高优先级**，允许你调整布局实现。
- **背景字段优先采纳**：`currentScene.background` 是最直接的视觉基调；优先按其 `type/value` 实现（例如纯色/渐变），但仍需满足可读性（对比度、字幕层清晰）。


---


## 🎨 核心原则

### 1. 直接编写标准 React 代码
**不要导入自定义组件**（只允许 `Subtitle` / `SafeArea`），直接使用第三方库和原生 HTML/CSS。


### 2. 布局与渲染安全规范（避免重叠 / 背景错误 / 元素混乱）

#### ✅ 必须遵守的根布局
- **每个场景根节点必须是**：`<AbsoluteFill>`
- **必须显式设置背景**：`backgroundColor` 或 `background`（禁止依赖透明背景）
- **建议统一**：`overflow: "hidden"` 防止元素跑出画面

推荐骨架（所有场景统一使用）：
```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

export default function Scene{scene_number}() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = useTheme();

  return (
    <AbsoluteFill style={{ background: "#ffffff", overflow: "hidden" }}>
      {/* 背景层（zIndex:0，pointerEvents:none） */}
      <AbsoluteFill style={{ zIndex: 0, pointerEvents: "none" }}>
        {/* 背景装饰/渐变/噪声等 */}
      </AbsoluteFill>

      {/* 主内容层（SafeArea，避免贴边；预留字幕空间） */}
      <SafeArea padding={60} paddingBottom={160} style={{ zIndex: 1 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 32 }}>
          {/* 主内容尽量用 flex/grid 流式布局，减少 absolute */}
        </div>
      </SafeArea>

      {/* 字幕层（永远放最上层，避免被遮挡） */}
      {/* Subtitle 内部会根据 startFrame/durationInFrames 自动显隐，不要再包一层 Sequence */}
      <Subtitle text={"..."} startFrame={0} durationInFrames={fps * 3} />
    </AbsoluteFill>
  );
}
```

#### 🚫 防重叠硬规则
- **主内容不要用 `position: absolute`**（除非是明确的标注/强调层），优先用 `flex`/`grid`。
- 需要叠层时必须设定 **`zIndex` 分层约定**：背景 0、内容 1、强调层 2、字幕 999。
- 所有卡片/图表必须有 **明确尺寸约束**：`maxWidth` / `width` / `height`，不要让内容自然溢出。
- 任何会动的元素（粒子/3D/噪声）都放在 **背景层** 并 `pointerEvents: "none"`。

#### 🎨 背景错误规避
- 每个场景 **必须**设置 `background` 或 `backgroundColor`。
- 禁止使用纯黑 `#000` 作为默认背景（除非视觉概念明确要求）。
- 渐变背景优先使用 `linear-gradient(...)` 并提供兜底纯色。

#### 🧾 字幕规范（避免混乱/重叠）
输入 JSON 的字幕通常是**全片绝对时间**（`start_time_seconds`/`end_time_seconds`），而 scene 内渲染需要**以本场景从 0 开始的相对时间**。

- 先计算本场景起始时间（秒）：
  - `sceneStartSeconds = min( currentScene.timeline_events[].start_time_seconds, currentScene.subtitles[].start_time_seconds )`
- 对每条字幕：
  - `localStartFrame = Math.max(0, Math.round((subtitle.start_time_seconds - sceneStartSeconds) * fps))`
  - `durationInFrames = Math.max(1, Math.round((subtitle.end_time_seconds - subtitle.start_time_seconds) * fps))`
- 不要让两条字幕在帧上重叠；若存在重叠，后者 `localStartFrame` 至少比前者结束多 1 帧。
- 不要同时使用 `Sequence` 和 `Subtitle.startFrame` 做双重时间控制（会导致错位）。


---

### 3. 可用技术栈（教学视频专用）

#### 📊 数据可视化
```tsx
// Recharts - React 图表库（推荐教学视频）
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, RadarChart, Radar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// D3.js - 高级数据可视化
import * as d3 from 'd3';
import * as d3Cloud from 'd3-cloud'; // 词云
import * as d3Sankey from 'd3-sankey'; // 桑基图

// Chart.js + React Chart.js 2（模板已内置）
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// @visx - Airbnb 可视化库（SVG 动画友好）
// 推荐按子包引入（更准确）
import { Bar } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
```

#### 🎬 动画与过渡
```tsx
// Remotion 内置（核心）
import { interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';

// Remotion 官方动画库（推荐教学视频）
import { TransitionSeries, fade, slide, wipe } from '@remotion/transitions';
import { MotionBlur } from '@remotion/motion-blur';

// 资源预加载（避免首帧白屏/闪烁）
import { preloadImage, preloadVideo } from '@remotion/preload';

// 字幕/字幕轨（适合教学视频）
import { createTikTokStyleCaptions } from '@remotion/captions';

// Framer Motion - 流畅动画
import { motion } from 'framer-motion';

// React Spring - 物理动画
import { useSpring, animated } from 'react-spring';

// GSAP - 专业级动画（模板已内置）
import gsap from 'gsap';

// animejs - 轻量级动画（模板已内置）
import anime from 'animejs';

// Lottie - After Effects 动画
import { Lottie } from '@remotion/lottie';
```

#### 🎨 矢量图形与绘制
```tsx
// @remotion/shapes - 官方形状库（模板已内置）
import { Circle, Rect, Triangle, Polygon } from '@remotion/shapes';

// @remotion/paths - SVG 路径动画（模板已内置）
import { evolvePath } from '@remotion/paths';

// @remotion/skia - 高性能 2D 绘制（模板已内置）
import { Skia, Canvas } from '@remotion/skia';

// React Konva - Canvas 绘图（模板已内置）
import { Stage, Layer, Rect, Circle } from 'react-konva';
```

#### 🌐 3D 场景
```tsx
// React Three Fiber + Drei（已安装）
import { Canvas } from '@react-three/fiber';
import { Box, Sphere, Cone, Torus, OrbitControls, PerspectiveCamera, Environment, Center, Text3D, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// @remotion/three - Remotion 官方 Three.js 集成
import { ThreeCanvas } from '@remotion/three';

// @react-three/cannon - 物理引擎
import { Physics, useBox, useSphere } from '@react-three/cannon';
```

#### ✍️ 文本特效
```tsx
// Typed.js - 打字机效果（已安装）
import Typed from 'typed.js';

// Prism.js - 代码高亮（已安装）
import Prism from 'prismjs';
// 注意：不要在场景里 import 外部 CSS（保持渲染环境可控）。需要高亮时，使用 Prism 生成 HTML + 内联样式，或复用项目内现有的代码展示组件。

// 字体：不要在 scene 里使用 @remotion/google-fonts/*。
// 原因：字体子模块名很容易被“猜错”（例如 FredokaOne 不存在）导致 bundling 直接失败；
// 同时 Google Fonts 可能引入 delayRender 超时风险。
// 统一使用 theme.fonts.heading/body/mono 或系统字体栈即可。
```

#### 🎞️ 媒体与特效
```tsx
// @remotion/gif - GIF 渲染（模板已内置）
import { Gif } from '@remotion/gif';

// @remotion/noise - 噪声效果（模板已内置）
import { noise2D } from '@remotion/noise';

// @remotion/media-utils - 音视频工具（已安装）
import { getVideoMetadata, getAudioDuration } from '@remotion/media-utils';
```

#### 🎯 UI 组件与工具
```tsx
// Lucide React - 图标库（已安装）
import { Play, Pause, Download, ArrowRight, Zap, Lightbulb, BookOpen, GraduationCap } from 'lucide-react';

// TailwindCSS 工具（已安装 clsx + tailwind-merge）
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: Array<string | undefined | null | false>) => twMerge(clsx(inputs));
```

#### 📐 布局工具
```tsx
// @remotion/layout-utils - 布局辅助（模板已内置）
import { measureText, fitText } from '@remotion/layout-utils';
```

#### 📝 基础组件（项目自带，仅建议使用这些）
```tsx
import { Subtitle, SafeArea } from "../components";
```
- `Subtitle`: 字幕（内部按 `startFrame`/`durationInFrames` 自行控制显隐）
- `SafeArea`: 安全边距容器（避免贴边/被裁切），默认 padding=60

---

## 📐 场景模板

### 模板 1：图表场景

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

export default function Scene1() {
  const frame = useCurrentFrame();
  const theme = useTheme();
  
  // 原始数据
  const rawData = [
    { name: 'A', value: 100 },
    { name: 'B', value: 200 },
    { name: 'C', value: 150 },
  ];
  
  // 动画数据（0-60帧从0增长到目标值）
  const animatedData = rawData.map(item => ({
    ...item,
    value: interpolate(frame, [0, 60], [0, item.value], { extrapolateRight: 'clamp' })
  }));
  
  // 标题动画
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 80,
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* 标题 */}
      <div style={{ opacity: titleOpacity, marginBottom: 40 }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: 64, 
          fontFamily: theme.fonts.heading,
          textShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          Data Overview
        </h1>
      </div>
      
      {/* 图表 */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        padding: 40
      }}>
        <BarChart width={1200} height={600} data={animatedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
          <XAxis dataKey="name" stroke="white" />
          <YAxis stroke="white" />
          <Tooltip />
          <Bar dataKey="value" fill="#00C896" radius={[8, 8, 0, 0]} />
        </BarChart>
      </div>
      
      {/* 字幕 */}
      <Subtitle text="This is the data overview" startFrame={0} durationInFrames={180} />
    </AbsoluteFill>
  );
}
```

---

### 模板 2：3D 场景

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls, Environment } from '@react-three/drei';

export default function Scene2() {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* 环境光 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        {/* 3D 物体 */}
        <Box 
          args={[2, 2, 2]}
          rotation={[frame * 0.01, frame * 0.02, 0]}
        >
          <meshStandardMaterial color="#00C896" metalness={0.5} roughness={0.2} />
        </Box>
        
        {/* 环境贴图 */}
        <Environment preset="sunset" />
        
        {/* 控制器（可选） */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </AbsoluteFill>
  );
}
```

---

### 模板 3：文本 + 布局

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

export default function Scene3() {
  const frame = useCurrentFrame();
  const theme = useTheme();
  
  // 淡入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ 
      background: '#F3F4F6',
      padding: 80,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      
      <div style={{ opacity, textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 72, 
          color: '#1e293b',
          fontFamily: theme.fonts.heading,
          marginBottom: 32
        }}>
          Welcome
        </h1>
        <p style={{ 
          fontSize: 32, 
          color: '#64748b',
          fontFamily: theme.fonts.body,
          lineHeight: 1.6
        }}>
          This is a simple text scene with fade-in animation
        </p>
      </div>
      
      <Subtitle text="Welcome to our presentation" startFrame={0} durationInFrames={120} />
    </AbsoluteFill>
  );
}
```

---

### 模板 4：D3 自定义可视化

```tsx
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import * as d3 from 'd3';

export default function Scene4() {
  const frame = useCurrentFrame();
  
  // D3 力导向布局（useMemo 避免重复计算）
  const graph = useMemo(() => {
    const nodes = [
      { id: 'A', value: 10 },
      { id: 'B', value: 20 },
      { id: 'C', value: 15 }
    ];
    const links = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' }
    ];
    
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(960, 540))
      .stop();
    
    // 运行 300 次迭代
    for (let i = 0; i < 300; i++) simulation.tick();
    
    return { nodes, links };
  }, []);
  
  // 淡入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ background: '#0a0a0a' }}>
      <svg width={1920} height={1080}>
        {/* 连线 */}
        {graph.links.map((link: any, i) => (
          <line
            key={i}
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            stroke="rgba(0,200,150,0.3)"
            strokeWidth={2}
            opacity={opacity}
          />
        ))}
        
        {/* 节点 */}
        {graph.nodes.map((node: any) => (
          <g key={node.id} opacity={opacity}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.value * 2}
              fill="#00C896"
              stroke="white"
              strokeWidth={2}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill="white"
              fontSize={16}
            >
              {node.id}
            </text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
}
```

---

## 🎯 代码生成规范

### 1. 文件结构
```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene {scene_number}: {visual_concept}
 * Duration: {duration}s
 */
export default function Scene{scene_number}() {
  const frame = useCurrentFrame();
  const theme = useTheme();
  
  // 动画逻辑
  
  return (
    <AbsoluteFill style={{ background: '...' }}>
      {/* 场景内容 */}
      
      {/* 字幕 */}
      <Subtitle text="..." startFrame={0} durationInFrames={...} />
    </AbsoluteFill>
  );
}
```

### 2. 动画规范
- 使用 `useCurrentFrame()` 获取当前帧
- 使用 `interpolate()` 创建数值动画
- 使用 `spring()` 创建物理动画（弹簧效果）
- **关键**：`interpolate(..., { easing })` 的 `easing` **必须是函数** `((t: number) => number)`，输入/输出都在 `0..1` 范围

  - ✅ 正确：`easing: Easing.out(Easing.cubic)`（先 `import { Easing } from "remotion"`）
  - ❌ 错误：`easing: spring(...)`（`spring()` 返回的是数值，不是函数，会直接报 `easing is not a function`）
  - ❌ 错误：`easing: Easing.out(Easing.expo)`（`Easing.expo` **不存在**，会导致 `easing is not a function`；正确写法是 `Easing.exp`）

- **Remotion `Easing` 只能使用真实存在的成员**：不要“猜名字”。如果你不确定，宁可不写 `easing`（默认线性）或用 `Easing.linear`。
  - ✅ 推荐常用：
    - `Easing.out(Easing.cubic)`
    - `Easing.out(Easing.quad)`
    - `Easing.out(Easing.exp)`  // 注意是 `exp` 不是 `expo`
    - `Easing.inOut(Easing.cubic)`
    - `Easing.bezier(0.2, 0.9, 0.2, 1)`（需要自定义曲线时）

- 想要“弹簧 + 位移”的正确范式（**永远不要把 `spring()` 放进 `easing`**）：
  - `const p = spring({ fps, frame: frame - delay, config: { damping: 12 } }); // p ∈ [0,1]`
  - `const y = interpolate(p, [0, 1], [50, 0]);`

- 用 `useMemo` 缓存复杂计算（如 D3 布局/粒子初始状态）

#### ✅ TypeScript 严格模式（生成代码必须能过 `strict`）
> 本项目开启了 TypeScript `strict`，并且 scenes 代码经常会被本地/CI 的校验脚本扫描。

- **不要写隐式 `any`**：所有函数参数、局部组件 props 都要有类型。
  - ✅ 推荐：先定义 `type`/`interface`，再写组件：
    - `type WeightProps = { color: string; label: string; position: [number, number, number]; scale?: number };`
    - `const Weight: React.FC<WeightProps> = ({ color, label, position, scale = 1 }) => { ... }`
- **不要引入未使用的变量/导入**：只 `import` 实际使用到的符号；不要为了“看起来完整”随手 import。
- **不要为 JSX 额外 `import React from "react"`**：本项目 `jsx` 是 `react-jsx`，普通 JSX 不需要 React 默认导入。

#### ✅ 主题字体 API（不要瞎猜字段名）
- `theme.fonts` 只有 3 个字段：
  - `theme.fonts.heading`
  - `theme.fonts.body`
  - `theme.fonts.mono`
- ❌ 不要使用 `theme.fonts.data` / `theme.fonts.code` 这类“猜测字段”。

#### ✅ Recharts formatter 类型兼容（避免 TS2322）
- 当你写 `formatter`（比如 `LabelList`）时，参数类型往往是 `unknown | string | number | ...`。
- ✅ 正确做法：用 `unknown` + `typeof` 守卫：
  - `const fmt = (v: unknown) => (typeof v === "number" ? `${v.toFixed(1)}%` : String(v ?? ""));`

#### ✅ 图标/组件导入（避免 “Element type is invalid: got undefined”）
这是生成场景最常见的运行时报错之一：**导入了不存在的命名导出**（例如图标名、组件名“猜错”），编译可能不报错，但运行时 JSX 渲染会得到 `undefined`。

- ❌ 禁止：从第三方库“猜”一个导出名再用 JSX 渲染：
  - `import { PlaneDeparture } from "lucide-react";`（很容易不存在）
- ✅ 推荐：
  - **优先不用图标**，用简单形状（`div`/SVG/`@remotion/shapes`）表达即可。
  - 如果一定要用图标：只用模板里明确列出的常用 icon 名称（不要发明新名字）；拿不准就不要用。

#### ✅ Three.js / Drei 文本（避免运行时字体加载问题）
- Drei 的 `<Text>` 组件的 `font` **期望的是字体文件 URL/路径**（例如 `.woff/.ttf`），不是 CSS 的 `font-family` 字符串。
  - ❌ 错误：`<Text font={theme.fonts.heading} />`
  - ✅ 做法：
    - **优先**把文本放到 2D UI 层（普通 `<div>` + `fontFamily: theme.fonts.heading`）
    - 或者 **省略** `font` 属性，让 Drei 用默认字体



### 3. 布局方式
```tsx
// Flexbox（推荐）
<AbsoluteFill style={{ 
  display: 'flex', 
  flexDirection: 'column',
  padding: 60,
  gap: 40
}}>
  <div style={{ flex: 1 }}>上半部分</div>
  <div style={{ flex: 1 }}>下半部分</div>
</AbsoluteFill>

// Grid
<AbsoluteFill style={{ 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr',
  gap: 40,
  padding: 60
}}>
  <div>左侧</div>
  <div>右侧</div>
</AbsoluteFill>

// 绝对定位
<AbsoluteFill>
  <div style={{ position: 'absolute', top: 60, left: 60 }}>标题</div>
  <div style={{ position: 'absolute', bottom: 60, right: 60 }}>内容</div>
</AbsoluteFill>
```

### 4. 字幕处理
```tsx
// 单个字幕（本场景相对帧）
<Subtitle text="字幕文字" startFrame={0} durationInFrames={150} />

// 多个字幕（输入通常是全片绝对秒 → 需要换算为本场景相对帧）
const sceneStartSeconds = Math.min(
  ...(scene.timeline_events?.map((t) => t.start_time_seconds) ?? [0]),
  ...(scene.subtitles?.map((s) => s.start_time_seconds) ?? [0])
);

let lastEnd = -1;
{scene.subtitles.map((s, i) => {
  const start = Math.max(0, Math.round((s.start_time_seconds - sceneStartSeconds) * fps));
  const dur = Math.max(1, Math.round((s.end_time_seconds - s.start_time_seconds) * fps));
  const safeStart = Math.max(start, lastEnd + 1);
  lastEnd = safeStart + dur - 1;

  return (
    <Subtitle
      key={s.id ?? i}
      text={s.text}
      startFrame={safeStart}
      durationInFrames={dur}
    />
  );
})}

// 注意：不要再用 <Sequence> 包 Subtitle 做双重时间控制（会错位/重叠）。
```



---

## ✅ 检查清单

生成代码前必须确认：

1. ✅ 只生成 `video.scenes[scene_index]` 这一幕（单文件）
2. ✅ 使用 `AbsoluteFill` 作为根容器
3. ✅ 设置合适的背景色（避免纯黑 #000）
4. ✅ 所有动画用 `useCurrentFrame()` 驱动
5. ✅ `interpolate(..., { easing })` 的 `easing` 必须是函数；需要弹簧请用 `spring()` 先算进度再 `interpolate(progress, ...)`
   - ✅ `Easing.exp` 才是正确成员（不要写 `Easing.expo`）
6. ✅ 只导入 `Subtitle`/`SafeArea`，不导入其他自定义组件


7. ✅ 使用模板已内置第三方库（Recharts, D3, Three.js 等），禁止输出安装命令
8. ✅ 用 `useMemo` 缓存复杂计算
9. ✅ 字幕把 `start_time_seconds/end_time_seconds` 从全片绝对秒换算为本场景相对帧
10. ✅ 主内容为字幕预留底部空间（例如 `SafeArea paddingBottom={160}`），避免遮挡


---

## ❌ 禁止事项

1. ❌ 不要导入 `src/components` 下的自定义组件（只允许 `Subtitle` / `SafeArea`）
2. ❌ 不要使用 `Math.random()`（用 `random()` from remotion；3D/粒子初始化也一样）
3. ❌ 不要写 `interpolate(..., { easing: spring(...) })`（`easing` 必须是函数）
4. ❌ 不要使用 `Easing.expo`（Remotion 里是 `Easing.exp`；写错会报 `easing is not a function`）
5. ❌ 不要使用 `setInterval`/`setTimeout`（用帧驱动）

6. ❌ 不要使用 CSS Modules 或外部 CSS 文件
7. ❌ 不要使用纯黑色背景（除非明确需求）


---

## 📚 常用库参考（模板已内置 & 可直接调用）

> **严禁**在输出的 `scene_*.tsx` 里出现任何安装命令：`npm install` / `pnpm add` / `yarn add` / `npx`。
> 生成的代码只能 `import` 本模板项目已内置的依赖（以模板 `package.json` 为准）。

### 官方文档
- [Remotion 文档](https://www.remotion.dev/docs)
- [Remotion 第三方集成](https://www.remotion.dev/docs/third-party)


### Remotion 官方扩展（已安装，教学视频强相关）
- `@remotion/captions`: SRT/字幕轨处理（**用于生成字幕时间轴/样式**）
- `@remotion/preload`: 预加载图片/视频/音频（**避免首帧闪烁**）
- `@remotion/fonts`: 自定义字体加载（可选）
- `@remotion/player`: 网页端播放器（**不要在 scene 里用**，用于外部预览）
- `@remotion/webcodecs`: WebCodecs 加速能力（渲染/编解码相关，通常无需在 scene 中直接调用）


### 数据可视化
- [Recharts 文档](https://recharts.org) - 简单易用的 React 图表
- [D3.js 文档](https://d3js.org) - 强大的数据可视化
- [@visx/visx 文档](https://airbnb.io/visx) - Airbnb 可视化库

### 3D 与动画
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [@react-three/drei](https://drei.pmnd.rs) - Three.js 工具集
- [Framer Motion](https://www.framer.com/motion) - 流畅动画
- [React Spring](https://react-spring.io) - 物理动画
- [GSAP](https://greensock.com/gsap) - 专业动画库

### 模板项目已内置第三方库清单（Dify 可用）

#### Remotion 官方扩展（已内置）
- `@remotion/captions`：字幕轨/字幕样式生成
- `@remotion/preload`：图片/视频预加载（避免首帧闪烁）
- `@remotion/fonts`：字体加载（如需自定义字体，优先走模板内的稳定方案；不要在 scene 里直接 import `@remotion/google-fonts/*`）
- `@remotion/transitions`、`@remotion/motion-blur`：转场/运动模糊
- `@remotion/shapes`、`@remotion/paths`、`@remotion/noise`：形状/路径动画/噪声背景
- `@remotion/gif`：GIF 渲染
- `@remotion/layout-utils`：文本测量与排版（`fitText`/`measureText`）
- `@remotion/skia`：高性能 2D 绘制
- `@remotion/three`：Three.js 与 Remotion 的集成

#### 数据可视化（已内置）
- `recharts`
- `d3`、`d3-cloud`、`d3-sankey`
- `@nivo/bar`、`@nivo/line`、`@nivo/heatmap`
- `@visx/*`：通过 `@visx/visx` 预置（推荐按子包引入：`@visx/shape`、`@visx/scale` 等）
- `chart.js` + `react-chartjs-2`：Chart.js 图表（需要先 `ChartJS.register(...)`）
- `vis-network`：关系网络图/拓扑图

#### 2D/白板绘制（已内置）
- `react-konva`

#### 动画库（已内置）
- `framer-motion`
- `react-spring`
- `gsap`
- `animejs`

#### 3D（已内置）
- `three`、`@react-three/fiber`、`@react-three/drei`
- `@react-three/cannon` + `cannon-es`

#### 文本/代码演示（已内置）
- `typed.js`
- `prismjs`（不要在 scene 里 `import` 外部 CSS）

> 如果视觉概念需要未内置库：**不要**在 scene 代码里写安装命令；请用上面这些库组合替代实现。


---

## 🎯 教学视频最佳实践

### 常见场景推荐库

| 场景类型 | 推荐库 | 使用场景 |
|---------|-------|---------|
| **数据趋势** | Recharts + D3 | 折线图、柱状图、饼图 |
| **流程图** | react-konva + @remotion/shapes | 流程图、思维导图 |
| **代码演示** | Prism.js + Typed.js | 代码高亮 + 打字效果 |
| **公式推导** | @remotion/paths | 绘制箭头、标注 |
| **3D 模型** | Three.js + @react-three/drei | 几何体、物理模拟 |
| **图表动画** | Recharts + interpolate | 数据增长动画 |
| **文字说明** | Framer Motion + Lucide | 标题动画 + 图标 |
| **背景特效** | @remotion/noise + GSAP | 粒子、渐变 |

---

**记住：直接编写标准 React 代码，完全自由！**
