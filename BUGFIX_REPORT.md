# 🔴 问题诊断报告：截图显示的场景元素重叠问题

**更新时间**：2026-01-02

---

## 问题现象

截图显示多个场景的元素同时出现，严重混乱：
- **左上角**：绿色条纹背景
- **左下角**：机械臂（scene_2）+ "机械臂逆运动学" 文字  
- **中间**：绿色流程图
- **右上角**："Procedure Steps" 流程卡片（来自 scene_6 的 `LogicFlowPath`）

---

## 根本原因分析

### 🔴 问题 1：`LogicFlowPath` 是类全屏组件

**文件**：`src/components/business-logic/LogicFlowPath.tsx`（第 72-84 行）

**问题代码**：
```tsx
<div
  style={{
    width: "100%",            // ← 会占据父容器的全部宽度
    height: "100%",           // ← 会占据父容器的全部高度
    backgroundColor: theme.colors.background,  // ← 有背景色，会遮挡其他内容
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    opacity,
  }}
>
```

**影响**：该组件会占据父容器的 100% 宽高，当被放在 `SplitScreen` 中时，会扩展到整个屏幕。

---

### 🔴 问题 2：在 `SplitScreen` 的 `right` 属性中错误使用 `<AbsoluteFill>`

**文件**：`src/scenes/scene_6.tsx`（第 145-189 行）

**问题代码**：
```tsx
// 定义辅助组件时错误使用 <AbsoluteFill>
const StepsView = () => (
  <AbsoluteFill style={{ padding: 60, justifyContent: "center" }}>  // ← 错误！
    <div style={{ marginBottom: 40 }}>
      <TitleCard 
        title="Acromioplasty" 
        subtitle="Surgical Bone Smoothing" 
        animation="fade"
      />
    </div>
    
    <div style={{ transform: "scale(0.9)", transformOrigin: "top center" }}>
      <LogicFlowPath 
        title="Procedure Steps"
        subtitle="Removing the impingement source"
        steps={[...]}
        layout="timeline"
      />
    </div>
  </AbsoluteFill>
);

// 然后在 SplitScreen 中使用
<SplitScreen 
  left={<SimulationView />}
  right={<StepsView />}  // ← 会铺满全屏，遮挡左侧内容
/>
```

**影响**：`<AbsoluteFill>` 会让 `StepsView` 占据整个屏幕（`position: absolute; top: 0; left: 0; width: 100%; height: 100%`），而不是仅仅占据 `SplitScreen` 的右侧区域。

---

### 🔴 问题 3：Prompt 缺少关于 `<AbsoluteFill>` 使用的明确规则

**文件**：`src/generator-scene-code.md`

**缺失内容**：
- 没有明确说明 `<AbsoluteFill>` 只能用在场景的最外层
- 没有禁止在 `SplitScreen`/`GridLayout` 的属性中使用 `<AbsoluteFill>`
- 没有提供辅助函数组件的正确写法示例

---

## 解决方案

### ✅ 修复 1：移除 `LogicFlowPath` 的全屏样式

**文件**：`src/components/business-logic/LogicFlowPath.tsx`

**修改**（已完成）：
```tsx
// 修改前
<div
  style={{
    width: "100%",           // ← 删除
    height: "100%",          // ← 删除
    backgroundColor: theme.colors.background,  // ← 删除
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    opacity,
  }}
>

// 修改后
<div
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    opacity,
  }}
>
```

**效果**：组件不再强制占据父容器的全部空间，可以安全地放在 `SplitScreen` 中。

---

### ✅ 修复 2：更新 Prompt，增加 `<AbsoluteFill>` 使用规则

**文件**：`src/generator-scene-code.md`

**新增内容**（已完成）：

#### 1. 在错误示例中增加 `<AbsoluteFill>` 的误用案例

```tsx
// ❌ 错误示例 4：在 SplitScreen 的 left/right 中用 <AbsoluteFill>
<SplitScreen
  left={<MyComponent />}
  right={
    <AbsoluteFill>  // ← 错误！会铺满全屏，遮挡左侧
      <LogicFlowPath steps={[...]} />
    </AbsoluteFill>
  }
/>

// ❌ 错误示例 5：在 SplitScreen 的 left/right 中定义包含 AbsoluteFill 的组件
const StepsView = () => (
  <AbsoluteFill>  // ← 错误！
    <LogicFlowPath steps={[...]} />
  </AbsoluteFill>
);

<SplitScreen
  left={<VisualView />}
  right={<StepsView />}  // ← 会铺满全屏
/>
```

#### 2. 增加正确示例

```tsx
// ✅ 正确示例 3：在 SplitScreen 的 left/right 中用 <div> 包裹
<SplitScreen
  left={<VisualView />}
  right={
    <div style={{ padding: 60, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <LogicFlowPath 
        title="Procedure Steps"
        steps={[...]}
        layout="timeline"
      />
    </div>
  }
/>

// ✅ 正确示例 4：用普通函数组件，不用 AbsoluteFill
const StepsView = () => (
  <div style={{ padding: 60 }}>  // ← 用 <div>，不用 <AbsoluteFill>
    <LogicFlowPath steps={[...]} />
  </div>
);

<SplitScreen
  left={<VisualView />}
  right={<StepsView />}
/>
```

#### 3. 增加自查清单

新增问题 4 和 5：
- **在 `SplitScreen` 的 `left`/`right` 属性中，是否避免使用 `<AbsoluteFill>`？**
- **如果定义了辅助函数组件（如 `StepsView`），它是否用 `<div>` 而不是 `<AbsoluteFill>`？**

#### 4. 新增专门的 `<AbsoluteFill>` 使用规则章节

明确说明：
- **只能用在场景的最外层**（作为根容器）
- **只能用在独立的动画层**（如粒子效果、vignette）
- **绝对禁止在 `SplitScreen`/`GridLayout` 的属性中使用**

---

## 后续需要做的事

### 🎯 方案 1：在 Dify 平台测试（推荐）

1. 使用更新后的 Prompt（`generator-scene-code.md`）
2. 重新生成 scene_6.tsx
3. 检查生成的代码中：
   - `StepsView` 是否用 `<div>` 而不是 `<AbsoluteFill>`
   - `LogicFlowPath` 是否被正确嵌套在 `<div>` 中

### 🎯 方案 2：手动修复现有的 scene_6.tsx（临时方案）

如果 Dify 重新生成不方便，可以手动修改：

```tsx
// 修改 src/scenes/scene_6.tsx 第 145 行

// 修改前
const StepsView = () => (
  <AbsoluteFill style={{ padding: 60, justifyContent: "center" }}>
    ...
  </AbsoluteFill>
);

// 修改后
const StepsView = () => (
  <div style={{ 
    height: "100%", 
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "center",
    padding: 60 
  }}>
    ...
  </div>
);
```

---

## 潜在风险：其他组件也可能有类似问题

通过代码搜索发现，以下组件也有 `width: 100%, height: 100%, backgroundColor` 的模式：

| 组件名 | 是否有问题 | 建议处理 |
|--------|-----------|---------|
| `LogicFlowPath` | ✅ 已修复 | - |
| `LogicComparisonSlider` | ⚠️ 可能 | 在 visual 模式下有全屏样式 |
| `ChartBarRace` | ⚠️ 可能 | 需要检查 |
| `ChartSankeyFlow` | ⚠️ 可能 | 需要检查 |
| `LogicGanttTimeline` | ⚠️ 可能 | 需要检查 |
| 其他 16 个图表组件 | ⚠️ 可能 | 需要逐个检查 |

**建议**：
1. 先测试修复后的 `LogicFlowPath` 是否解决问题
2. 如果问题仍然存在，逐个检查其他组件
3. 建立统一的组件设计规范：**局部组件不应该强制占据 100% 宽高，也不应该有 backgroundColor**

---

## 问题类型总结

✅ **是 Prompt 问题**（`generator-scene-code.md`）
- 缺少 `<AbsoluteFill>` 使用规则
- 缺少辅助函数组件的正确写法示例

✅ **是基础公共组件问题**（`LogicFlowPath.tsx`）
- 组件设计不合理，强制占据 100% 宽高
- 有自己的背景色，会遮挡其他内容

❌ **不是生成的场景代码问题**（因为是 Prompt 指导不当）
- scene_6.tsx 使用 `<AbsoluteFill>` 是因为 Prompt 没有明确禁止
- 应该从源头（Prompt）解决问题

---

## 修改文件清单

| 文件 | 状态 | 说明 |
|------|------|------|
| `src/generator-scene-code.md` | ✅ 已修改 | 增加 `<AbsoluteFill>` 使用规则和错误示例 |
| `src/components/business-logic/LogicFlowPath.tsx` | ✅ 已修改 | 移除全屏样式（`width/height: 100%`, `backgroundColor`） |
| `src/scenes/scene_6.tsx` | ❌ 待修改 | 需要将 `StepsView` 中的 `<AbsoluteFill>` 改为 `<div>` |
| `BUGFIX_REPORT.md` | ✅ 已更新 | 详细记录问题分析和解决方案 |

---

## 验证方法

### 1. 检查代码

```bash
# 检查 scene_6.tsx 是否还有 AbsoluteFill 在 SplitScreen 中
grep -A 5 "const StepsView" src/scenes/scene_6.tsx
```

### 2. 重新渲染视频

```bash
# 重新生成视频预览
npm run preview
```

### 3. 检查效果

- 左侧的 `SimulationView` 应该单独显示（机械臂 + 地形图）
- 右侧的 `StepsView` 应该单独显示（标题 + LogicFlowPath）
- 不应该有元素重叠或混乱

---

## 学到的教训

1. **`<AbsoluteFill>` 不是万能容器**：它只适合用在场景的最外层，不适合用在局部布局中
2. **组件应该"无侵入性"**：局部组件不应该强制占据 100% 宽高，也不应该有自己的背景色
3. **Prompt 需要明确禁止错误用法**：不能只说"推荐"，还要明确说"禁止"
4. **提供正确的代码示例**：LLM 更容易从示例中学习，而不是从抽象的规则中理解

---

**下一步**：在 Dify 平台用新的 Prompt 重新生成 scene_6.tsx，验证问题是否解决。
