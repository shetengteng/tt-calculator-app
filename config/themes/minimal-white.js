/**
 * 极简白色主题配置
 * 注意：具体的颜色样式现在定义在 themes.scss 中的 .theme-minimal-white 类
 */
export const theme = {
  id: "minimal-white",
  name: "简约白",
  nameEn: "Minimal White",
  description: "极简纯白主题，清爽简洁",
  descriptionEn: "Minimalist pure white theme, clean and simple",
  version: "2.0.0",
  author: "Calculator Team",
  preview: {
    primaryColor: "#000000",
    backgroundColor: "#FFFFFF"
  },
  metadata: {
    category: "custom",
    tags: ["white", "minimal", "clean", "simple"],
    recommended: true,
    accessibility: {
      highContrast: true,
      colorBlindFriendly: true
    },
    themeClass: "theme-minimal-white"
  },
  // 颜色样式现在由 themes.scss 中的 .theme-minimal-white 类定义
  // 这里保留一些关键颜色信息用于预览和兼容性
  colors: {
    primaryBackground: "#FFFFFF",
    textPrimary: "#000000",
    accentColor: "#000000"
  }
};

export default theme; 