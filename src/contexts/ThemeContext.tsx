import React, { createContext, useContext } from "react";
import { Theme, getTheme } from "../types/theme";

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  themeId?: string;
  children: React.ReactNode;
}

/**
 * 主题提供者组件
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  themeId,
  children,
}) => {
  const theme = getTheme(themeId);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 使用主题的 Hook
 */
export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (!context) {
    // 如果没有 ThemeProvider，返回默认主题
    return getTheme();
  }
  return context.theme;
}
