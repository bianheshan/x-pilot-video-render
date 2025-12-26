# X-Pilot Remotion 视频渲染模板

> 🎬 用于 AI 生成教育视频的 Remotion 模板，集成 E2B 平台实现云端自动化渲染

## 🎯 项目简介

这是一个专为 E2B 平台设计的 Remotion 视频渲染模板项目。它提供：

- ✅ 完整的 Remotion 4.0 组件库（支持 React 19）
- ✅ 丰富的可视化组件（图表、3D、代码展示等）
- ✅ 主题系统（Tech、Science、Business 等）
- ✅ E2B 沙箱环境配置
- ✅ 自动化场景渲染流程

## 📦 这是什么项目？

**这是一个 E2B 模板项目**，用于定义视频渲染的运行环境。

```
本项目 (模板)                服务端项目 (独立)
    ↓                              ↓
E2B 平台创建沙箱 ← ← ← ← 调用 E2B API
    ↓
执行视频渲染
```

**重要**：
- ✅ 本项目：定义运行环境（Dockerfile + Remotion 组件）
- ❌ 本项目：不包含 E2B 客户端代码（应在服务端项目中）

## 🚀 快速开始

### 作为 E2B 模板使用

#### 1. 配置 API Key

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env，添加你的 API Key
# E2B_API_KEY=e2b_your-api-key-here
```

获取 API Key：https://e2b.dev/dashboard

#### 2. 构建模板

确保 Docker Desktop 正在运行，然后：

```powershell
cd c:\Users\bianh\x-pilot-video-render
npm run e2b:build:prod
```

#### 3. 记录模板 ID

构建完成后，记录显示的模板 ID（如 `tpl_xxxxxxxxxx`）

### 本地开发

如果你想在本地开发和测试：

```bash
# 安装依赖
npm install

# 启动 Remotion Studio
npm run dev

# 本地渲染测试
npm run render
```

## 📚 项目结构

```
x-pilot-video-render/
├── src/
│   ├── components/          # Remotion 组件库
│   │   ├── basic/          # 基础组件（标题、文字等）
│   │   ├── charts/         # 数据可视化
│   │   ├── 3d/             # 3D 渲染
│   │   └── code/           # 代码展示
│   ├── scenes/             # 场景文件
│   │   └── manifest.json   # 场景配置清单
│   ├── themes/             # 主题系统
│   └── Root.tsx            # Remotion 根组件
├── Dockerfile              # E2B 环境定义
├── e2b.toml               # E2B 模板配置
├── .env                    # API Key 配置
└── package.json            # npm 脚本（含 e2b:build:prod）
```

## 🎬 使用方式

### 在服务端项目中使用模板

**Node.js 示例**：

```typescript
import { Sandbox } from '@e2b/code-interpreter';

const sandbox = await Sandbox.create({
  template: 'x-pilot-remotion-template', // 或使用模板 ID
  apiKey: process.env.E2B_API_KEY,
});

// 推送场景代码
await sandbox.files.write('/app/src/scenes/my-scene.tsx', sceneCode);

// 更新 manifest.json
await sandbox.files.write('/app/src/scenes/manifest.json', manifestJson);

// 渲染视频
await sandbox.runCode(`
  import subprocess
  subprocess.run(['npm', 'run', 'render'], cwd='/app')
`);

// 下载视频
const video = await sandbox.files.read('/app/output/video.mp4');

await sandbox.close();
```

**Python 示例**：

```python
from e2b_code_interpreter import Sandbox

sandbox = Sandbox(
    template='x-pilot-remotion-template',
    api_key=os.getenv('E2B_API_KEY')
)

# 推送场景代码
sandbox.filesystem.write('/app/src/scenes/my-scene.tsx', scene_code)

# 更新 manifest
sandbox.filesystem.write('/app/src/scenes/manifest.json', manifest_json)

# 渲染视频
sandbox.run_code("""
import subprocess
subprocess.run(['npm', 'run', 'render'], cwd='/app')
""")

# 下载视频
video = sandbox.filesystem.read('/app/output/video.mp4')

sandbox.close()
```

## 📖 完整文档

### 快速开始
- **`E2B_QUICK_START.md`** ⭐ - 2 步开始使用
- **`E2B_BUILD_INSTRUCTIONS.md`** - 详细构建说明

### 架构设计
- **`E2B_ARCHITECTURE_OVERVIEW.md`** - 完整架构说明
- **`E2B_TEMPLATE_README.md`** - 模板项目定位

### 服务端集成
- **`E2B_SERVER_GUIDE.md`** ⭐⭐⭐ - 创建服务端项目
- **`E2B_NODEJS_GUIDE.md`** - Node.js 详细 API
- **`E2B_LATEST_GUIDE.md`** - Python 详细 API

### 组件库
- **`COMPONENT_LIBRARY_GUIDE.md`** - 组件使用指南
- **`THEME_SYSTEM_GUIDE.md`** - 主题系统文档

## 🎨 组件库

### 基础组件
- `TitleCard` - 标题卡片
- `TextReveal` - 文字动画
- `ImageTransition` - 图片转场

### 数据可视化
- `BarChart` - 柱状图
- `LineChart` - 折线图
- `PieChart` - 饼图
- `NetworkGraph` - 网络图

### 3D 组件
- `Rotating3DModel` - 3D 模型
- `IndustrialScene` - 工业场景

### 代码展示
- `CodeBlock` - 代码高亮
- `Terminal` - 终端模拟

## ⚙️ 技术栈

- **Remotion 4.0** - React 视频渲染框架
- **React 19** - 最新 React 版本
- **TypeScript** - 类型安全
- **Three.js** - 3D 渲染
- **D3.js** - 数据可视化
- **Recharts** - 图表库
- **Prism.js** - 代码高亮
- **FFmpeg** - 视频编码

## 🔧 环境要求

### 构建 E2B 模板
- Docker Desktop
- Node.js 20+（运行 E2B Template SDK 构建脚本）
- E2B API Key（写入 `.env` 或系统环境变量）

### 本地开发
- Node.js 18+
- npm 或 yarn
- Python 3.8+（可选）

## 🐛 故障排查

### Docker 未运行

```
❌ error during connect: ... The system cannot find the file specified.
```

**解决**：启动 Docker Desktop

### API Key 未配置

```
❌ You must be logged in to use this command.
```

**解决**：检查 `.env` 文件中的 `E2B_API_KEY`

### 构建超时

**解决**：
1. 检查网络连接
2. 清理 Docker 缓存：`docker system prune -a`
3. 增加超时时间

## 📊 性能指标

| 指标 | 数值 |
|------|------|
| Docker 镜像大小 | ~1.5 GB |
| 首次构建时间 | 10-15 分钟 |
| 后续构建时间 | 2-3 分钟（缓存） |
| 单场景渲染时间 | 30-60 秒 |
| 支持分辨率 | 最高 4K (3840x2160) |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

UNLICENSED - 私有项目

## 🔗 相关链接

- [E2B 官方网站](https://e2b.dev)
- [E2B 文档](https://e2b.dev/docs)
- [Remotion 文档](https://www.remotion.dev/docs)
- [React 文档](https://react.dev)

---

**下一步**：

1. ✅ 构建 E2B 模板：运行 `npm run e2b:build:prod`
2. ✅ 创建服务端项目：参考 `E2B_SERVER_GUIDE.md`
3. ✅ 开始生成视频！

有问题？查看 `E2B_QUICK_START.md` 或 `E2B_BUILD_INSTRUCTIONS.md`
