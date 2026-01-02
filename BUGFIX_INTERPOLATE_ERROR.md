# 🐛 Bug 修复报告：interpolate 错误

## 📋 问题描述

**错误信息**：
```
Error: outputRange must contain only numbers
  at checkInfiniteRange (node_modules/remotion/dist/esm/index.mjs:4327)
  at interpolate (node_modules/remotion/dist/esm/index.mjs:4348)
  at StatCircularProgress (src/components/narrative-typography/StatCircularProgress.tsx:33)
```

**触发场景**：
- 运行 `src/scenes/scene_3.tsx` 时报错
- 组件：`StatCircularProgress`
- 位置：第165、177、189行

---

## 🔍 根本原因分析

### 问题定位流程

1. **检查错误堆栈**：
   - `interpolate` 函数在 `StatCircularProgress` 组件的第33行调用
   - `outputRange` 参数包含非数字值

2. **读取公共组件源码**（`src/components/narrative-typography/StatCircularProgress.tsx`）：
```tsx
// 第33行：进度动画
const currentProgress = interpolate(
  frame,
  [0, duration],        // ✅ inputRange - 正确
  [0, percentage],      // ❌ outputRange - percentage 是 undefined！
  { extrapolateRight: "clamp" }
);
```

3. **检查组件接口定义**（第5-12行）：
```typescript
export interface StatCircularProgressProps {
  percentage: number;  // ← 组件期望的是 percentage 属性
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  duration?: number;
}
```

4. **检查生成代码**（`src/scenes/scene_3.tsx`）：
```tsx
// 第165行 - ❌ 错误：传入了 value 而不是 percentage
<StatCircularProgress 
  label="Phloem"
  value={ringProgress}  // ← 错误的属性名！
  size={450} 
  color={phloemColor}
/>
```

### 问题链路

```
生成代码使用错误属性 value
         ↓
组件内部 percentage 参数为 undefined
         ↓
interpolate([0, duration], [0, undefined])
         ↓
outputRange 包含 undefined（非数字）
         ↓
❌ 报错：outputRange must contain only numbers
```

---

## 🎯 根本原因

**Prompt 问题**：`src/generator-scene-code.md` 中 `StatCircularProgress` 的示例代码使用了**错误的属性名** `value`，导致生成的代码全部使用错误属性。

| 位置 | 错误代码 | 正确代码 |
|------|---------|---------|
| 示例代码（第10930行） | `<StatCircularProgress value={75} />` | `<StatCircularProgress percentage={75} />` |
| 模板1（第10303行） | `value={99.9}` | `percentage={99.9}` |
| 模板2（第12469行） | `value={[数值]}` | `percentage={[数值]}` |
| 模板3（第12655行） | `value={99.9}` | `percentage={99.9}` |

---

## ✅ 解决方案

### 1. 修复 Prompt（`src/generator-scene-code.md`）

#### 修改点1：更新组件示例（第10928-10935行）

**修改前**：
```tsx
#### 14. StatCircularProgress - 环形进度
<StatCircularProgress 
  value={75}
  label="完成度"
  size={200}
/>
```

**修改后**：
```tsx
#### 14. StatCircularProgress - 环形进度
<StatCircularProgress 
  percentage={75}  // ⚠️ 注意：必须使用 percentage 属性，不是 value！
  label="完成度"
  size={200}
/>

**接口定义**：
interface StatCircularProgressProps {
  percentage: number;  // 0-100 的百分比（必填）
  label: string;       // 底部标签（必填）
  size?: number;       // 圆环尺寸，默认400
  strokeWidth?: number;// 圆环宽度，默认30
  color?: string;      // 进度颜色，默认主题色
  duration?: number;   // 动画时长（帧），默认90
}

**❌ 常见错误**：
// ❌ 错误：使用 value 属性会导致 interpolate 错误
<StatCircularProgress value={75} label="错误示例" />

// ✅ 正确：必须使用 percentage 属性
<StatCircularProgress percentage={75} label="正确示例" />
```

#### 修改点2：更新所有模板代码

将以下4处的 `value` 全部替换为 `percentage`：
- ✅ 第10303行：示例代码
- ✅ 第12469-12479行：模板2（3个实例）
- ✅ 第12655-12667行：模板3（3个实例）

### 2. 新增强制检查清单（第5-7行）

在 `## 🚨 代码生成前强制检查清单` 中新增：

**✅ 检查 5：组件属性名验证**

| 组件 | ❌ 错误属性 | ✅ 正确属性 | 后果 |
|------|-----------|-----------|------|
| `StatCircularProgress` | `value` | `percentage` | `interpolate` 报错 |
| `ListBulletPoints` | `list`, `data` | `items` | 无法渲染 |
| `ListTimeline` | `list`, `data` | `items` | 无法渲染 |
| `ChartBarRace` | `data`, `values` | `items` | 无法渲染 |
| `CodeBlock` | `content`, `text` | `code` | 无法显示代码 |

**快速记忆法**：
- 📊 **数值类组件** → `percentage`（StatCircularProgress）
- 📝 **列表类组件** → `items`（List*, Chart*）
- 💻 **代码组件** → `code`（CodeBlock）

---

## 📊 影响范围

### 已生成的错误代码

需要在 **Dify 平台重新生成** 以下场景：
- ✅ `src/scenes/scene_3.tsx`（3处错误，第165、177、189行）

### 潜在风险组件

未来可能出现相同问题的组件（建议排查 Prompt）：
1. ✅ `StatCircularProgress` - **已修复**
2. 🟡 `ListBulletPoints` - 建议检查是否使用了 `list`/`data`
3. 🟡 `ListTimeline` - 建议检查是否使用了 `list`/`data`
4. 🟡 `ChartBarRace` - 建议检查是否使用了 `data`/`values`
5. 🟡 `CodeBlock` - 建议检查是否使用了 `content`/`text`

---

## 🔄 修复后的正确用法

### 示例1：单个环形进度条

```tsx
<StatCircularProgress 
  percentage={85}      // ✅ 正确属性名
  label="完成率"
  size={400}
  strokeWidth={30}
  color="#00d4ff"
  duration={90}
/>
```

### 示例2：SplitScreen 中的三层环形图（scene_3.tsx 的修复版）

```tsx
<SplitScreen
  right={
    <div style={{ /* ... */ }}>
      {/* 外层 - Phloem */}
      <StatCircularProgress 
        percentage={ringProgress}  // ✅ 修复：value → percentage
        label="Phloem"
        size={450} 
        color={phloemColor}
        strokeWidth={25}
      />
      
      {/* 中层 - Cambium */}
      <StatCircularProgress 
        percentage={ringProgress}  // ✅ 修复：value → percentage
        label="Cambium"
        size={320} 
        color={cambiumColor}
        strokeWidth={25}
      />
      
      {/* 内层 - Xylem */}
      <StatCircularProgress 
        percentage={ringProgress}  // ✅ 修复：value → percentage
        label="Xylem"
        size={190} 
        color={xylemColor}
        strokeWidth={25}
      />
    </div>
  }
/>
```

---

## 🎓 经验总结

### 问题本质

这是一个**典型的 Prompt 错误导致的批量生成错误**：
- ❌ Prompt 中的示例代码使用了错误的属性名
- ❌ AI 学习了错误的示例，导致所有生成的代码都包含相同错误
- ✅ 修复 Prompt 后，未来生成的代码将自动正确

### 防范措施

1. **Prompt 编写规范**：
   - ✅ 示例代码必须与组件接口定义完全一致
   - ✅ 使用 TypeScript 接口定义明确标注必填属性
   - ✅ 提供 ❌ 错误示例和 ✅ 正确示例的对比

2. **检查清单机制**：
   - ✅ 在 Prompt 开头添加强制检查清单
   - ✅ 列出高风险组件和常见错误
   - ✅ 提供快速记忆法辅助判断

3. **测试驱动**：
   - ✅ 修改 Prompt 后，先用简单场景测试
   - ✅ 确认生成代码可运行后再批量生成
   - ✅ 建立 Prompt 的单元测试机制（如果可行）

---

## 📝 Todo

- [x] 修复 `generator-scene-code.md` 中的 4 处错误示例
- [x] 新增检查清单 5（组件属性名验证）
- [ ] **用户操作**：在 Dify 平台重新生成 `scene_3.tsx`
- [ ] **建议**：排查其他组件（List*, Chart*, CodeBlock）的属性名是否正确

---

## 🔗 相关文件

- 修改文件：`src/generator-scene-code.md`（4处修改 + 1处新增）
- 错误场景：`src/scenes/scene_3.tsx`（需重新生成）
- 组件源码：`src/components/narrative-typography/StatCircularProgress.tsx`（无需修改）

---

**修复时间**：2026-01-02  
**修复状态**：✅ Prompt 已修复，等待重新生成代码验证
