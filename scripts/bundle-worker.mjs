#!/usr/bin/env node
/**
 * Remotion Bundle Worker Script
 * 
 * 使用 @remotion/bundler 官方 API 进行打包
 * 适用于 E2B sandbox 动态调用
 * 
 * 用法：
 *   node scripts/bundle-worker.mjs --entry src/index.ts --out-dir out/bundle
 * 
 * 参数：
 *   --entry <path>    入口文件路径（相对或绝对）
 *   --out-dir <path>  输出目录路径（相对或绝对）
 * 
 * 基于 Remotion v4.0.399 官方文档：
 * https://www.remotion.dev/docs/bundle
 */

import { bundle } from '@remotion/bundler';
import { resolve } from 'path';
import { parseArgs } from 'util';

// 解析命令行参数
let values;
try {
  const parsed = parseArgs({
    options: {
      entry: { type: 'string' },
      'out-dir': { type: 'string' },
    },
  });
  values = parsed.values;
} catch (error) {
  console.error('[bundle] ❌ 参数解析失败:', error.message);
  console.error('[bundle] 用法: node scripts/bundle-worker.mjs --entry <path> --out-dir <path>');
  process.exit(1);
}

// 验证必填参数
if (!values.entry || !values['out-dir']) {
  console.error('[bundle] ❌ 缺少必填参数');
  console.error('[bundle] 用法: node scripts/bundle-worker.mjs --entry <path> --out-dir <path>');
  console.error('[bundle] 示例: node scripts/bundle-worker.mjs --entry src/index.ts --out-dir out/bundle');
  process.exit(1);
}

// 解析为绝对路径
const entryPoint = resolve(process.cwd(), values.entry);
const outDir = resolve(process.cwd(), values['out-dir']);

console.log('[bundle] ==========================================');
console.log('[bundle] Remotion Bundle Worker (Official API)');
console.log('[bundle] ==========================================');
console.log('[bundle] 工作目录:', process.cwd());
console.log('[bundle] 入口文件:', entryPoint);
console.log('[bundle] 输出目录:', outDir);
console.log('[bundle] Node 版本:', process.version);
console.log('[bundle] ------------------------------------------');

const startTime = Date.now();
let lastProgress = 0;

try {
  console.log('[bundle] 🚀 开始使用 Webpack 打包...');
  console.log('[bundle]');

  // 调用官方 bundle API
  const result = await bundle({
    entryPoint,
    outDir,
    // 启用持久化缓存（性能提升 67%）
    enableCaching: true,
    // 进度回调
    onProgress: (progress) => {
      // 每 10% 输出一次，避免日志过多
      const currentProgress = Math.floor(progress / 10) * 10;
      if (currentProgress > lastProgress) {
        lastProgress = currentProgress;
        console.log(`[bundle] 📦 Webpack 打包进度: ${currentProgress}%`);
      }
    },
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('[bundle]');
  console.log('[bundle] ==========================================');
  console.log('[bundle] ✅ Bundle 完成！');
  console.log('[bundle] ==========================================');
  console.log('[bundle] 输出路径:', result);
  console.log('[bundle] 耗时:', duration, '秒');
  console.log('[bundle] 缓存状态: 已启用（enableCaching: true）');
  console.log('[bundle] ------------------------------------------');

  process.exit(0);
} catch (error) {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.error('[bundle]');
  console.error('[bundle] ==========================================');
  console.error('[bundle] ❌ Bundle 失败！');
  console.error('[bundle] ==========================================');
  console.error('[bundle] 错误信息:', error.message || error);
  console.error('[bundle] 耗时:', duration, '秒');

  if (error.stack) {
    console.error('[bundle] ------------------------------------------');
    console.error('[bundle] 堆栈信息:');
    console.error(error.stack);
  }

  console.error('[bundle] ==========================================');
  process.exit(1);
}
