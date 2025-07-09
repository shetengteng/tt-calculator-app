import {ref} from 'vue'
import {themes} from '@/config/themes'
import {PlatformAdapter} from '@/compatibility/index.js'

const currentThemeId = ref('auto')

const initTheme = ()=>{
  currentThemeId.value = PlatformAdapter.storage.getSync('app-theme', 'auto')
  applyTheme()
}

const applyTheme = ()=>{
  const rootElement = PlatformAdapter.dom.getRootElement()
  // 移除所有主题类
  themes.forEach(theme => {
    PlatformAdapter.dom.removeClass(rootElement, theme.class)
  })
  // 添加当前主题类
  PlatformAdapter.dom.addClass(rootElement, getPracticalTheme(currentThemeId.value).class)
  // 设置主题数据属性 - 使用原始主题ID用于识别
  PlatformAdapter.dom.setAttribute(rootElement, 'data-theme', getCurrentTheme().id)
  // 设置页面背景色 - 使用 CSS 变量
  // const backgroundColor = getThemeVariable(
  //     vars.themeId,
  //     '--theme-primary-background'
  // );
  //
  // const textColor = getThemeVariable(
  //     vars.themeId,
  //     '--theme-text-primary'
  // );

  PlatformAdapter.dom.setPageBackground('red', 'black');
}

/**
 * 获取主题配置
 * @param {string} themeId - 主题ID
 * @returns {object} 主题配置对象
 */
const getThemeColor = (themeId) => {
  return getPracticalTheme(themeId)?.color
}

const getCurrentPracticalTheme = () => {
  return getPracticalTheme(currentThemeId.value)
}

const getCurrentPracticalThemeClass = () => {
  return getCurrentPracticalTheme()?.class
}

const getPracticalTheme = (themeId) => {
  if (themeId === 'auto') {
    themeId = PlatformAdapter.system.getSystemTheme()
  }
  return themes.find(t => t.id === themeId)
}

const getCurrentTheme = ()=>{
  return themes.find(t => t.id === currentThemeId.value)
}

const setTheme = (themeId) =>{
  currentThemeId.value = themeId
  PlatformAdapter.storage.setSync('app-theme', themeId)
  applyTheme()
}

export function useTheme() {
  return {
    initTheme,
    setTheme,
    getThemeColor,
    getCurrentTheme,
    getCurrentPracticalTheme,
    getCurrentPracticalThemeClass,

    themes,
    currentThemeId
  }
}