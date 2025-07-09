/**
 * 主题配置索引文件
 * 统一管理所有主题配置
 * 实际样式由 themes.scss 负责，这里只保留元数据
 */

// 主题基础配置
export const themes = [
  {
    id: "auto",
    scss: "theme-auto",
    class: "theme-auto",
    colors: {
      settingsTextSecondary: "#cccccc",
      primaryBackground: (() => {
        const lightBackground = "#FFFFFF"
        const darkBackground = "#1a1a1a"
        return `linear-gradient(135deg, ${lightBackground} 0%, ${lightBackground} 50%, ${darkBackground} 50%, ${darkBackground} 100%)`
      })(),
      secondaryBackground: "#F2F2F7",
      textPrimary: "#000000",
      buttonDark: "#E5E5EA",
      buttonDarkText: "#000000",
      buttonBlue: "#007AFF",
      buttonBlueText: "#FFFFFF",
      border: "#C6C6C8"
    }
  },
  {
    id: "light",
    scss: "theme-light",
    class: "theme-light",
    colors: {
      settingsTextSecondary: "#666666",
      primaryBackground: "#FFFFFF",
      secondaryBackground: "#F2F2F7",
      textPrimary: "#000000",
      buttonDark: "#E5E5EA",
      buttonDarkText: "#000000",
      buttonBlue: "#007AFF",
      buttonBlueText: "#FFFFFF",
      border: "#C6C6C8"
    }
  },
  {
    id: "dark",
    scss: "theme-dark",
    class: "theme-dark",
    colors: {
      settingsTextSecondary: "#cccccc",
      primaryBackground: "#1a1a1a",
      secondaryBackground: "#1a1a1a",
      textPrimary: "#ffffff",
      buttonDark: "#505050",
      buttonDarkText: "#ffffff",
      buttonBlue: "#ff9500",
      buttonBlueText: "#ffffff",
      border: "#444444"
    }
  },
  {
    id: "minimal-black",
    scss: "theme-minimal-black",
    class: "theme-minimal-black",
    colors: {
      settingsTextSecondary: "#999999",
      primaryBackground: "#000000",
      secondaryBackground: "#000000",
      textPrimary: "#ffffff",
      buttonDark: "#000000",
      buttonDarkText: "#ffffff",
      buttonBlue: "#007AFF",
      buttonBlueText: "#ffffff",
      border: "#0F0F0F"
    }
  },
  {
    id: "minimal-white",
    scss: "theme-minimal-white",
    class: "theme-minimal-white",
    colors: {
      settingsTextSecondary: "#666666",
      primaryBackground: "#ffffff",
      secondaryBackground: "#ffffff",
      textPrimary: "#000000",
      buttonDark: "#ffffff",
      buttonDarkText: "#000000",
      buttonBlue: "#007AFF",
      buttonBlueText: "#000000",
      border: "#F0F0F0"
    }
  }
]