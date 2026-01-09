#!/usr/bin/env node
/**
 * Remotion Render Worker Script
 * 
 * 使用 @remotion/renderer 官方 API 进行渲染
 * 适用于 E2B sandbox 动态调用
 * 
 * 用法：
 *   node scripts/render-worker.mjs --serve-url out/bundle --output output.mp4
 *   node scripts/render-worker.mjs --serve-url out/bundle --composition MainVideo --output output.mp4
 * 
 * 参数：
 *   --serve-url <path>     Bundle 路径或 URL（必填）
 *   --output <path>        输出文件路径（必填）
 *   --composition <id>     Composition ID（可选，默认使用第一个）
 * 
 * 基于 Remotion v4.0.399 官方文档：
 * https://www.remotion.dev/docs/renderer/render-media
 * https://www.remotion.dev/docs/renderer/get-compositions
 */

import { getCompositions, renderMedia } from '@remotion/renderer';
import { resolve, dirname } from 'path';
import { mkdir } from 'fs/promises';
import { parseArgs } from 'util';

// 解析命令行参数
let values;
try {
  const parsed = parseArgs({
    options: {
      'serve-url': { type: 'string' },
      'composition': { type: 'string' },
      'output': { type: 'string' },
    },
  });
  values = parsed.values;
} catch (error) {
  console.error('[render] ❌ 参数解析失败:', error.message);
  console.error('[render] 用法: node scripts/render-worker.mjs --serve-url <path> --output <path> [--composition <id>]');
  process.exit(1);
}

// 验证必填参数
if (!values['serve-url'] || !values['output']) {
  console.error('[render] ❌ 缺少必填参数');
  console.error('[render] 用法: node scripts/render-worker.mjs --serve-url <path> --output <path> [--composition <id>]');
  console.error('[render] 示例: node scripts/render-worker.mjs --serve-url out/bundle --output output.mp4');
  process.exit(1);
}

// 解析路径
const serveUrl = resolve(process.cwd(), values['serve-url']);
const outputLocation = resolve(process.cwd(), values['output']);
let compositionId = values['composition'];

console.log('[render] ==========================================');
console.log('[render] Remotion Render Worker (Official API)');
console.log('[render] ==========================================');
console.log('[render] 工作目录:', process.cwd());
console.log('[render] Serve URL:', serveUrl);
console.log('[render] 输出路径:', outputLocation);
if (compositionId) {
  console.log('[render] Composition:', compositionId);
}
console.log('[render] Node 版本:', process.version);
console.log('[render] ------------------------------------------');

const startTime = Date.now();

try {
  // ==========================================
  // 步骤 1: 获取所有 compositions
  // ==========================================
  console.log('[render] 📋 步骤 1/3: 获取 Compositions...');
  
  const compositions = await getCompositions(serveUrl, {
    // Remotion v5+ 要求传入 inputProps（即使为空对象）
    inputProps: {},
    // 日志级别
    logLevel: 'info',
    // 超时设置（30秒）
    timeoutInMilliseconds: 30000,
  });

  if (!compositions || compositions.length === 0) {
    throw new Error('未找到任何 composition，请检查 bundle 是否正确');
  }

  console.log('[render] ✅ 找到', compositions.length, '个 composition:');
  compositions.forEach((comp, index) => {
    console.log(`[render]    ${index + 1}. ${comp.id} (${comp.width}x${comp.height}, ${comp.fps}fps, ${comp.durationInFrames}帧)`);
  });
  console.log('[render]');

  // ==========================================
  // 步骤 2: 选择 composition
  // ==========================================
  console.log('[render] 🎯 步骤 2/3: 选择 Composition...');

  // 如果未指定，使用第一个或名为 'MainVideo' 的
  if (!compositionId) {
    const mainVideo = compositions.find(c => c.id === 'MainVideo');
    compositionId = mainVideo ? mainVideo.id : compositions[0].id;
    console.log('[render] 自动选择:', compositionId);
  }

  const composition = compositions.find(c => c.id === compositionId);
  if (!composition) {
    throw new Error(`未找到 composition "${compositionId}"，可用: ${compositions.map(c => c.id).join(', ')}`);
  }

  console.log('[render] ✅ Composition 详情:');
  console.log('[render]    ID:', composition.id);
  console.log('[render]    分辨率:', `${composition.width}x${composition.height}`);
  console.log('[render]    帧率:', composition.fps, 'fps');
  console.log('[render]    总帧数:', composition.durationInFrames);
  console.log('[render]    时长:', (composition.durationInFrames / composition.fps).toFixed(2), '秒');
  if (composition.defaultProps) {
    console.log('[render]    默认 Props:', JSON.stringify(composition.defaultProps));
  }
  console.log('[render]');

  // ==========================================
  // 步骤 3: 渲染视频
  // ==========================================
  console.log('[render] 🎬 步骤 3/3: 渲染视频...');

  // 创建输出目录
  await mkdir(dirname(outputLocation), { recursive: true });

  let currentStage = '';
  let lastPercentage = 0;

  // 调用官方 renderMedia API
  await renderMedia({
    serveUrl,
    composition,
    // 编码器配置
    codec: 'h264',
    // 输出路径
    outputLocation,
    // 并发控制（null = 自动检测最优并发数）
    concurrency: null,
    // 覆盖已存在文件
    overwrite: true,
    // 开始回调
    onStart: ({ frameCount, resolvedConcurrency }) => {
      console.log('[render] 🚀 渲染已启动:');
      console.log('[render]    总帧数:', frameCount);
      console.log('[render]    并发数:', resolvedConcurrency);
      console.log('[render]    预计时长:', (frameCount / composition.fps).toFixed(2), '秒');
      console.log('[render] ------------------------------------------');
    },
    // 进度回调
    onProgress: ({ progress, renderedFrames, encodedFrames, stitchStage }) => {
      const percentage = Math.floor(progress * 100);
      
      // 阶段切换时输出
      if (stitchStage !== currentStage) {
        currentStage = stitchStage;
        if (stitchStage === 'encoding') {
          console.log('[render] 📦 阶段: 正在编码...');
        } else if (stitchStage === 'muxing') {
          console.log('[render] 🎵 阶段: 正在合成音视频...');
        }
      }

      // 每 10% 输出一次进度
      if (percentage >= lastPercentage + 10) {
        lastPercentage = Math.floor(percentage / 10) * 10;
        console.log(
          `[render] ${stitchStage}: ${lastPercentage}% ` +
          `(已渲染: ${renderedFrames}帧, 已编码: ${encodedFrames}帧)`
        );
      }
    },
    // 浏览器日志回调（可选，用于调试）
    onBrowserLog: (log) => {
      if (log.type === 'error') {
        console.error('[render] 浏览器错误:', log.text);
      }
    },
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('[render]');
  console.log('[render] ==========================================');
  console.log('[render] ✅ 渲染完成！');
  console.log('[render] ==========================================');
  console.log('[render] 输出文件:', outputLocation);
  console.log('[render] 总耗时:', duration, '秒');
  console.log('[render] 平均速度:', (composition.durationInFrames / parseFloat(duration)).toFixed(2), '帧/秒');
  console.log('[render] ------------------------------------------');

  process.exit(0);
} catch (error) {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.error('[render]');
  console.error('[render] ==========================================');
  console.error('[render] ❌ 渲染失败！');
  console.error('[render] ==========================================');
  console.error('[render] 错误信息:', error.message || error);
  console.error('[render] 耗时:', duration, '秒');

  if (error.stack) {
    console.error('[render] ------------------------------------------');
    console.error('[render] 堆栈信息:');
    console.error(error.stack);
  }

  console.error('[render] ==========================================');
  process.exit(1);
}
