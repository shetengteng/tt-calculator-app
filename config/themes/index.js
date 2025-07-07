// 导入所有主题
import lightTheme from './light.js';
import darkTheme from './dark.js';
import autoTheme from './auto.js';
import minimalWhiteTheme from './minimal-white.js';
import minimalBlackTheme from './minimal-black.js';

/**
 * 主题配置索引文件
 * 统一管理所有主题配置
 */
export const themeConfig = {
  version: "1.0.0",
  defaultTheme: darkTheme,
  themes: [
    lightTheme,
    darkTheme,
    autoTheme,
    minimalWhiteTheme,
    minimalBlackTheme
  ]
};

/**
 * 获取主题配置
 * @param {string} themeId - 主题ID
 * @returns {object} 主题配置对象
 */
export const getTheme = (themeId) => {
  const theme = themeConfig.themes.find(t => t.id === themeId);
  return theme || themeConfig.defaultTheme;
};


// 为了兼容性，将 themeConfig 作为主要导出
export default themeConfig; 