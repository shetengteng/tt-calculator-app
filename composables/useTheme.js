import { ref, computed, watch, onMounted } from 'vue'

// 动态主题类型（将从配置文件加载）
export const THEMES = ref({})

// 当前主题状态
const currentTheme = ref('Dark')
const systemTheme = ref('Dark')

// 主题配置缓存
const themeConfigs = ref({})
const themeIndex = ref(null)
const themeSystemInitialized = ref(false)

// 加载主题索引（只加载一次，缓存结果）
const loadThemeIndex = async () => {
  try {
    // 如果已经加载过，直接返回缓存的结果
    if (themeIndex.value) {
      return themeIndex.value
    }
    
    const response = await fetch('/static/themes/index.json')
    const data = await response.json()
    themeIndex.value = data
    return data
  } catch (error) {
    console.error('Failed to load theme index:', error)
    throw new Error('Theme index file is missing or corrupted')
  }
}

// 加载单个主题配置
const loadThemeConfig = async (themeId) => {
  try {
    // 如果已缓存，直接返回
    if (themeConfigs.value[themeId]) {
      return themeConfigs.value[themeId]
    }
    
    const response = await fetch(`/static/themes/${themeId}.json`)
    const config = await response.json()
    
    // 验证配置文件格式（auto主题的colors可以为null）
    if (!config.colors && themeId !== 'auto') {
      throw new Error(`Invalid theme config: missing colors for ${themeId}`)
    }
    
    // 缓存配置
    themeConfigs.value[themeId] = config
    return config
  } catch (error) {
    console.error(`Failed to load theme config for ${themeId}:`, error)
    throw new Error(`Theme config file ${themeId}.json is missing or corrupted`)
  }
}

// 统一的主题系统初始化函数（只运行一次）
const initializeThemeSystem = async () => {
  try {
    // 如果已经初始化过，直接返回缓存的结果
    if (themeSystemInitialized.value) {
      const availableThemes = []
      for (const [key, value] of Object.entries(themeConfigs.value)) {
        if (value) {
          availableThemes.push(value)
        }
      }
      return {
        themes: THEMES.value,
        availableThemes,
        index: themeIndex.value
      }
    }
    
    // 加载主题索引（只加载一次）
    const index = await loadThemeIndex()
    if (!index) {
      throw new Error('Theme index not found')
    }
    
    // 初始化主题常量和配置
    const themes = {}
    const availableThemes = []
    
    for (const theme of index.themes) {
      if (theme.enabled) {
        const config = await loadThemeConfig(theme.id)
        if (config) {
          // 将主题ID转换为常量名称格式
          const constantName = theme.id.toUpperCase().replace(/-/g, '_')
          const themeValue = theme.id.charAt(0).toUpperCase() + theme.id.slice(1)
          themes[constantName] = themeValue
          availableThemes.push(config)
        }
      }
    }
    
    // 如果没有加载到任何主题，抛出错误
    if (Object.keys(themes).length === 0) {
      throw new Error('No enabled themes found in configuration')
    }
    
    THEMES.value = themes
    themeSystemInitialized.value = true
    console.log('Initialized theme system:', THEMES.value)
    
    return {
      themes: THEMES.value,
      availableThemes,
      index
    }
  } catch (error) {
    console.error('Failed to initialize theme system:', error)
    // 如果加载失败，使用默认主题
    THEMES.value = {
      LIGHT: 'Light',
      DARK: 'Dark',
      AUTO: 'Auto'
    }
    themeSystemInitialized.value = true
    return {
      themes: THEMES.value,
      availableThemes: [],
      index: null
    }
  }
}

// 重新初始化主题系统（清除缓存）
const reinitializeThemeSystem = async () => {
  try {
    // 清除缓存
    themeSystemInitialized.value = false
    themeIndex.value = null
    themeConfigs.value = {}
    THEMES.value = {}
    
    // 重新初始化
    const result = await initializeThemeSystem()
    console.log('Theme system reinitialized successfully')
    return result
  } catch (error) {
    console.error('Failed to reinitialize theme system:', error)
    throw error
  }
}

// 获取所有可用主题（使用缓存的结果）
const getAvailableThemes = async () => {
  try {
    // 如果还未初始化，先初始化
    if (!themeSystemInitialized.value) {
      const { availableThemes } = await initializeThemeSystem()
      return availableThemes
    }
    
    // 如果已经初始化，从缓存中获取
    const themes = []
    for (const [key, value] of Object.entries(themeConfigs.value)) {
      if (value) {
        themes.push(value)
      }
    }
    return themes
  } catch (error) {
    console.error('Failed to get available themes:', error)
    return []
  }
}

export function useTheme() {
  // 计算当前激活的主题
  const activeTheme = computed(() => {
    if (currentTheme.value === 'Auto') {
      return systemTheme.value
    }
    return currentTheme.value
  })
  
  // 计算当前主题变量
  const themeVars = computed(() => {
    // 确保activeTheme.value存在
    if (!activeTheme.value) {
      console.warn('Active theme is undefined, returning empty theme vars')
      return {}
    }
    
    const themeId = activeTheme.value.toLowerCase()
    
    // 如果是自动主题，使用对应的系统主题配置
    if (activeTheme.value === 'Auto') {
      if (!systemTheme.value) {
        console.warn('System theme is undefined, returning empty theme vars')
        return {}
      }
      
      const fallbackThemeId = systemTheme.value.toLowerCase()
      if (themeConfigs.value[fallbackThemeId] && themeConfigs.value[fallbackThemeId].colors) {
        return themeConfigs.value[fallbackThemeId].colors
      }
      // 如果系统主题配置还没有加载，等待配置加载完成
      console.warn(`System theme configuration not yet loaded for ${fallbackThemeId}, waiting for initialization...`)
      
      // 返回空对象，等待配置加载完成后再应用主题
      return {}
    }
    
    // 从配置文件中获取普通主题
    if (themeConfigs.value[themeId] && themeConfigs.value[themeId].colors) {
      return themeConfigs.value[themeId].colors
    }
    
    // 如果配置文件还没有加载，等待配置加载完成
    console.warn(`Theme configuration not yet loaded for ${themeId}, waiting for initialization...`)
    
    // 返回空对象，等待配置加载完成后再应用主题
    return {}
  })
  
  // 检测系统主题
  const detectSystemTheme = () => {
    try {
      // 在微信小程序中检测系统主题
      const systemInfo = uni.getSystemInfoSync()
      
      // 检查系统主题设置
      if (systemInfo.theme) {
        systemTheme.value = systemInfo.theme === 'dark' ? 'Dark' : 'Light'
      } else {
        // 如果无法检测，根据时间判断（简单的fallback）
        const hour = new Date().getHours()
        systemTheme.value = (hour >= 18 || hour <= 6) ? 'Dark' : 'Light'
      }
    } catch (error) {
      console.warn('Failed to detect system theme:', error)
      systemTheme.value = 'Dark'
    }
  }
  
  // 应用主题到页面
  const applyTheme = () => {
    try {
      const vars = themeVars.value
      
      // 如果主题变量为空，跳过应用
      if (!vars || Object.keys(vars).length === 0) {
        console.warn('Theme vars is empty, skipping theme application')
        return
      }
      
      // 在H5环境中设置CSS自定义属性到document root
      if (typeof document !== 'undefined') {
        const root = document.documentElement
        
        // 应用主题变量
        Object.keys(vars).forEach(key => {
          const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
          root.style.setProperty(cssVar, vars[key])
        })
        
        // 应用设置相关的变量
        if (vars.settingsBackground) {
          root.style.setProperty('--settings-background', vars.settingsBackground)
          root.style.setProperty('--settings-card-background', vars.settingsCardBackground)
          root.style.setProperty('--settings-text-primary', vars.settingsTextPrimary)
          root.style.setProperty('--settings-text-secondary', vars.settingsTextSecondary)
          root.style.setProperty('--settings-primary-color', vars.settingsPrimaryColor)
          root.style.setProperty('--settings-danger-color', vars.settingsDangerColor)
          root.style.setProperty('--settings-separator', vars.settingsSeparator)
          root.style.setProperty('--settings-toggle-active', vars.settingsToggleActive)
          root.style.setProperty('--settings-toggle-inactive', vars.settingsToggleInactive)
        }
        
        // 设置主题数据属性用于CSS选择器
        root.setAttribute('data-theme', activeTheme.value.toLowerCase())
        
        // 强制设置body背景色
        if (document.body) {
          document.body.style.backgroundColor = vars.primaryBackground
          document.body.style.color = vars.textPrimary
        }
      }
      
      // 在小程序环境中设置页面样式
      try {
        const pages = getCurrentPages()
        if (pages.length > 0) {
          const page = pages[pages.length - 1]
          if (page && page.$el) {
            const style = page.$el.style
            
            // 应用主题变量
            Object.keys(vars).forEach(key => {
              const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
              style.setProperty(cssVar, vars[key])
            })
            
            // 应用设置相关的变量
            if (vars.settingsBackground) {
              style.setProperty('--settings-background', vars.settingsBackground)
              style.setProperty('--settings-card-background', vars.settingsCardBackground)
              style.setProperty('--settings-text-primary', vars.settingsTextPrimary)
              style.setProperty('--settings-text-secondary', vars.settingsTextSecondary)
              style.setProperty('--settings-primary-color', vars.settingsPrimaryColor)
              style.setProperty('--settings-danger-color', vars.settingsDangerColor)
              style.setProperty('--settings-separator', vars.settingsSeparator)
              style.setProperty('--settings-toggle-active', vars.settingsToggleActive)
              style.setProperty('--settings-toggle-inactive', vars.settingsToggleInactive)
            }
            
            // 设置页面背景色
            style.backgroundColor = vars.primaryBackground
            style.color = vars.textPrimary
          }
        }
      } catch (pageError) {
        console.warn('Failed to set page styles:', pageError)
      }
      
      // 设置导航栏颜色
      try {
        uni.setNavigationBarColor({
          frontColor: activeTheme.value === 'Light' ? '#000000' : '#ffffff',
          backgroundColor: vars.primaryBackground,
          animation: {
            duration: 300,
            timingFunc: 'easeInOut'
          }
        })
      } catch (navError) {
        console.warn('Failed to set navigation bar color:', navError)
      }
      
      console.log('Applied theme:', activeTheme.value, vars)
      
    } catch (error) {
      console.error('Failed to apply theme:', error)
      // 主题应用失败是严重错误，应该让用户知道
      throw error
    }
  }
  
  // 设置主题
  const setTheme = (theme) => {
    // 确保THEMES已初始化
    if (!THEMES.value || Object.keys(THEMES.value).length === 0) {
      console.warn('THEMES not initialized yet, deferring theme setting')
      // 延迟设置主题
      setTimeout(() => setTheme(theme), 100)
      return
    }
    
    if (!Object.values(THEMES.value).includes(theme)) {
      console.warn('Invalid theme:', theme)
      return
    }
    
    currentTheme.value = theme
    
    // 保存到本地存储
    try {
      uni.setStorageSync('app-theme', theme)
    } catch (error) {
      console.warn('Failed to save theme:', error)
    }
    
    // 立即应用主题
    applyTheme()
  }
  
  // 从本地存储加载主题
  const loadTheme = () => {
    try {
      const savedTheme = uni.getStorageSync('app-theme')
      if (savedTheme) {
        // 确保THEMES已初始化
        if (!THEMES.value || Object.keys(THEMES.value).length === 0) {
          console.warn('THEMES not initialized yet, deferring theme loading')
          // 延迟加载主题
          setTimeout(() => loadTheme(), 100)
          return
        }
        
        if (Object.values(THEMES.value).includes(savedTheme)) {
          currentTheme.value = savedTheme
        }
      }
    } catch (error) {
      console.warn('Failed to load theme:', error)
    }
  }
  
  // 获取主题选项
  const getThemeOptions = async () => {
    try {
      const { themes } = await initializeThemeSystem()
      return Object.values(themes)
    } catch (error) {
      console.error('Failed to get theme options:', error)
      return Object.values(THEMES.value)
    }
  }
  
  // 获取当前主题索引（用于picker组件）
  const getCurrentThemeIndex = () => {
    if (!THEMES.value || Object.keys(THEMES.value).length === 0) {
      return 0
    }
    return Object.values(THEMES.value).indexOf(currentTheme.value)
  }
  
  // 监听系统主题变化
  const watchSystemTheme = () => {
    try {
      // 监听系统主题变化
      uni.onThemeChange && uni.onThemeChange((res) => {
        systemTheme.value = res.theme === 'dark' ? 'Dark' : 'Light'
        if (currentTheme.value === 'Auto') {
          applyTheme()
        }
      })
    } catch (error) {
      console.warn('Failed to watch system theme:', error)
    }
  }
  
  // 监听主题变化
  watch(activeTheme, () => {
    applyTheme()
  }, { immediate: false })

  // 监听主题配置加载完成
  watch(themeConfigs, () => {
    // 当主题配置加载完成后，重新应用主题
    applyTheme()
  }, { deep: true })
  
  // 初始化
  onMounted(async () => {
    detectSystemTheme()
    loadTheme()
    watchSystemTheme()
    
    // 初始化主题配置
    await initializeThemes()
    
    // 立即应用主题
    applyTheme()
    
    // 延迟再次应用主题，确保页面已渲染
    setTimeout(() => {
      applyTheme()
    }, 100)
  })
  
  // 初始化主题配置
  const initializeThemes = async () => {
    try {
      // 使用统一的主题系统初始化函数
      await initializeThemeSystem()
    } catch (error) {
      console.error('Failed to initialize themes:', error)
      throw error
    }
  }

  // 立即初始化主题（在模块加载时就开始）
  const immediateInit = async () => {
    try {
      // 先检测系统主题和加载保存的主题
      detectSystemTheme()
      loadTheme()
      
      // 初始化主题配置 - 确保配置完全加载后再应用主题
      await initializeThemes()
      
      // 等待所有主题配置加载完成后再应用主题
      if (Object.keys(themeConfigs.value).length > 0) {
        applyTheme()
      } else {
        console.warn('Theme configurations not loaded, retrying...')
        // 重试加载
        setTimeout(async () => {
          await initializeThemes()
          applyTheme()
        }, 500)
      }
    } catch (error) {
      console.error('Failed to initialize themes:', error)
      // 主题初始化失败时，使用基本的错误处理而不是硬编码默认值
      throw new Error('Theme system initialization failed. Please check theme configuration files.')
    }
  }
  
  // 立即执行初始化
  immediateInit()

  return {
    // 状态
    currentTheme: computed(() => currentTheme.value),
    activeTheme,
    themeVars,
    systemTheme: computed(() => systemTheme.value),
    themeConfigs: computed(() => themeConfigs.value),
    
    // 方法
    setTheme,
    getThemeOptions,
    getCurrentThemeIndex,
    applyTheme,
    loadThemeConfig,
    getAvailableThemes,
    initializeThemes,
    reinitializeThemeSystem,
    
    // 常量
    THEMES
  }
} 