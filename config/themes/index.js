/**
 * 主题配置索引文件
 * 统一管理所有主题配置
 */
export const themeConfig = {
  version: "1.0.0",
  defaultTheme: "dark",
  themes: [
    {
      id: "light",
      file: "light.js",
      enabled: true
    },
    {
      id: "dark", 
      file: "dark.js",
      enabled: true
    },
    {
      id: "auto",
      file: "auto.js", 
      enabled: true
    },
    {
      id: "minimal-white",
      file: "minimal-white.js",
      enabled: true
    },
    {
      id: "minimal-black",
      file: "minimal-black.js",
      enabled: true
    }
  ],
  categories: [
    {
      id: "system",
      name: "系统主题",
      nameEn: "System Themes",
      description: "内置系统主题"
    },
    {
      id: "custom",
      name: "自定义主题",
      nameEn: "Custom Themes",
      description: "用户自定义主题"
    }
  ]
};

// 导入所有主题
import lightTheme from './light.js';
import darkTheme from './dark.js';
import autoTheme from './auto.js';
import minimalWhiteTheme from './minimal-white.js';
import minimalBlackTheme from './minimal-black.js';

// 主题映射
export const themeMap = {
  light: lightTheme,
  dark: darkTheme,
  auto: autoTheme,
  'minimal-white': minimalWhiteTheme,
  'minimal-black': minimalBlackTheme
};

/**
 * 获取主题配置
 * @param {string} themeId - 主题ID
 * @returns {object} 主题配置对象
 */
export const getTheme = (themeId) => {
  return themeMap[themeId] || themeMap[themeConfig.defaultTheme];
};

/**
 * 获取所有可用主题
 * @returns {Array} 主题列表
 */
export const getAvailableThemes = () => {
  return themeConfig.themes.filter(theme => theme.enabled).map(theme => ({
    ...theme,
    ...themeMap[theme.id]
  }));
};

/**
 * 根据分类获取主题
 * @param {string} category - 分类ID
 * @returns {Array} 主题列表
 */
export const getThemesByCategory = (category) => {
  return getAvailableThemes().filter(theme => theme.metadata?.category === category);
};

export default {
  themeConfig,
  themeMap,
  getTheme,
  getAvailableThemes,
  getThemesByCategory
}; 