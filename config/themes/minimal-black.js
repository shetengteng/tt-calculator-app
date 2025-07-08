/**
 * 极简黑色主题配置
 * 注意：具体的颜色样式现在定义在 themes.scss 中的 .theme-minimal-black 类
 */
export const theme = {
  id: "minimal-black",
  name: "简约黑",
  nameEn: "Minimal Black",
  description: "极简纯黑主题，优雅深邃",
  descriptionEn: "Minimalist pure black theme, elegant and deep",
  version: "2.0.0",
  author: "Calculator Team",
  preview: {
    primaryColor: "#FFFFFF",
    backgroundColor: "#000000"
  },
  metadata: {
    category: "custom",
    tags: ["black", "minimal", "dark", "elegant"],
    recommended: true,
    accessibility: {
      highContrast: true,
      colorBlindFriendly: true
    },
    themeClass: "theme-minimal-black"
  },
  // 颜色样式现在由 themes.scss 中的 .theme-minimal-black 类定义
  // 这里保留一些关键颜色信息用于预览和兼容性
  colors: {
    primaryBackground: "#000000",
    textPrimary: "#FFFFFF",
    accentColor: "#FFFFFF"
  }
};

export default theme; 