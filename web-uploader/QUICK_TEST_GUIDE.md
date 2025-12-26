# 快速测试工作流指南

## 📋 概述

Web Uploader 现在支持**快速测试工作流**，让你可以在一个界面中完成：上传场景代码 → 验证代码 → 启动项目 → 查看效果的完整流程。

## 🎯 功能特性

### 1. **代码验证** 🔍
- 自动检查 React 导入
- 验证 Remotion 组件导入
- 检查默认导出
- 检查组件定义和返回语句
- 实时显示错误和警告

### 2. **场景上传** 📤
- 快速上传场景代码到项目
- 自动更新 manifest.json
- 支持自定义主题和持续时间

### 3. **预览启动** 🚀
- 一键启动 Remotion Studio
- 自动检测预览服务器状态
- 提供预览链接快速访问

### 4. **一键测试** ⚡
- 自动执行完整工作流
- 步骤可视化进度显示
- 智能错误处理和提示

## 🚀 使用方法

### 启动服务器

```bash
cd web-uploader
./start.sh  # macOS/Linux
# 或
start.bat   # Windows
```

访问：http://localhost:8000

### 工作流步骤

#### 方式一：一键测试（推荐）⚡

1. 点击 **🧪 快速测试** 标签页
2. 填写场景信息：
   - 场景 ID（如：`scene-test`）
   - 场景名称（如：`测试场景`）
   - 持续帧数（如：`90`）
   - 场景代码（React + Remotion 组件）
3. 点击 **⚡ 一键测试** 按钮
4. 等待自动完成三个步骤：
   - ✅ 验证代码
   - ✅ 上传场景
   - ✅ 启动预览
5. 点击 **打开预览** 查看效果

#### 方式二：分步执行

1. **验证代码**：点击 **🔍 验证代码** 按钮
   - 查看验证结果
   - 修复错误和警告

2. **上传场景**：点击 **📤 上传场景** 按钮
   - 场景代码保存到项目
   - 更新 manifest.json

3. **启动预览**：点击 **🚀 启动预览** 按钮
   - 启动 Remotion Studio
   - 等待 5 秒后自动打开

4. **查看效果**：点击 **打开预览 →** 按钮
   - 在新标签页打开预览
   - 查看场景渲染效果

## 📝 示例代码

点击 **📝 加载示例** 按钮，自动填充以下示例代码：

```tsx
import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard } from "../components";

export default function SceneTest() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard 
        title="快速测试" 
        subtitle="验证场景代码是否正常工作" 
      />
    </AbsoluteFill>
  );
}
```

## 🎨 界面说明

### 工作流状态指示器

```
┌─────────────┬─────────────┬─────────────┐
│ 🔍 验证代码  │ 📤 上传场景  │ 🚀 启动预览  │
│   待验证    │   待上传    │   待启动    │
└─────────────┴─────────────┴─────────────┘
```

- **灰色边框**：待执行
- **绿色边框**：已完成
- **动画效果**：执行中

### 验证结果显示

- ❌ **错误**：红色背景，必须修复
- ⚠️ **警告**：黄色背景，建议修复
- ✅ **成功**：绿色提示

### 预览链接

```
🎬 预览地址
http://localhost:3000
[打开预览 →]
```

## 🔧 API 端点

### 验证代码
```http
POST /test/validate
Content-Type: application/json

{
  "code_content": "import React from 'react'..."
}
```

### 检查预览状态
```http
GET /test/preview-status
```

### 启动预览
```http
POST /test/start-preview
```

### 完整工作流
```http
POST /test/workflow
Content-Type: application/json

{
  "scene_id": "scene-test",
  "scene_name": "测试场景",
  "duration": 90,
  "code_content": "...",
  "theme": "tech"
}
```

## 💡 使用技巧

### 1. 快速迭代开发
```
编写代码 → 一键测试 → 查看效果 → 修改代码 → 再次测试
```

### 2. 代码模板
使用示例代码作为模板，快速创建新场景：
- 保留导入语句
- 修改组件名称
- 调整内容和样式

### 3. 主题切换
在测试时尝试不同主题：
- `tech` - 科技蓝
- `cyberpunk` - 赛博朋克
- `elegant` - 优雅紫
- `nature` - 自然绿

### 4. 预览服务器管理
- 首次测试会自动启动预览服务器
- 后续测试会复用已启动的服务器
- 修改代码后，预览会自动热重载

## ⚠️ 注意事项

### 代码要求
- ✅ 必须导入 React
- ✅ 必须有默认导出
- ✅ 建议导入 Remotion 组件
- ✅ 组件必须返回 JSX

### 预览服务器
- 默认端口：3000
- 启动时间：约 5-10 秒
- 自动热重载：支持

### 常见问题

**Q: 预览服务器启动失败？**
A: 检查端口 3000 是否被占用，或手动运行 `npm run dev`

**Q: 代码验证通过但预览报错？**
A: 验证只检查基本语法，运行时错误需要在预览中查看

**Q: 如何停止预览服务器？**
A: 在终端中按 `Ctrl+C`，或关闭运行 `npm run dev` 的进程

## 🎯 最佳实践

### 1. 开发流程
```
1. 使用示例代码作为起点
2. 修改为你的场景内容
3. 点击"一键测试"
4. 在预览中查看效果
5. 根据效果调整代码
6. 重复步骤 3-5
```

### 2. 代码组织
```tsx
// 1. 导入依赖
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TitleCard, AnimatedText } from "../components";

// 2. 定义组件
export default function MyScene() {
  // 3. 使用 Remotion hooks
  const frame = useCurrentFrame();
  
  // 4. 返回 JSX
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* 你的内容 */}
    </AbsoluteFill>
  );
}
```

### 3. 性能优化
- 使用 `React.memo` 优化复杂组件
- 避免在渲染中进行重计算
- 使用 Remotion 的 `interpolate` 实现动画

## 📚 相关文档

- [Web Uploader 完整指南](./WEB_UPLOADER_GUIDE.md)
- [组件库文档](../AI_INTEGRATION_GUIDE.md)
- [Remotion 官方文档](https://www.remotion.dev/)

## 🎉 总结

快速测试工作流让场景开发变得更加高效：

- ⚡ **快速**：一键完成所有步骤
- 🔍 **可靠**：自动验证代码质量
- 👀 **直观**：实时查看渲染效果
- 🎨 **灵活**：支持多种主题和配置

开始使用快速测试工作流，让视频场景开发更加流畅！🚀
