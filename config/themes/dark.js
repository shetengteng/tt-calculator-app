/**
 * 深色主题配置
 * 注意：具体的颜色样式现在定义在 themes.scss 中的 .theme-dark 类
 */
export const theme = {
  id: "dark",
  name: "深色",
  nameEn: "Dark",
  description: "护眼深色主题，适合夜间使用",
  descriptionEn: "Eye-friendly dark theme for nighttime use",
  version: "2.0.0",
  author: "Calculator Team",
  preview: {
    primaryColor: "#ff9500",
    backgroundColor: "#1a1a1a"
  },
  metadata: {
    category: "system",
    tags: ["dark", "night", "eye-friendly"],
    recommended: true,
    accessibility: {
      highContrast: false,
      colorBlindFriendly: true
    },
    themeClass: "theme-dark"
  },
  // 颜色样式现在由 themes.scss 中的 .theme-dark 类定义
  // 这里保留一些关键颜色信息用于预览和兼容性
  colors: {
    primaryBackground: "#1a1a1a",
    textPrimary: "#ffffff",
    accentColor: "#ff9500"
  }
};

export default theme; 