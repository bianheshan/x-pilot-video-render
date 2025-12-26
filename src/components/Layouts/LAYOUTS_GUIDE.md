# 布局系统使用指南

## 概述

本项目提供了一套完整的视频布局系统，充分利用 Remotion 的动画能力，支持多种复杂的布局模式和动画效果。

## 布局组件列表

### 1. 基础布局

#### FullScreen - 全屏布局
最简单的布局，内容占满整个画面。

```tsx
import { FullScreen } from "./components/Layouts";

<FullScreen
  backgroundColor="#000"
  backgroundImage="/path/to/image.jpg"
  overlay={true}
  overlayOpacity={0.5}
>
  <YourContent />
</FullScreen>
```

#### SplitScreen - 分屏布局
左右分屏展示内容。

```tsx
import { SplitScreen } from "./components/Layouts";

<SplitScreen
  left={<LeftContent />}
  right={<RightContent />}
  ratio={0.6}  // 左侧占 60%
  gap={20}
  backgroundColor="#000"
/>
```

#### PictureInPicture - 画中画布局
主内容 + 小窗口，适合讲解场景。

```tsx
import { PictureInPicture } from "./components/Layouts";

<PictureInPicture
  main={<MainContent />}
  pip={<SpeakerVideo />}
  position="bottom-right"
  pipSize={{ width: 320, height: 180 }}
  offset={{ x: 40, y: 40 }}
/>
```

---

### 2. 高级动画布局

#### AnimatedSplitScreen - 动画分屏布局
支持多种分屏动画效果的增强版分屏布局。

```tsx
import { AnimatedSplitScreen } from "./components/Layouts";

<AnimatedSplitScreen
  left={<LeftContent />}
  right={<RightContent />}
  direction="horizontal"  // 或 "vertical"
  ratio={0.5}
  animation="spring"  // slide | wipe | zoom | rotate | spring | none
  animationDuration={60}
  dividerColor="rgba(255,255,255,0.1)"
  dividerWidth={2}
/>
```

**动画类型说明：**
- `spring`: 弹簧动画，自然的物理效果
- `slide`: 滑动进入
- `wipe`: 擦除效果
- `zoom`: 缩放进入
- `rotate`: 旋转进入
- `none`: 无动画

#### GridLayout - 网格布局
支持多行多列、单元格跨行跨列、独立动画的网格系统。

```tsx
import { GridLayout, GridItem } from "./components/Layouts";

const items: GridItem[] = [
  {
    content: <Card1 />,
    span: { rows: 2, cols: 1 },  // 跨 2 行 1 列
    animation: "spring",
    delay: 0,
  },
  {
    content: <Card2 />,
    animation: "fade",
    delay: 10,
  },
  // ... 更多项目
];

<GridLayout
  items={items}
  columns={3}
  rows={2}
  gap={20}
  padding={40}
  staggerDelay={5}  // 交错延迟
  globalAnimation="spring"  // 全局默认动画
/>
```

#### LayeredLayout - 分层布局
支持多层内容叠加、视差效果、景深模糊。

```tsx
import { LayeredLayout, Layer } from "./components/Layouts";

const layers: Layer[] = [
  {
    content: <Background />,
    zIndex: 0,
    animation: "parallax",
    parallaxSpeed: 0.5,
    blur: 3,
    opacity: 0.8,
  },
  {
    content: <MiddleLayer />,
    zIndex: 1,
    position: { top: "20%", left: "10%" },
    size: { width: "80%", height: "60%" },
    animation: "spring",
    delay: 10,
  },
  {
    content: <ForegroundElement />,
    zIndex: 2,
    position: { bottom: 50, right: 50 },
    animation: "scale",
    delay: 20,
  },
];

<LayeredLayout
  layers={layers}
  backgroundColor="transparent"
  perspective={1000}
/>
```

**动画类型：**
- `parallax`: 视差滚动效果
- `spring`: 弹簧动画
- `fade`: 淡入
- `slide`: 滑动
- `scale`: 缩放
- `none`: 无动画

#### MasonryLayout - 瀑布流布局
不等高的多列布局，自动计算最优排列。

```tsx
import { MasonryLayout, MasonryItem } from "./components/Layouts";

const items: MasonryItem[] = [
  {
    content: <Card1 />,
    height: 200,
    animation: "spring",
  },
  {
    content: <Card2 />,
    height: 300,
    animation: "slide",
    delay: 5,
  },
  // ... 更多项目
];

<MasonryLayout
  items={items}
  columns={3}
  gap={20}
  padding={40}
  staggerDelay={3}
/>
```

#### CircularLayout - 环形布局
将内容排列成圆形，支持旋转、轨道动画。

```tsx
import { CircularLayout, CircularItem } from "./components/Layouts";

const items: CircularItem[] = [
  {
    content: <Icon1 />,
    size: 80,
    animation: "orbit",  // 轨道动画
    delay: 0,
  },
  {
    content: <Icon2 />,
    size: 80,
    animation: "spring",
    delay: 5,
  },
  // ... 更多项目
];

<CircularLayout
  items={items}
  radius={300}
  centerContent={<CenterLogo />}
  centerSize={150}
  startAngle={0}
  rotationSpeed={0.5}  // 整体旋转速度
  staggerDelay={5}
/>
```

**动画类型：**
- `orbit`: 从中心向外扩展到轨道
- `spring`: 弹簧动画
- `rotate`: 旋转进入
- `scale`: 缩放进入
- `fade`: 淡入
- `none`: 无动画

#### TimelineLayout - 时间轴布局
展示时间序列或流程步骤。

```tsx
import { TimelineLayout, TimelineItem } from "./components/Layouts";

const items: TimelineItem[] = [
  {
    content: <Step1 />,
    label: "第一步",
    timestamp: "2024-01",
    side: "left",
    icon: "🚀",
    delay: 0,
  },
  {
    content: <Step2 />,
    label: "第二步",
    timestamp: "2024-02",
    side: "right",
    icon: "⚡",
    delay: 10,
  },
  // ... 更多步骤
];

<TimelineLayout
  items={items}
  orientation="vertical"  // 或 "horizontal"
  lineColor="rgba(255,255,255,0.3)"
  lineWidth={3}
  dotSize={20}
  dotColor="#3b82f6"
  spacing={200}
  autoAlternate={true}  // 自动左右交替
  staggerDelay={10}
/>
```

---

## 使用场景建议

### 教育视频
- **概念讲解**: `FullScreen` + 背景图
- **对比分析**: `AnimatedSplitScreen` (wipe 动画)
- **步骤演示**: `TimelineLayout` (垂直方向)
- **知识点展示**: `GridLayout` (交错动画)

### 产品展示
- **产品特性**: `CircularLayout` (环绕中心产品)
- **功能模块**: `GridLayout` (网格排列)
- **发展历程**: `TimelineLayout` (水平方向)
- **多角度展示**: `LayeredLayout` (视差效果)

### 数据可视化
- **多维度对比**: `GridLayout`
- **层次关系**: `LayeredLayout`
- **流程图**: `TimelineLayout`
- **关系网络**: `CircularLayout`

### 技术演示
- **代码 + 效果**: `AnimatedSplitScreen`
- **讲解 + 演示**: `PictureInPicture`
- **多个示例**: `MasonryLayout`
- **架构图**: `LayeredLayout`

---

## 动画性能优化

### 1. 使用 Spring 动画
Remotion 的 `spring()` 函数提供了物理真实的动画效果：

```tsx
const progress = spring({
  frame: frame - startFrame,
  fps,
  config: {
    damping: 15,    // 阻尼：越大越快停止
    stiffness: 100, // 刚度：越大越快到达目标
    mass: 0.8,      // 质量：越大惯性越大
  },
});
```

### 2. 使用 Interpolate
精确控制动画的时间和曲线：

```tsx
const opacity = interpolate(
  frame,
  [0, 30],      // 输入范围：第 0-30 帧
  [0, 1],       // 输出范围：0-1
  {
    extrapolateRight: "clamp",  // 超出范围后保持最后值
  }
);
```

### 3. 交错动画
通过 `staggerDelay` 创建波浪式进入效果：

```tsx
const delay = index * staggerDelay;
const startFrame = delay;
```

### 4. 避免过度动画
- 不要在同一时间启动太多动画
- 使用 `delay` 参数控制动画时序
- 复杂场景考虑分阶段展示

---

## 组合使用示例

### 示例 1: 产品介绍视频

```tsx
import { Sequence } from "remotion";
import { FullScreen, AnimatedSplitScreen, GridLayout } from "./components/Layouts";

export const ProductIntro = () => {
  return (
    <>
      {/* 开场：全屏标题 */}
      <Sequence from={0} durationInFrames={90}>
        <FullScreen backgroundColor="#000">
          <ProductTitle />
        </FullScreen>
      </Sequence>

      {/* 特性展示：网格布局 */}
      <Sequence from={90} durationInFrames={120}>
        <GridLayout
          items={featureItems}
          columns={2}
          rows={2}
          globalAnimation="spring"
          staggerDelay={8}
        />
      </Sequence>

      {/* 对比演示：动画分屏 */}
      <Sequence from={210} durationInFrames={120}>
        <AnimatedSplitScreen
          left={<BeforeView />}
          right={<AfterView />}
          animation="wipe"
          animationDuration={60}
        />
      </Sequence>
    </>
  );
};
```

### 示例 2: 技术架构讲解

```tsx
import { LayeredLayout, CircularLayout, TimelineLayout } from "./components/Layouts";

export const ArchitectureExplain = () => {
  return (
    <>
      {/* 架构层次：分层布局 */}
      <Sequence from={0} durationInFrames={150}>
        <LayeredLayout
          layers={architectureLayers}
          perspective={1200}
        />
      </Sequence>

      {/* 服务关系：环形布局 */}
      <Sequence from={150} durationInFrames={120}>
        <CircularLayout
          items={serviceItems}
          centerContent={<CoreService />}
          radius={280}
          rotationSpeed={0.3}
        />
      </Sequence>

      {/* 部署流程：时间轴 */}
      <Sequence from={270} durationInFrames={150}>
        <TimelineLayout
          items={deploymentSteps}
          orientation="horizontal"
          autoAlternate={false}
        />
      </Sequence>
    </>
  );
};
```

---

## 自定义扩展

所有布局组件都支持通过 props 自定义样式和行为。如需更复杂的效果，可以：

1. **组合多个布局**: 使用 `Sequence` 组合不同布局
2. **嵌套使用**: 在布局内部使用其他布局
3. **自定义动画**: 修改 `getItemAnimation` 函数
4. **添加过渡**: 使用 `@remotion/transitions` 包

---

## 最佳实践

1. **选择合适的布局**: 根据内容类型和展示需求选择
2. **控制动画时长**: 一般 30-60 帧为宜
3. **使用交错动画**: 让内容逐个出现，更有层次感
4. **保持一致性**: 同一视频中使用相似的动画风格
5. **测试性能**: 复杂布局可能影响渲染速度
6. **响应式设计**: 考虑不同分辨率下的显示效果

---

## 技术细节

### Remotion 核心 API

- `useCurrentFrame()`: 获取当前帧数
- `useVideoConfig()`: 获取视频配置（fps、宽高等）
- `interpolate()`: 插值函数，映射数值范围
- `spring()`: 弹簧动画函数
- `AbsoluteFill`: 绝对定位填充容器
- `Sequence`: 时间序列组件

### 性能考虑

- 使用 `useMemo` 缓存复杂计算
- 避免在动画中进行大量 DOM 操作
- 合理使用 `extrapolateRight: "clamp"` 避免不必要的计算
- 复杂场景考虑使用 `Sequence` 分段渲染

---

## 故障排除

### 动画不流畅
- 检查是否有大量同时运行的动画
- 减少 `staggerDelay` 值
- 使用更简单的动画类型

### 布局错位
- 检查容器尺寸设置
- 确认 `padding` 和 `gap` 值合理
- 使用浏览器开发工具检查元素位置

### 内容被裁剪
- 检查 `overflow` 设置
- 调整容器尺寸
- 使用 `AbsoluteFill` 确保填充整个画面

---

## 更新日志

### v2.0.0 (2024-12)
- ✨ 新增 6 个高级布局组件
- 🎨 完整的动画系统支持
- 📚 详细的使用文档
- 🔧 TypeScript 类型支持

---

## 贡献

欢迎提交 Issue 和 Pull Request 来改进布局系统！
