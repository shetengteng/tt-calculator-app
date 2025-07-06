/**
 * 主题工具类
 * 用于处理主题相关的通用功能
 */

/**
 * 设置 CSS 变量到指定容器
 * @param {Object} vars - 主题变量对象
 * @param {Object} style - 样式对象（可以是 document.documentElement.style 或 page.$el.style）
 */
export const setCSSVariables = (vars, style) => {
  if (!vars || !style || Object.keys(vars).length === 0) {
    return
  }

  // 应用主题变量
  Object.keys(vars).forEach(key => {
    const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    style.setProperty(cssVar, vars[key])
  })

  // 应用设置相关的变量
  if (vars.settingsBackground) {
    const settingsVars = {
      '--settings-background': vars.settingsBackground,
      '--settings-card-background': vars.settingsCardBackground,
      '--settings-text-primary': vars.settingsTextPrimary,
      '--settings-text-secondary': vars.settingsTextSecondary,
      '--settings-primary-color': vars.settingsPrimaryColor,
      '--settings-danger-color': vars.settingsDangerColor,
      '--settings-separator': vars.settingsSeparator,
      '--settings-toggle-active': vars.settingsToggleActive,
      '--settings-toggle-inactive': vars.settingsToggleInactive
    }

    Object.keys(settingsVars).forEach(key => {
      style.setProperty(key, settingsVars[key])
    })
  }
}

/**
 * 延迟执行函数，用于等待初始化完成
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {number} maxRetries - 最大重试次数
 */
export const deferExecution = (fn, delay = 100, maxRetries = 10) => {
  let retries = 0
  
  const execute = () => {
    if (retries >= maxRetries) {
      console.warn('Max retries reached for deferred execution')
      return
    }
    
    try {
      fn()
    } catch (error) {
      retries++
      setTimeout(execute, delay)
    }
  }
  
  setTimeout(execute, delay)
}

/**
 * 安全执行函数，包含错误处理
 * @param {Function} fn - 要执行的函数
 * @param {string} errorMessage - 错误信息前缀
 * @param {boolean} throwError - 是否抛出错误
 */
export const safeExecute = (fn, errorMessage = 'Operation failed', throwError = false) => {
  try {
    return fn()
  } catch (error) {
    console.warn(`${errorMessage}:`, error)
    if (throwError) {
      throw error
    }
    return null
  }
}

/**
 * 检查主题是否已初始化
 * @param {Object} themes - 主题对象
 * @returns {boolean} 是否已初始化
 */
export const isThemesInitialized = (themes) => {
  return themes && typeof themes === 'object' && Object.keys(themes).length > 0
}

/**
 * 验证主题值是否有效
 * @param {string} theme - 主题值
 * @param {Object} themes - 可用主题对象
 * @returns {boolean} 是否有效
 */
export const isValidTheme = (theme, themes) => {
  return isThemesInitialized(themes) && Object.values(themes).includes(theme)
}

/**
 * 获取默认主题
 * @returns {Object} 默认主题配置
 */
export const getDefaultThemes = () => ({
  LIGHT: 'Light',
  DARK: 'Dark',
  AUTO: 'Auto'
})

/**
 * 格式化主题 ID 为常量名称
 * @param {string} themeId - 主题 ID
 * @returns {string} 常量名称
 */
export const formatThemeConstant = (themeId) => {
  return themeId.toUpperCase().replace(/-/g, '_')
}

/**
 * 格式化主题 ID 为显示值
 * @param {string} themeId - 主题 ID
 * @returns {string} 显示值
 */
export const formatThemeValue = (themeId) => {
  return themeId.charAt(0).toUpperCase() + themeId.slice(1)
} 