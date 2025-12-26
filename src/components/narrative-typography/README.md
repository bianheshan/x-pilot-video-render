# Narrative Typography Components

高质量的叙事排版组件库，专为教育类视频设计，提供 15 个精美的动画组件。

## 📦 组件分类

### 🎬 标题组件 (Titles)

#### 1. TitleCinematicIntro - 电影级开场
极具冲击力的大标题，带光扫、模糊和 3D 挤压效果。

```tsx
import { TitleCinematicIntro } from "@/components/narrative-typography";

<TitleCinematicIntro
  text="WELCOME"
  subtitle="To the Future"
  color="#ffffff"
  glowColor="#00d4ff"
/>
```

**特性**：
- 弹性进入动画
- 光扫效果
- 动态模糊
- 3D 文字阴影

---

#### 2. TitleKineticGlitch - 故障风标题
赛博朋克风格，文字随机错位、变色，表达科技或警告。

```tsx
import { TitleKineticGlitch } from "@/components/narrative-typography";

<TitleKineticGlitch
  text="SYSTEM ERROR"
  intensity={1}
  colors={["#ff0080", "#00ffff", "#ffff00"]}
/>
```

**特性**：
- RGB 分离效果
- 随机故障触发
- 扫描线动画
- 像素块装饰

---

#### 3. TitleLiquidFill - 液体填充字
文字内部像水杯一样被彩色液体注满。

```tsx
import { TitleLiquidFill } from "@/components/narrative-typography";

<TitleLiquidFill
  text="FLOW"
  liquidColor="#00d4ff"
  backgroundColor="#0a0a0a"
  waveSpeed={1}
/>
```

**特性**：
- 液体填充动画
- 多层波浪效果
- 气泡动画
- 实时百分比显示

---

#### 4. TitleHandwritten - 手写笔迹
模拟真实笔迹书写过程，适合教育和故事讲述。

```tsx
import { TitleHandwritten } from "@/components/narrative-typography";

<TitleHandwritten
  text="Learn & Grow"
  color="#2c3e50"
  strokeWidth={4}
  speed={1}
/>
```

**特性**：
- SVG 笔画动画
- 墨水扩散效果
- 笔尖跟随
- 纸张纹理背景

---

#### 5. Title3DFloating - 3D 悬浮字
具有厚度和真实阴影的立体文字，随时间缓慢旋转。

```tsx
import { Title3DFloating } from "@/components/narrative-typography";

<Title3DFloating
  text="FUTURE"
  color="#ffffff"
  depth={30}
  rotationSpeed={1}
/>
```

**特性**：
- 真实 3D 深度
- 自动旋转
- 浮动动画
- 地面阴影

---

### 🎴 卡片组件 (Cards)

#### 6. CardGlassmorphism - 毛玻璃卡片
高级模糊背景，边缘高光，极简现代风格。

```tsx
import { CardGlassmorphism } from "@/components/narrative-typography";

<CardGlassmorphism
  title="Innovation"
  content="The future is now"
  icon="✨"
  accentColor="#00d4ff"
/>
```

**特性**：
- backdrop-filter 模糊
- 动态光效
- 浮动粒子
- 边缘光晕

---

#### 7. CardHolographic - 全息投影卡
带有彩虹光泽和扫描线效果的未来感卡片。

```tsx
import { CardHolographic } from "@/components/narrative-typography";

<CardHolographic
  title="Hologram"
  content="Future technology"
  subtitle="SYSTEM ACTIVE"
/>
```

**特性**：
- 彩虹光泽动画
- 扫描线效果
- 数据流动画
- 全息粒子

---

#### 8. CardNeumorphism - 新拟态卡片
凸起或凹陷的软浮雕效果，适合极简 UI 展示。

```tsx
import { CardNeumorphism } from "@/components/narrative-typography";

<CardNeumorphism
  title="Simplicity"
  content="Less is more"
  icon="💡"
  style="raised" // or "pressed"
/>
```

**特性**：
- 软阴影效果
- 凸起/凹陷样式
- 悬浮动画
- 极简设计

---

### 📋 列表组件 (Lists)

#### 9. ListStaggeredEntry - 弹性列表
列表项依次带弹性地滑入，拒绝僵硬。

```tsx
import { ListStaggeredEntry } from "@/components/narrative-typography";

<ListStaggeredEntry
  items={[
    "First point",
    "Second point",
    "Third point"
  ]}
  title="Key Points"
  accentColor="#00d4ff"
  staggerDelay={8}
/>
```

**特性**：
- 弹性进入动画
- 序号旋转效果
- 高亮扫光
- 进度指示器

---

#### 10. ListMindmapTree - 树状列表
列表项以树枝分叉形式展开，展示从属关系。

```tsx
import { ListMindmapTree } from "@/components/narrative-typography";

<ListMindmapTree
  rootNode={{
    id: "root",
    label: "Main Topic",
    children: [
      { id: "1", label: "Subtopic 1" },
      { id: "2", label: "Subtopic 2" }
    ]
  }}
  title="Mind Map"
  accentColor="#00d4ff"
/>
```

**特性**：
- 递归树结构
- 连接线生长动画
- 节点脉冲效果
- 装饰粒子

---

### 💬 引言组件 (Quotes)

#### 11. QuoteParallaxBg - 视差引言
背景图与文字层不同速移动，创造深邃感。

```tsx
import { QuoteParallaxBg } from "@/components/narrative-typography";

<QuoteParallaxBg
  quote="The only way to do great work is to love what you do."
  author="Steve Jobs"
  backgroundImage="/path/to/image.jpg"
  overlayColor="rgba(0, 0, 0, 0.6)"
/>
```

**特性**：
- 多层视差效果
- 背景模糊
- 装饰粒子
- 优雅排版

---

#### 12. QuoteTerminal - 代码注释风引言
像代码注释一样的绿色字体，适合技术引用。

```tsx
import { QuoteTerminal } from "@/components/narrative-typography";

<QuoteTerminal
  quote="Code is poetry"
  author="WordPress"
  language="javascript" // python, html, css
/>
```

**特性**：
- 打字机效果
- 终端窗口样式
- 扫描线动画
- 多语言支持

---

### 📊 统计数据组件 (Stats)

#### 13. StatRollingCounter - 数字滚动器
数字像老虎机一样快速滚动并停在最终值。

```tsx
import { StatRollingCounter } from "@/components/narrative-typography";

<StatRollingCounter
  targetValue={9999}
  label="Total Users"
  prefix=""
  suffix="+"
  duration={90}
  color="#00d4ff"
/>
```

**特性**：
- 老虎机滚动效果
- 每位独立动画
- 背景数字流
- 完成粒子爆发

---

#### 14. StatCircularProgress - 环形进度条
带有发光端点的动态圆环，展示百分比。

```tsx
import { StatCircularProgress } from "@/components/narrative-typography";

<StatCircularProgress
  percentage={85}
  label="Completion Rate"
  size={400}
  strokeWidth={30}
  color="#00d4ff"
  duration={90}
/>
```

**特性**：
- SVG 圆环动画
- 发光端点
- 旋转装饰环
- 中心数字显示

---

#### 15. StatLiquidBubble - 注水球
一个球体内水位上升，且水面有波浪起伏。

```tsx
import { StatLiquidBubble } from "@/components/narrative-typography";

<StatLiquidBubble
  percentage={75}
  label="Progress"
  size={400}
  liquidColor="#00d4ff"
  duration={120}
/>
```

**特性**：
- 液体填充动画
- 波浪起伏效果
- 气泡上升
- 球体高光

---

## 🎨 设计原则

1. **视觉冲击力**：每个组件都经过精心设计，确保在视频中具有强烈的视觉吸引力
2. **流畅动画**：使用 Remotion 的 spring 和 interpolate API，确保动画自然流畅
3. **高度可定制**：所有组件都提供丰富的 props，支持颜色、尺寸、速度等自定义
4. **性能优化**：使用 CSS 动画和 SVG，避免重度计算，确保渲染性能
5. **响应式设计**：组件自适应不同尺寸，适合 1080p 和 4K 视频

## 🚀 使用建议

### 场景搭配

- **开场**：TitleCinematicIntro + CardGlassmorphism
- **技术内容**：TitleKineticGlitch + QuoteTerminal + CardHolographic
- **教育讲解**：TitleHandwritten + ListStaggeredEntry
- **数据展示**：StatRollingCounter + StatCircularProgress + StatLiquidBubble
- **总结**：Title3DFloating + QuoteParallaxBg

### 性能优化

1. 避免在同一场景中使用过多复杂组件
2. 对于长视频，考虑分段渲染
3. 使用 `duration` prop 控制动画时长，避免过长的动画

### 颜色搭配

推荐的主题色：
- **科技蓝**：#00d4ff
- **赛博粉**：#ff0080
- **霓虹绿**：#00ff00
- **紫罗兰**：#764ba2
- **金色**：#ffd700

## 📝 示例场景

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import {
  TitleCinematicIntro,
  ListStaggeredEntry,
  StatRollingCounter,
} from "@/components/narrative-typography";

export const MyScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <TitleCinematicIntro
          text="WELCOME"
          subtitle="To Our Platform"
        />
      </Sequence>

      <Sequence from={90} durationInFrames={120}>
        <ListStaggeredEntry
          items={[
            "Feature 1: Fast Performance",
            "Feature 2: Easy to Use",
            "Feature 3: Highly Customizable",
          ]}
          title="Key Features"
        />
      </Sequence>

      <Sequence from={210} durationInFrames={90}>
        <StatRollingCounter
          targetValue={10000}
          label="Happy Users"
          suffix="+"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
```

## 🤝 贡献

欢迎提交 PR 添加更多组件或改进现有组件！

## 📄 许可

MIT License
