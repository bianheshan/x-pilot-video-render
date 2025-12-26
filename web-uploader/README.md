# 场景上传管理器 - Web 可视化界面

这是一个现代化的 Web 界面，用于可视化管理和上传视频场景代码，替代直接使用 `push_scene.py` 命令行脚本。

## ✨ 功能特性

- 🎨 **现代化 UI** - 基于 Vue 3 + TailwindCSS 的美观界面
- 📤 **单个上传** - 可视化表单上传单个场景
- 📦 **批量上传** - 支持 JSON 格式批量上传多个场景
- 🧪 **快速测试** - 上传 → 验证 → 预览的完整工作流（新功能！）
- 📋 **场景列表** - 查看所有已上传的场景
- 🗑️ **删除场景** - 一键删除不需要的场景
- 🎨 **主题切换** - 支持 6 种视频主题切换
- ⚙️ **配置预览** - 查看和编辑 manifest.json
- 📝 **示例加载** - 一键加载示例代码

## 🚀 快速开始

### 方法 1: 使用启动脚本（推荐）

#### macOS / Linux

```bash
cd web-uploader
chmod +x start.sh
./start.sh
```

#### Windows

```bash
cd web-uploader
start.bat
```

### 方法 2: 手动启动

1. **安装依赖**

```bash
cd web-uploader
pip install -r requirements.txt
```

2. **启动服务器**

```bash
python server.py
```

3. **打开浏览器**

在浏览器中打开 `index.html` 文件，或者访问 http://localhost:8000

## 📖 使用指南

### 1. 上传单个场景

1. 点击 **"📤 上传场景"** 标签
2. 填写表单：
   - **场景 ID** (必填): 如 `scene-1`
   - **场景名称** (必填): 如 `DNA 介绍`
   - **持续帧数** (必填): 如 `90` (3秒)
   - **文件名** (可选): 如 `Scene1.tsx`
   - **主题** (可选): 选择视频主题
   - **场景代码** (必填): 粘贴 React 组件代码
3. 点击 **"🚀 上传场景"** 按钮
4. 等待上传成功提示

**提示**: 点击 **"📝 加载示例"** 可以快速填充示例数据

### 2. 批量上传场景

1. 点击 **"📦 批量上传"** 标签
2. 在文本框中输入 JSON 数组格式的场景数据：

```json
[
  {
    "id": "scene-1",
    "name": "标题介绍",
    "duration": 90,
    "content": "import React from \"react\";\n..."
  },
  {
    "id": "scene-2",
    "name": "内容讲解",
    "duration": 150,
    "content": "import React from \"react\";\n..."
  }
]
```

3. 点击 **"🚀 批量上传"** 按钮
4. 查看上传结果统计

**提示**: 点击 **"📝 加载示例"** 可以查看批量上传的 JSON 格式

### 3. 查看场景列表

1. 点击 **"📋 场景列表"** 标签
2. 查看所有已上传的场景
3. 每个场景显示：
   - 场景名称和 ID
   - 文件名
   - 持续时间（帧数和秒数）
   - 是否有自定义属性
4. 点击 **"🗑️ 删除"** 按钮可以删除场景

### 4. 管理配置

1. 点击 **"⚙️ 配置"** 标签
2. 查看视频配置信息：
   - 分辨率 (1920×1080)
   - 帧率 (30 fps)
   - 当前主题
   - 版本号
3. 切换主题：
   - 科技蓝 (tech)
   - 赛博朋克 (cyberpunk)
   - 优雅紫 (elegant)
   - 自然绿 (nature)
   - 温暖橙 (warm)
   - 极简黑白 (minimal)
4. 查看完整的 `manifest.json` 内容

## 🎯 场景代码示例

### 基础场景

```tsx
import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard } from "../components";

export default function Scene1() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard title="DNA 双链结构" subtitle="生命的蓝图" />
    </AbsoluteFill>
  );
}
```

### 使用组件库

```tsx
import React from "react";
import { AbsoluteFill } from "remotion";
import { ListStaggeredEntry } from "../components/narrative-typography";
import { MathFunctionPlot } from "../components/science-math";

export default function Scene2() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a", padding: 40 }}>
      <ListStaggeredEntry 
        items={[
          "腺嘌呤 (A)",
          "胸腺嘧啶 (T)",
          "鸟嘌呤 (G)",
          "胞嘧啶 (C)"
        ]} 
      />
    </AbsoluteFill>
  );
}
```

## 🔌 API 接口

Web 界面通过以下 API 与后端通信：

### GET /health
健康检查

### GET /scenes
获取所有场景列表

**响应示例:**
```json
{
  "success": true,
  "scenes": [...],
  "manifest": {...}
}
```

### POST /push
推送单个场景

**请求体:**
```json
{
  "scene_id": "scene-1",
  "scene_name": "DNA 介绍",
  "duration": 90,
  "code_content": "import React...",
  "filename": "Scene1.tsx",  // 可选
  "theme": "tech"  // 可选
}
```

### POST /push-batch
批量推送场景

**请求体:**
```json
{
  "scenes": [
    {
      "id": "scene-1",
      "name": "标题",
      "duration": 90,
      "content": "..."
    }
  ]
}
```

### DELETE /delete/:id
删除场景

### POST /set-theme
设置主题

**请求体:**
```json
{
  "theme": "tech"
}
```

### GET /get-theme
获取当前主题

### GET /manifest
获取完整的 manifest.json

### 🧪 测试工作流接口（新增）

#### POST /test/validate
验证场景代码

**请求体:**
```json
{
  "code_content": "import React from 'react'..."
}
```

**响应示例:**
```json
{
  "success": true,
  "errors": [],
  "warnings": ["建议导入 Remotion 组件"],
  "message": "代码验证完成"
}
```

#### GET /test/preview-status
检查 Remotion Studio 预览状态

**响应示例:**
```json
{
  "success": true,
  "is_running": true,
  "port": 3000,
  "url": "http://localhost:3000"
}
```

#### POST /test/start-preview
启动 Remotion Studio 预览服务器

**响应示例:**
```json
{
  "success": true,
  "message": "Remotion Studio 正在启动...",
  "url": "http://localhost:3000",
  "wait_time": 5,
  "already_running": false
}
```

#### POST /test/workflow
执行完整测试工作流（验证 → 上传 → 启动预览）

**请求体:**
```json
{
  "scene_id": "scene-test",
  "scene_name": "测试场景",
  "duration": 90,
  "code_content": "...",
  "theme": "tech"
}
```

**响应示例:**
```json
{
  "success": true,
  "step": "complete",
  "message": "测试工作流完成",
  "preview_running": true,
  "preview_url": "http://localhost:3000",
  "scene_id": "scene-test"
}
```

## 📁 文件结构

```
web-uploader/
├── index.html              # Web 界面（Vue 3 单页应用）
├── server.py               # Flask API 服务器
├── requirements.txt        # Python 依赖
├── start.sh               # macOS/Linux 启动脚本
├── start.bat              # Windows 启动脚本
├── README.md              # 本文档
├── QUICK_TEST_GUIDE.md    # 快速测试工作流指南（新增）
└── test_api.py            # API 测试脚本
```

## 🎨 界面预览

### 上传场景
- 清晰的表单布局
- 实时帧数转秒数计算
- 代码编辑器样式
- 一键加载示例

### 场景列表
- 卡片式展示
- 显示场景详细信息
- 总时长统计
- 快速删除操作

### 配置管理
- 视频参数展示
- 主题切换按钮
- manifest.json 预览
- 实时更新

## 🔧 技术栈

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **TailwindCSS** - 实用优先的 CSS 框架
- **原生 JavaScript** - 无需构建工具

### 后端
- **Flask** - Python Web 框架
- **Flask-CORS** - 跨域资源共享
- **push_scene.py** - 场景推送核心逻辑

## 🐛 故障排除

### 问题 1: 无法连接到 API

**症状**: 前端显示 "获取场景列表失败"

**解决方案**:
1. 确保后端服务器正在运行
2. 检查 API 地址是否正确 (默认: http://localhost:8000)
3. 检查防火墙设置

### 问题 2: 上传失败

**症状**: 点击上传后显示错误

**解决方案**:
1. 检查场景代码是否有语法错误
2. 确保所有必填字段都已填写
3. 查看浏览器控制台的错误信息
4. 查看服务器终端的错误日志

### 问题 3: 场景列表为空

**症状**: 场景列表显示 "暂无场景"

**解决方案**:
1. 确认是否已上传场景
2. 检查 `src/scenes/manifest.json` 是否存在
3. 检查文件权限

### 问题 4: Python 依赖安装失败

**症状**: `pip install` 报错

**解决方案**:
```bash
# 使用国内镜像源
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 或使用虚拟环境
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

## 💡 最佳实践

### 1. 场景命名规范

```
✅ 推荐:
- scene-1, scene-2, scene-3
- intro, content, conclusion
- dna-structure, dna-replication

❌ 不推荐:
- Scene 1 (包含空格)
- 场景1 (非英文)
- scene_1 (使用下划线)
```

### 2. 场景时长建议

```
标题卡: 60-90 帧 (2-3秒)
内容讲解: 120-180 帧 (4-6秒)
代码演示: 180-300 帧 (6-10秒)
过渡动画: 30-60 帧 (1-2秒)
```

### 3. 代码组织

- 每个场景一个独立的 React 组件
- 使用项目提供的组件库
- 保持代码简洁易读
- 添加必要的注释

### 4. 批量上传技巧

- 先在本地编辑器中准备好 JSON
- 使用 JSON 格式化工具验证格式
- 分批上传，避免一次上传过多场景
- 保存 JSON 文件作为备份

## 🔗 相关文档

- [QUICK_TEST_GUIDE.md](./QUICK_TEST_GUIDE.md) - 快速测试工作流指南（新增）
- [PUSH_API_GUIDE.md](../PUSH_API_GUIDE.md) - Python API 详细文档
- [AI_INTEGRATION_GUIDE.md](../AI_INTEGRATION_GUIDE.md) - AI 集成指南
- [COMPONENT_LIBRARY_GUIDE.md](../COMPONENT_LIBRARY_GUIDE.md) - 组件库使用指南

## 📞 支持

如有问题或建议，请：
1. 查看本文档的故障排除部分
2. 查看相关文档
3. 提交 Issue

## 📄 许可证

本项目遵循 MIT 许可证

---

**享受使用场景上传管理器！** 🎉
