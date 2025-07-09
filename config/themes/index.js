/**
 * 主题配置索引文件
 * 统一管理所有主题配置
 * 实际样式由 themes.scss 负责，这里只保留元数据
 */
import {PlatformAdapter} from '@/compatibility/index.js'

// 主题基础配置
export const themes = [
  {
    id: "auto",
    name: "自动",
    description: "跟随系统设置自动切换主题",
    scss: "theme-auto"
  },
  {
    id: "light",
    name: "浅色",
    description: "经典浅色主题，适合日间使用",
    scss: "theme-light"
  },
  {
    id: "dark",
    name: "深色",
    description: "护眼深色主题，适合夜间使用",
    scss: "theme-dark"
  },
  {
    id: "minimal-black",
    name: "简约黑",
    description: "极简纯黑主题，优雅深邃",
    scss: "theme-minimal-black"
  },
  {
    id: "minimal-white",
    name: "简约白",
    description: "极简纯白主题，清爽简洁",
    scss: "theme-minimal-white"
  }
];

/**
 * 获取主题配置
 * @param {string} themeId - 主题ID
 * @returns {object} 主题配置对象
 */
export const getTheme = (themeId) => {
  // 处理auto主题逻辑：根据系统主题返回dark或light
  if (themeId === 'auto') {
    themeId = PlatformAdapter.system.getSystemTheme()
  }
  return themes.find(t => t.id === themeId)
}