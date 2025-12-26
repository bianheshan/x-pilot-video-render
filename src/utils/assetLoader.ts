/**
 * 资产加载工具
 * 用于动态加载外部资产（图片、视频、音频等）
 */

export interface AssetLoadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * 预加载图片
 */
export const preloadImage = (url: string): Promise<AssetLoadResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ success: true, url });
    };
    img.onerror = () => {
      resolve({ success: false, error: `Failed to load image: ${url}` });
    };
    img.src = url;
  });
};

/**
 * 预加载多个图片
 */
export const preloadImages = async (
  urls: string[]
): Promise<AssetLoadResult[]> => {
  return Promise.all(urls.map((url) => preloadImage(url)));
};

/**
 * 检查资产是否可访问
 */
export const checkAssetAvailability = async (
  url: string
): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * 获取资产的 Data URL（用于小文件）
 */
export const getAssetDataUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return null;
  }
};

/**
 * 资产缓存管理
 */
class AssetCache {
  private cache: Map<string, any> = new Map();

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  get(key: string): any | undefined {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const assetCache = new AssetCache();
