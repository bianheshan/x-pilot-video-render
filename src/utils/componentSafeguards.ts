/**
 * 🛡️ 组件防护工具函数
 * 
 * 为AI生成的代码提供运行时保护，防止常见的运行时错误
 * 
 * 使用场景：
 * - 验证必填属性
 * - 确保 interpolate 的参数有效
 * - 保护数组和对象操作
 * - 提供友好的错误提示
 */

/**
 * 验证数值是否有效（用于 interpolate 的 outputRange）
 * 
 * @param value - 需要验证的值
 * @param fallback - 默认值
 * @param min - 最小值（可选）
 * @param max - 最大值（可选）
 * @returns 安全的数值
 * 
 * @example
 * const safePercentage = validateNumber(props.percentage, 0, 0, 100);
 * const progress = interpolate(frame, [0, 100], [0, safePercentage]);
 */
export function validateNumber(
  value: unknown,
  fallback: number = 0,
  min?: number,
  max?: number
): number {
  // 检查是否为有效数字
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    console.warn(`[Safeguard] Invalid number: ${value}, using fallback: ${fallback}`);
    return fallback;
  }

  let result = value;

  // 限制最小值
  if (typeof min === 'number' && result < min) {
    console.warn(`[Safeguard] Number ${result} is below min ${min}, clamping to ${min}`);
    result = min;
  }

  // 限制最大值
  if (typeof max === 'number' && result > max) {
    console.warn(`[Safeguard] Number ${result} is above max ${max}, clamping to ${max}`);
    result = max;
  }

  return result;
}

/**
 * 验证数组是否有效
 * 
 * @param value - 需要验证的值
 * @param componentName - 组件名（用于错误提示）
 * @param propName - 属性名（用于错误提示）
 * @returns 验证结果对象
 * 
 * @example
 * const validation = validateArray(props.items, 'ListBulletPoints', 'items');
 * if (!validation.isValid) {
 *   return <ErrorMessage>{validation.errorMessage}</ErrorMessage>;
 * }
 */
export function validateArray<T = unknown>(
  value: unknown,
  componentName: string,
  propName: string
): {
  isValid: boolean;
  errorMessage?: string;
  data?: T[];
} {
  if (!Array.isArray(value)) {
    const errorMessage = `⚠️ ${componentName} Error: "${propName}" must be an array (got ${typeof value})`;
    console.error(`[${componentName}]`, errorMessage);
    return {
      isValid: false,
      errorMessage,
    };
  }

  if (value.length === 0) {
    const errorMessage = `${componentName}: No ${propName} to display`;
    console.warn(`[${componentName}] ${propName} array is empty`);
    return {
      isValid: false,
      errorMessage,
    };
  }

  return {
    isValid: true,
    data: value as T[],
  };
}

/**
 * 验证字符串是否有效
 * 
 * @param value - 需要验证的值
 * @param componentName - 组件名
 * @param propName - 属性名
 * @param allowEmpty - 是否允许空字符串
 * @returns 验证结果对象
 * 
 * @example
 * const validation = validateString(props.label, 'StatCircularProgress', 'label', false);
 * if (!validation.isValid) {
 *   return <ErrorMessage>{validation.errorMessage}</ErrorMessage>;
 * }
 */
export function validateString(
  value: unknown,
  componentName: string,
  propName: string,
  allowEmpty: boolean = false
): {
  isValid: boolean;
  errorMessage?: string;
  data?: string;
} {
  if (typeof value !== 'string') {
    const errorMessage = `⚠️ ${componentName} Error: "${propName}" must be a string (got ${typeof value})`;
    console.error(`[${componentName}]`, errorMessage);
    return {
      isValid: false,
      errorMessage,
    };
  }

  if (!allowEmpty && value.trim() === '') {
    const errorMessage = `⚠️ ${componentName} Error: "${propName}" cannot be empty`;
    console.error(`[${componentName}]`, errorMessage);
    return {
      isValid: false,
      errorMessage,
    };
  }

  return {
    isValid: true,
    data: value,
  };
}

/**
 * 安全的数组过滤器（移除 null/undefined/false）
 * 
 * @param arr - 数组
 * @returns 过滤后的数组
 * 
 * @example
 * const validItems = safeFilter(props.items);
 * validItems.map(item => ...)
 */
export function safeFilter<T>(arr: (T | null | undefined | false)[]): T[] {
  return arr.filter((item): item is T => Boolean(item));
}

/**
 * 安全的对象属性访问
 * 
 * @param obj - 对象
 * @param path - 属性路径（如 "data.value"）
 * @param fallback - 默认值
 * @returns 属性值或默认值
 * 
 * @example
 * const value = safeGet(item, 'data.value', 0);
 */
export function safeGet<T = unknown>(
  obj: any,
  path: string,
  fallback: T
): T {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result == null || typeof result !== 'object') {
        return fallback;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : fallback;
  } catch (error) {
    console.warn(`[Safeguard] Error accessing path "${path}":`, error);
    return fallback;
  }
}

/**
 * 创建错误占位组件（用于渲染错误信息）
 * 
 * @param _message - 错误消息（未使用，仅用于类型提示）
 * @param backgroundColor - 背景色
 * @returns React 样式对象
 * 
 * @example
 * return <div style={createErrorPlaceholder('Missing required prop')} />
 */
export function createErrorPlaceholder(
  _message: string,
  backgroundColor: string = 'transparent'
): React.CSSProperties {
  return {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor,
    color: "#ef4444",
    fontSize: 24,
    fontWeight: 600,
    padding: 40,
    textAlign: "center",
    flexDirection: "column",
    gap: 20,
  };
}

/**
 * 验证 interpolate 的 outputRange 参数
 * 
 * @param range - 输出范围数组
 * @param componentName - 组件名
 * @returns 安全的范围数组
 * 
 * @example
 * const outputRange = validateInterpolateRange([0, props.value], 'MyComponent');
 * const result = interpolate(frame, [0, 100], outputRange);
 */
export function validateInterpolateRange(
  range: unknown[],
  componentName: string
): number[] {
  const safeRange = range.map((value, index) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      console.error(
        `[${componentName}] interpolate outputRange[${index}] is not a valid number: ${value}, using 0`
      );
      return 0;
    }
    return value;
  });

  return safeRange;
}

/**
 * 防止递归深度过深（用于树形结构）
 * 
 * @param maxDepth - 最大深度
 * @returns 深度检查函数
 * 
 * @example
 * const checkDepth = createDepthGuard(10);
 * function renderNode(node, depth = 0) {
 *   if (!checkDepth(depth)) return null;
 *   // ... 渲染逻辑
 * }
 */
export function createDepthGuard(maxDepth: number = 20) {
  return (currentDepth: number): boolean => {
    if (currentDepth > maxDepth) {
      console.error(`[Safeguard] Recursion depth exceeded ${maxDepth}, stopping`);
      return false;
    }
    return true;
  };
}

/**
 * 安全的除法（防止除以0）
 * 
 * @param numerator - 分子
 * @param denominator - 分母
 * @param fallback - 默认值
 * @returns 结果
 * 
 * @example
 * const progress = safeDivide(currentValue, totalValue, 0);
 */
export function safeDivide(
  numerator: number,
  denominator: number,
  fallback: number = 0
): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) {
    return fallback;
  }
  
  if (denominator === 0) {
    console.warn('[Safeguard] Division by zero, using fallback');
    return fallback;
  }
  
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : fallback;
}

/**
 * 类型守卫工具
 */
export const TypeGuards = {
  /**
   * 检查是否为有效的 React Node
   */
  isValidReactNode(value: unknown): value is React.ReactNode {
    return (
      value !== null &&
      value !== undefined &&
      (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        React.isValidElement(value))
    );
  },

  /**
   * 检查是否为纯对象
   */
  isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      value.constructor === Object
    );
  },
};

// React 类型导入（用于类型声明）
import React from 'react';
