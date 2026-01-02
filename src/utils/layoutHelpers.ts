/**
 * 布局辅助函数 - 用于生成代码中的常见布局计算
 */

/**
 * 计算元素环绕中心点的位置（圆形轨道）
 * @param frame 当前帧（用于动画）
 * @param radius 半径（默认 200）
 * @param speed 旋转速度（默认 1，0 = 静止）
 * @param centerX 中心 X 坐标（默认 960，即 1920/2）
 * @param centerY 中心 Y 坐标（默认 540，即 1080/2）
 * @returns { x, y } 绝对坐标位置
 */
export function calculateOrbitPosition(
  frame: number,
  radius: number = 200,
  speed: number = 1,
  centerX: number = 960,
  centerY: number = 540
): { x: number; y: number } {
  // 防护：速度不能为 0（避免除零）
  const safeSpeed = speed === 0 ? 0.01 : speed;
  const angle = (frame / 100) * safeSpeed;
  
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius,
  };
}

/**
 * 简化版：计算多个元素的环绕位置（静态布局）
 * @param index 元素索引
 * @param total 总元素数
 * @param radius 半径（默认 200）
 * @param centerX 中心 X 坐标
 * @param centerY 中心 Y 坐标
 */
export function calculateStaticOrbitPosition(
  index: number,
  total: number,
  radius: number = 200,
  centerX: number = 960,
  centerY: number = 540
): { x: number; y: number } {
  const angle = (index / total) * Math.PI * 2;
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius,
  };
}

/**
 * 计算贝塞尔曲线路径上的点
 * @param t 进度 (0-1)
 * @param p0 起点
 * @param p1 控制点 1
 * @param p2 控制点 2
 * @param p3 终点
 * @returns { x, y } 路径上的点
 */
export function calculateBezierPoint(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): { x: number; y: number } {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

  return { x, y };
}

/**
 * 计算元素追踪目标的位置（跟随动画）
 * @param targetPos 目标位置
 * @param currentPos 当前位置
 * @param smoothing 平滑系数 (0-1, 越大越平滑)
 * @returns 新位置
 */
export function calculateTrackingPosition(
  targetPos: { x: number; y: number },
  currentPos: { x: number; y: number },
  smoothing: number = 0.1
): { x: number; y: number } {
  return {
    x: currentPos.x + (targetPos.x - currentPos.x) * smoothing,
    y: currentPos.y + (targetPos.y - currentPos.y) * smoothing,
  };
}

/**
 * 根据深度计算景深效果（模糊 + 缩放）
 * @param depth 深度值 (0 = 最前，1 = 最后)
 * @param maxBlur 最大模糊度（px）
 * @param scaleRange 缩放范围 [最小, 最大]
 * @returns { blur, scale, opacity }
 */
export function calculateDepthOfField(
  depth: number,
  maxBlur: number = 10,
  scaleRange: [number, number] = [0.8, 1]
): { blur: number; scale: number; opacity: number } {
  const clampedDepth = Math.max(0, Math.min(1, depth));
  
  return {
    blur: clampedDepth * maxBlur,
    scale: scaleRange[0] + (1 - clampedDepth) * (scaleRange[1] - scaleRange[0]),
    opacity: 1 - clampedDepth * 0.3, // 远处元素稍微透明
  };
}

/**
 * 生成抖动偏移（模拟手持相机）
 * @param frame 当前帧
 * @param intensity 强度 (0-1)
 * @param seed 随机种子
 * @returns { x, y } 抖动偏移量
 */
export function calculateHandheldShake(
  frame: number,
  intensity: number = 0.5,
  seed: number = 0
): { x: number; y: number } {
  const freq = 0.3; // 频率
  const amp = intensity * 3; // 振幅
  
  return {
    x: Math.sin(frame * freq + seed) * amp + Math.cos(frame * freq * 0.7) * amp * 0.5,
    y: Math.cos(frame * freq + seed + 1) * amp + Math.sin(frame * freq * 0.5) * amp * 0.5,
  };
}

/**
 * 计算视差偏移（多层背景视差效果）
 * @param scrollProgress 滚动进度 (0-1)
 * @param layerDepth 层深度 (0 = 最前，1 = 最后)
 * @param maxOffset 最大偏移量
 * @returns 偏移量
 */
export function calculateParallaxOffset(
  scrollProgress: number,
  layerDepth: number,
  maxOffset: number = 100
): number {
  return scrollProgress * maxOffset * layerDepth;
}

/**
 * 计算弹性动画路径（弹簧效果）
 * @param progress 进度 (0-1)
 * @param overshoot 超调量 (0-1)
 * @param bounces 弹跳次数
 * @returns 调整后的进度值
 */
export function calculateElasticEasing(
  progress: number,
  overshoot: number = 0.1,
  bounces: number = 3
): number {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  
  const omega = bounces * Math.PI;
  const decay = Math.pow(1 - progress, 2);
  
  return 1 - decay * Math.cos(omega * progress) * (1 + overshoot);
}

/**
 * 计算螺旋路径位置
 * @param progress 进度 (0-1)
 * @param radiusStart 起始半径
 * @param radiusEnd 结束半径
 * @param turns 圈数
 * @returns { x, y, angle } 位置和角度
 */
export function calculateSpiralPosition(
  progress: number,
  radiusStart: number,
  radiusEnd: number,
  turns: number = 2
): { x: number; y: number; angle: number } {
  const angle = progress * turns * Math.PI * 2;
  const radius = radiusStart + (radiusEnd - radiusStart) * progress;
  
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    angle: (angle * 180) / Math.PI,
  };
}
