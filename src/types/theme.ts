/**
 * 主题系统类型定义
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  surface: string;
  surfaceLight: string;
  shadow: string; // 新增：阴影颜色
}

export interface ThemeFonts {
  heading: string; // 标题字体
  body: string;    // 正文字体
  mono: string;    // 等宽字体
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyMono: string;
  fontFamilySerif: string;
}

export interface ThemeAnimation {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts; // 新增：简化的字体配置
  typography: ThemeTypography;
  animation: ThemeAnimation;
}

/**
 * 预设主题
 */
export const PRESET_THEMES: Record<string, Theme> = {
  // 科技蓝主题
  tech: {
    id: "tech",
    name: "科技蓝",
    colors: {
      primary: "#00d4ff",
      secondary: "#0099ff",
      accent: "#00ff88",
      background: "#0a0a0a",
      text: "#ffffff",
      textSecondary: "#aaaaaa",
      success: "#00ff88",
      warning: "#ffaa00",
      error: "#ff0055",
      surface: "#1a1a2e",
      surfaceLight: "#2a2a3e",
      shadow: "#000000",
    },
    fonts: {
      heading: "Arial Black, sans-serif",
      body: "Arial, sans-serif",
      mono: "'Courier New', monospace",
    },
    typography: {
      fontFamily: "Arial, sans-serif",
      fontFamilyMono: "'Courier New', monospace",
      fontFamilySerif: "Georgia, serif",
    },
    animation: {
      duration: {
        fast: 30,
        normal: 60,
        slow: 90,
      },
      easing: "ease-out",
    },
  },

  // 赛博朋克主题
  cyberpunk: {
    id: "cyberpunk",
    name: "赛博朋克",
    colors: {
      primary: "#ff0080",
      secondary: "#00ffff",
      accent: "#ffff00",
      background: "#0a0a0a",
      text: "#ffffff",
      textSecondary: "#ff00ff",
      success: "#00ff00",
      warning: "#ffaa00",
      error: "#ff0000",
      surface: "#1a0a1a",
      surfaceLight: "#2a1a2a",
      shadow: "#000000",
    },
    fonts: {
      heading: "Arial Black, sans-serif",
      body: "Arial, sans-serif",
      mono: "'Courier New', monospace",
    },
    typography: {
      fontFamily: "Arial Black, sans-serif",
      fontFamilyMono: "'Courier New', monospace",
      fontFamilySerif: "Georgia, serif",
    },
    animation: {
      duration: {
        fast: 20,
        normal: 45,
        slow: 75,
      },
      easing: "ease-in-out",
    },
  },

  // 优雅紫主题
  elegant: {
    id: "elegant",
    name: "优雅紫",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#f093fb",
      background: "#1a1a2e",
      text: "#ffffff",
      textSecondary: "#c3cfe2",
      success: "#4ecdc4",
      warning: "#f7b731",
      error: "#eb3b5a",
      surface: "#16213e",
      surfaceLight: "#1e2a47",
      shadow: "#0a0a1a",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
      mono: "'Courier New', monospace",
    },
    typography: {
      fontFamily: "Arial, sans-serif",
      fontFamilyMono: "'Courier New', monospace",
      fontFamilySerif: "Georgia, serif",
    },
    animation: {
      duration: {
        fast: 40,
        normal: 70,
        slow: 100,
      },
      easing: "ease-out",
    },
  },

  // 温暖橙主题
  warm: {
    id: "warm",
    name: "温暖橙",
    colors: {
      primary: "#ff6b6b",
      secondary: "#ffd700",
      accent: "#4ecdc4",
      background: "#2c3e50",
      text: "#ffffff",
      textSecondary: "#ecf0f1",
      success: "#2ecc71",
      warning: "#f39c12",
      error: "#e74c3c",
      surface: "#34495e",
      surfaceLight: "#3d566e",
      shadow: "#1a252f",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
      mono: "'Courier New', monospace",
    },
    typography: {
      fontFamily: "Arial, sans-serif",
      fontFamilyMono: "'Courier New', monospace",
      fontFamilySerif: "Georgia, serif",
    },
    animation: {
      duration: {
        fast: 35,
        normal: 65,
        slow: 95,
      },
      easing: "ease-out",
    },
  },

  // 自然绿主题
  nature: {
    id: "nature",
    name: "自然绿",
    colors: {
      primary: "#00d084",
      secondary: "#26de81",
      accent: "#fed330",
      background: "#0f1419",
      text: "#ffffff",
      textSecondary: "#a5b1c2",
      success: "#26de81",
      warning: "#fed330",
      error: "#fc5c65",
      surface: "#1e272e",
      surfaceLight: "#2d3436",
      shadow: "#000000",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
      mono: "'Courier New', monospace",
    },
    typography: {
      fontFamily: "Arial, sans-serif",
      fontFamilyMono: "'Courier New', monospace",
      fontFamilySerif: "Georgia, serif",
    },
    animation: {
      duration: {
        fast: 30,
        normal: 60,
        slow: 90,
      },
      easing: "ease-out",
    },
  },

  // 极简黑白主题
  minimal: {
    id: "minimal",
    name: "极简黑白",
    colors: {
      primary: "#ffffff",
      secondary: "#e0e0e0",
      accent: "#888888",
      background: "#000000",
      text: "#ffffff",
      textSecondary: "#cccccc",
      success: "#ffffff",
      warning: "#cccccc",
      error: "#888888",
      surface: "#1a1a1a",
      surfaceLight: "#2a2a2a",
      shadow: "#000000",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
      mono: "'Courier New', monospace",
    },
    typography: {
      fontFamily: "Arial, sans-serif",
      fontFamilyMono: "'Courier New', monospace",
      fontFamilySerif: "Georgia, serif",
    },
    animation: {
      duration: {
        fast: 25,
        normal: 50,
        slow: 80,
      },
      easing: "ease-out",
    },
  },

  // 海洋蓝主题
  ocean: {
    id: "ocean",
    name: "海洋蓝",
    colors: {
      primary: "#0abde3",
      secondary: "#48dbfb",
      accent: "#00d2d3",
      background: "#0c2233",
      text: "#ffffff",
      textSecondary: "#b8e6f0",
      success: "#1dd1a1",
      warning: "#feca57",
      error: "#ee5a6f",
      surface: "#10394f",
      surfaceLight: "#145374",
      shadow: "#000000",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
      mono: "'Courier New', monospace",
    },
    typography: {
      fontFamily: "Arial, sans-serif",
      fontFamilyMono: "'Courier New', monospace",
      fontFamilySerif: "Georgia, serif",
    },
    animation: {
      duration: {
        fast: 30,
        normal: 60,
        slow: 90,
      },
      easing: "ease-out",
    },
  },

  // 日落红主题
  sunset: {
    id: "sunset",
    name: "日落红",
    colors: {
      primary: "#ff6348",
      secondary: "#ff7979",
      accent: "#ffa502",
      background: "#2f1e1e",
      text: "#ffffff",
      textSecondary: "#ffcccc",
      success: "#7bed9f",
      warning: "#ffa502",
      error: "#ff4757",
      surface: "#3d2929",
      surfaceLight: "#4d3333",
      shadow: "#1a0f0f",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Arial, sans-serif",
      mono: "'Courier New', monospace",
    },
    typography: {
      fontFamily: "Arial, sans-serif",
      fontFamilyMono: "'Courier New', monospace",
      fontFamilySerif: "Georgia, serif",
    },
    animation: {
      duration: {
        fast: 35,
        normal: 65,
        slow: 95,
      },
      easing: "ease-out",
    },
  },
};

/**
 * 获取主题
 */
export function getTheme(themeId?: string): Theme {
  if (!themeId || !PRESET_THEMES[themeId]) {
    return PRESET_THEMES.tech; // 默认主题
  }
  return PRESET_THEMES[themeId];
}

/**
 * 获取所有可用主题列表
 */
export function getAvailableThemes(): Array<{ id: string; name: string }> {
  return Object.values(PRESET_THEMES).map((theme) => ({
    id: theme.id,
    name: theme.name,
  }));
}
