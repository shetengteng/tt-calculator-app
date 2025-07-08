/**
 * 浅色主题配置
 * 注意：具体的颜色样式现在定义在 themes.scss 中的 .theme-light 类
 */
export const theme = {
  id: "light",
  name: "浅色",
  nameEn: "Light",
  description: "经典浅色主题，适合日间使用",
  descriptionEn: "Classic light theme for daytime use",
  version: "2.0.0",
  author: "Calculator Team",
  preview: {
    primaryColor: "#007AFF",
    backgroundColor: "#FFFFFF"
  },
  metadata: {
    category: "system",
    tags: ["light", "day", "bright"],
    recommended: true,
    accessibility: {
      highContrast: false,
      colorBlindFriendly: true
    },
    themeClass: "theme-light"
  },
  // 颜色样式现在由 themes.scss 中的 .theme-light 类定义
  // 这里保留一些关键颜色信息用于预览和兼容性
  colors: {
    primaryBackground: "#FFFFFF",
    textPrimary: "#000000",
    accentColor: "#007AFF"
  }
};

export default theme; 