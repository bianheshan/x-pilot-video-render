# Remotion Worker Scripts

基于 Remotion v4.0.399 官方 API 的 Bundle 和 Render 辅助脚本，适用于 E2B sandbox 动态调用。

## 📦 bundle-worker.mjs

使用 `@remotion/bundler` 官方 API 进行打包。

### 用法

```bash
node scripts/bundle-worker.mjs --entry <path> --out-dir <path>
```

### 参数

- `--entry <path>` - 入口文件路径（必填，相对或绝对）
- `--out-dir <path>` - 输出目录路径（必填，相对或绝对）

### 示例

```bash
# 基本用法
node scripts/bundle-worker.mjs --entry src/index.ts --out-dir out/bundle

# 使用 npm script
npm run bundle:api -- --entry src/index.ts --out-dir out/bundle
```

### 特性

- ✅ 启用持久化缓存 (`enableCaching: true`)
- ✅ 实时进度输出（每 10% 一次）
- ✅ 结构化日志（带 `[bundle]` 前缀）
- ✅ 完善的错误处理和 exit code

### 输出示例

```
[bundle] ==========================================
[bundle] Remotion Bundle Worker (Official API)
[bundle] ==========================================
[bundle] 工作目录: /app
[bundle] 入口文件: /app/src/index.ts
[bundle] 输出目录: /app/out/bundle
[bundle] ------------------------------------------
[bundle] 🚀 开始使用 Webpack 打包...
[bundle] 📦 Webpack 打包进度: 20%
[bundle] 📦 Webpack 打包进度: 60%
[bundle] 📦 Webpack 打包进度: 100%
[bundle] ✅ Bundle 完成！
[bundle] 输出路径: /app/out/bundle
[bundle] 耗时: 0.93 秒
```

---

## 🎬 render-worker.mjs

使用 `@remotion/renderer` 官方 API 进行渲染。

### 用法

```bash
node scripts/render-worker.mjs --serve-url <path> --output <path> [--composition <id>]
```

### 参数

- `--serve-url <path>` - Bundle 路径或 URL（必填）
- `--output <path>` - 输出文件路径（必填）
- `--composition <id>` - Composition ID（可选，默认使用第一个或 MainVideo）

### 示例

```bash
# 基本用法（自动选择 composition）
node scripts/render-worker.mjs --serve-url out/bundle --output output.mp4

# 指定 composition
node scripts/render-worker.mjs \
  --serve-url out/bundle \
  --composition MainVideo \
  --output output.mp4

# 使用 npm script
npm run render:api -- --serve-url out/bundle --output output.mp4
```

### 特性

- ✅ 自动检测 composition（如果未指定）
- ✅ 自动并发控制 (`concurrency: null`)
- ✅ 实时进度回调（渲染、编码、合成三阶段）
- ✅ 结构化日志（带 `[render]` 前缀）
- ✅ 完善的错误处理和 exit code

### 输出示例

```
[render] ==========================================
[render] Remotion Render Worker (Official API)
[render] ==========================================
[render] 📋 步骤 1/3: 获取 Compositions...
[render] ✅ 找到 1 个 composition:
[render]    1. MainVideo (1920x1080, 30fps, 90帧)
[render]
[render] 🎯 步骤 2/3: 选择 Composition...
[render] ✅ Composition 详情:
[render]    ID: MainVideo
[render]    分辨率: 1920x1080
[render]    总帧数: 90
[render]
[render] 🎬 步骤 3/3: 渲染视频...
[render] 🚀 渲染已启动:
[render]    总帧数: 90
[render]    并发数: 8
[render] 📦 阶段: 正在编码...
[render] encoding: 50% (已渲染: 45帧, 已编码: 45帧)
[render] ✅ 渲染完成！
[render] 总耗时: 15.23 秒
```

---

## 🔄 完整工作流

```bash
# Step 1: 生成 scene-registry（如果需要）
node scripts/scene-preflight.mjs

# Step 2: Bundle
npm run bundle:api -- --entry src/index.ts --out-dir out/bundle

# Step 3: Render
npm run render:api -- --serve-url out/bundle --output output.mp4
```

---

## 🚀 E2B Sandbox 集成

在 E2B sandbox 中调用脚本：

```typescript
// E2B Server 示例代码
const projectId = 'proj_123';

// Step 1: Bundle
const bundleCmd = `bash -lc "cd /app && node scripts/bundle-worker.mjs --entry src/index.ts --out-dir out/bundles/${projectId}"`;
const bundleResult = await sandbox.commands.run(bundleCmd);

if (bundleResult.exitCode !== 0) {
  throw new Error(`Bundle failed: ${bundleResult.stderr}`);
}

// Step 2: Render
const renderCmd = `bash -lc "cd /app && node scripts/render-worker.mjs --serve-url out/bundles/${projectId} --output out/renders/${projectId}.mp4"`;
const renderResult = await sandbox.commands.run(renderCmd);

if (renderResult.exitCode !== 0) {
  throw new Error(`Render failed: ${renderResult.stderr}`);
}
```

---

## 📊 性能特性

### 缓存优化

- **首次打包**: ~1 秒
- **缓存打包**: ~0.5 秒（性能提升 50%）
- **缓存位置**: `node_modules/.cache/remotion`

### 并发渲染

- **自动检测**: `concurrency: null` 自动选择最优并发数
- **典型配置**: 8 核 CPU = 8 并发
- **性能**: ~6 帧/秒（1080p@30fps）

---

## ⚠️ 注意事项

### 依赖要求

确保 `@remotion/bundler` 和 `@remotion/renderer` 在 `dependencies` 中（不是 `devDependencies`），这样生产环境才能正常 import。

### Node.js 版本

- **推荐**: Node.js 20.x 或 22.x
- **最低**: Node.js 18.x（支持 ES Modules）

### 权限

脚本已设置可执行权限：

```bash
chmod +x scripts/bundle-worker.mjs
chmod +x scripts/render-worker.mjs
```

---

## 📚 参考文档

- [Remotion bundle() API](https://www.remotion.dev/docs/bundle)
- [Remotion renderMedia() API](https://www.remotion.dev/docs/renderer/render-media)
- [Remotion getCompositions() API](https://www.remotion.dev/docs/renderer/get-compositions)

---

## 🐛 错误处理

脚本包含完善的错误处理：

- **Exit Code 0**: 成功
- **Exit Code 1**: 失败（含详细错误信息和堆栈）

示例错误输出：

```
[bundle] ==========================================
[bundle] ❌ Bundle 失败！
[bundle] ==========================================
[bundle] 错误信息: Module not found: Error: Can't resolve './index.ts'
[bundle] 耗时: 0.38 秒
[bundle] ------------------------------------------
[bundle] 堆栈信息:
Error: Module not found...
    at internalBundle (...)
[bundle] ==========================================
```
