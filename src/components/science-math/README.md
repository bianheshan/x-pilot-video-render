# Science & Math 组件库

## 快速开始

### 安装依赖

所有必要的依赖已经安装：
```bash
npm install function-plot plotly.js three @react-three/fiber @react-three/drei matter-js gsap
npm install --save-dev @types/three @types/plotly.js
```

### 导入组件

```tsx
import {
  MathFunctionPlot,
  MathTrigonometry,
  MathProbabilityDist,
  PhysPendulumChaos,
  PhysWaveInterference,
} from "./components/science-math";
```

## 组件示例

### 1. 函数绘图仪

```tsx
import { Sequence } from "remotion";
import { MathFunctionPlot } from "./components/science-math";

export const FunctionDemo = () => {
  return (
    <Sequence from={0} durationInFrames={120}>
      <MathFunctionPlot
        expression="Math.sin(x) * Math.exp(-x/10)"
        functionName="y = sin(x)·e^(-x/10)"
        xRange={[-10, 10]}
        yRange={[-2, 2]}
        showGrid={true}
      />
    </Sequence>
  );
};
```

### 2. 带参数动画的函数

```tsx
<MathFunctionPlot
  expression="a * Math.sin(b * x)"
  functionName="y = a·sin(bx)"
  xRange={[-10, 10]}
  yRange={[-5, 5]}
  animatedParams={{
    a: { from: 1, to: 3 },  // 振幅从 1 变到 3
    b: { from: 1, to: 2 },  // 频率从 1 变到 2
  }}
/>
```

### 3. 三角函数单位圆

```tsx
<MathTrigonometry
  title="三角函数与单位圆"
  showCosine={true}
  rotationSpeed={1}
/>
```

### 4. 概率分布

```tsx
// 正态分布
<MathProbabilityDist
  type="normal"
  mean={0}
  stdDev={1}
  animateParams={true}
/>

// 均匀分布
<MathProbabilityDist
  type="uniform"
  mean={0}
  stdDev={2}
  animateParams={false}
/>
```

### 5. 混沌摆

```tsx
<PhysPendulumChaos
  title="双摆混沌系统"
  showTrail={true}
  gravity={9.8}
/>
```

### 6. 波的干涉

```tsx
// 双缝干涉
<PhysWaveInterference
  title="双缝干涉实验"
  sources={2}
  wavelength={40}
  amplitude={30}
/>

// 多波源干涉
<PhysWaveInterference
  title="多波源干涉"
  sources={4}
  wavelength={50}
  amplitude={25}
/>
```

## 完整场景示例

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import {
  MathFunctionPlot,
  MathTrigonometry,
  PhysWaveInterference,
} from "./components/science-math";

export const ScienceScene = () => {
  return (
    <AbsoluteFill>
      {/* 第一段：函数绘图 */}
      <Sequence from={0} durationInFrames={120}>
        <MathFunctionPlot
          expression="Math.sin(a * x)"
          functionName="y = sin(ax)"
          animatedParams={{
            a: { from: 0.5, to: 2 },
          }}
        />
      </Sequence>

      {/* 第二段：三角函数 */}
      <Sequence from={120} durationInFrames={120}>
        <MathTrigonometry
          showCosine={true}
          rotationSpeed={1}
        />
      </Sequence>

      {/* 第三段：波的干涉 */}
      <Sequence from={240} durationInFrames={120}>
        <PhysWaveInterference
          sources={2}
          wavelength={40}
          amplitude={30}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
```

## 组件特性

### 知识准确性 ✅
- 所有数学公式经过验证
- 物理原理严格遵循科学定律
- 数值计算精确可靠

### 视觉效果 ✨
- 60fps 流畅动画
- 清晰的坐标轴和标注
- 科学的颜色映射
- 实时参数反馈

### 教学价值 📚
- 完整的教学要点说明
- 直观的概念可视化
- 适合科普和教学视频

## 自定义主题

所有组件都支持主题系统：

```tsx
import { useTheme } from "../../contexts/ThemeContext";

// 组件会自动使用主题颜色
const theme = useTheme();
// theme.colors.primary
// theme.colors.background
// theme.fonts.body
```

## 性能提示

1. **Canvas 渲染**: 大部分组件使用 Canvas 进行高性能绘制
2. **采样密度**: 可以通过调整采样点数量来平衡质量和性能
3. **轨迹长度**: 对于轨迹类组件，可以限制轨迹点数量

## 常见问题

### Q: 如何修改函数表达式？
A: 使用标准的 JavaScript Math 对象，例如：
- `Math.sin(x)` - 正弦
- `Math.cos(x)` - 余弦
- `Math.exp(x)` - 指数
- `Math.pow(x, 2)` - 幂次
- `Math.sqrt(x)` - 平方根

### Q: 如何调整动画速度？
A: 修改 `durationInFrames` 参数，或者调整组件的 `rotationSpeed` 等参数。

### Q: 如何添加更多波源？
A: 在 `PhysWaveInterference` 组件中设置 `sources` 参数。

### Q: 组件支持哪些分布类型？
A: `MathProbabilityDist` 支持：
- `normal` - 正态分布
- `uniform` - 均匀分布
- `exponential` - 指数分布

## 扩展开发

### 创建新组件模板

```tsx
import React, { useRef, useEffect } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface MyComponentProps {
  title?: string;
  // 其他属性
}

/**
 * 组件描述
 * 
 * 详细说明
 * 
 * 教学要点：
 * - 要点1
 * - 要点2
 * 
 * 知识准确性：说明如何确保准确性
 */
export const MyComponent: React.FC<MyComponentProps> = ({
  title = "默认标题",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 绘制逻辑
  }, [frame, theme]);

  return (
    <div style={{ /* 样式 */ }}>
      <h2>{title}</h2>
      <canvas ref={canvasRef} width={1000} height={600} />
    </div>
  );
};
```

## 更多资源

- 📖 [完整文档](./SCIENCE_MATH_COMPONENTS.md)
- 🎓 [教学应用指南](./SCIENCE_MATH_COMPONENTS.md#教学应用场景)
- 🔬 [知识准确性说明](./SCIENCE_MATH_COMPONENTS.md#知识准确性保证)

---

**版本**: 1.0.0  
**最后更新**: 2025-12-08
