import { ref, computed, watch, onMounted } from 'vue'
import { loadThemeConfig } from '@/utils/request.js'
import { PlatformAdapter } from '@/compatibility/index.js'

// 动态主题类型（将从配置文件加载）
export const THEMES = ref({})

// 当前主题状态
const currentTheme = ref('Dark')
const systemTheme = ref('Dark')

// 主题配置缓存
const themeConfigs = ref({})
const themeIndex = ref(null)

// 主题初始化状态
const isThemeInitialized = ref(false)
const isThemeInitializing = ref(false)

// 加载主题索引（只加载一次，缓存结果）
const loadThemeIndex = async () => {
  try {
    // 如果已经加载过，直接返回缓存的结果
    if (themeIndex.value) {
      return themeIndex.value
    }
    
    // 从新的配置系统加载
    const configModule = await loadThemeConfig()
    const data = configModule.themeConfig || configModule.default || configModule
    themeIndex.value = data
    console.log('Theme index loaded from config system')
    return data
  } catch (error) {
    console.error('Failed to load theme index:', error)
    throw new Error('Theme index file is missing or corrupted')
  }
}

// 加载单个主题配置
const loadSingleThemeConfig = async (themeId) => {
  try {
    // 如果已缓存，直接返回
    if (themeConfigs.value[themeId]) {
      return themeConfigs.value[themeId]
    }
    
    // 从新的配置系统加载
    const configModule = await loadThemeConfig(themeId)
    const config = configModule.theme || configModule.default || configModule
    
    // 验证配置文件格式（auto主题的colors可以为null）
    if (!config.colors && themeId !== 'auto') {
      throw new Error(`Invalid theme config: missing colors for ${themeId}`)
    }
    
    // 缓存配置
    themeConfigs.value[themeId] = config
    console.log(`Theme config loaded from config system: ${themeId}`)
    return config
  } catch (error) {
    console.error(`Failed to load theme config for ${themeId}:`, error)
    throw new Error(`Theme config file ${themeId}.json is missing or corrupted`)
  }
}

// 统一的主题系统初始化函数（每次都清空缓存重新加载）
const initializeThemeSystem = async () => {
  try {
    // 标记开始初始化
    isThemeInitializing.value = true
    isThemeInitialized.value = false
    
    // 清除缓存
    themeConfigs.value = {}
    themeIndex.value = null
    THEMES.value = {}
    console.log('Theme cache cleared, reinitializing...')
    
    // 加载主题索引
    const index = await loadThemeIndex()
    if (!index) {
      throw new Error('Theme index not found')
    }
    
    // 初始化主题常量和配置
    const themes = {}
    const availableThemes = []
    
    for (const theme of index.themes) {
      if (theme.enabled) {
        const config = await loadSingleThemeConfig(theme.id)
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
    console.log('Theme system initialized:', THEMES.value)
    
    // 标记初始化完成
    isThemeInitialized.value = true
    isThemeInitializing.value = false
    
    return {
      themes: THEMES.value,
      availableThemes,
      index
    }
  } catch (error) {
    console.error('Failed to refresh theme cache:', error)
    // 如果加载失败，使用默认主题
    THEMES.value = {
      LIGHT: 'Light',
      DARK: 'Dark',
      AUTO: 'Auto'
    }
    
    // 标记初始化完成（即使失败也要标记）
    isThemeInitialized.value = true
    isThemeInitializing.value = false
    
    return {
      themes: THEMES.value,
      availableThemes: [],
      index: null
    }
  }
}

// 获取所有可用主题
const getAvailableThemes = async () => {
  try {
    const { availableThemes } = await initializeThemeSystem()
    return availableThemes
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
      // 只在完全初始化后才显示警告，避免启动时的误报
      if (isThemeInitialized.value && !isThemeInitializing.value) {
        console.warn(`System theme configuration not yet loaded for ${fallbackThemeId}, waiting for initialization...`)
      }
      
      // 返回空对象，等待配置加载完成后再应用主题
      return {}
    }
    
    // 从配置文件中获取普通主题
    if (themeConfigs.value[themeId] && themeConfigs.value[themeId].colors) {
      return themeConfigs.value[themeId].colors
    }
    
    // 如果配置文件还没有加载，等待配置加载完成
    // 只在完全初始化后才显示警告，避免启动时的误报
    if (isThemeInitialized.value && !isThemeInitializing.value) {
      console.warn(`Theme configuration not yet loaded for ${themeId}, waiting for initialization...`)
    }
    
    // 返回空对象，等待配置加载完成后再应用主题
    return {}
  })
  
  // 检测系统主题
  const detectSystemTheme = () => {
    try {
      // 使用系统适配器检测系统主题
      const theme = PlatformAdapter.system.getSystemTheme()
      systemTheme.value = theme === 'dark' ? 'Dark' : 'Light'
    } catch (error) {
      console.warn('Failed to detect system theme:', error)
      systemTheme.value = 'Dark'
    }
  }
  
  // 应用主题到页面
  const applyTheme = async () => {
    try {
      const vars = themeVars.value
      
      // 如果主题变量为空，跳过应用
      if (!vars || Object.keys(vars).length === 0) {
        // 只在完全初始化后才显示警告，避免启动时的误报
        if (isThemeInitialized.value && !isThemeInitializing.value) {
          console.warn('Theme vars is empty, skipping theme application')
        }
        return
      }
      
      // 使用DOM适配器设置主题变量
      if (PlatformAdapter.dom.isDomAvailable()) {
        // 构建主题变量映射
        const themeProperties = {}
        Object.keys(vars).forEach(key => {
          const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
          themeProperties[cssVar] = vars[key]
        })
        
        // 应用设置相关的变量
        if (vars.settingsBackground) {
          themeProperties['--settings-background'] = vars.settingsBackground
          themeProperties['--settings-card-background'] = vars.settingsCardBackground
          themeProperties['--settings-text-primary'] = vars.settingsTextPrimary
          themeProperties['--settings-text-secondary'] = vars.settingsTextSecondary
          themeProperties['--settings-primary-color'] = vars.settingsPrimaryColor
          themeProperties['--settings-danger-color'] = vars.settingsDangerColor
          themeProperties['--settings-separator'] = vars.settingsSeparator
          themeProperties['--settings-toggle-active'] = vars.settingsToggleActive
          themeProperties['--settings-toggle-inactive'] = vars.settingsToggleInactive
        }
        
        // 批量设置CSS自定义属性
        PlatformAdapter.dom.setCustomProperties(themeProperties)
        
        // 设置主题数据属性
        const rootElement = PlatformAdapter.dom.getRootElement()
        if (rootElement) {
          PlatformAdapter.dom.setAttribute(rootElement, 'data-theme', activeTheme.value.toLowerCase())
        }
        
        // 设置页面背景色
        PlatformAdapter.dom.setPageBackground(vars.primaryBackground, vars.textPrimary)
      }
      
      // 设置导航栏颜色
      await PlatformAdapter.system.setNavigationBarColor({
        frontColor: activeTheme.value === 'Light' ? '#000000' : '#ffffff',
        backgroundColor: vars.primaryBackground,
        animation: {
          duration: 300,
          timingFunc: 'easeInOut'
        }
      })
      
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
    PlatformAdapter.storage.setSync('app-theme', theme)
    
    // 立即应用主题
    applyTheme()
  }
  
  // 从本地存储加载主题
  const loadTheme = () => {
    const savedTheme = PlatformAdapter.storage.getSync('app-theme')
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
      // 使用系统适配器监听主题变化
      PlatformAdapter.system.watchSystemTheme((res) => {
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
    await initializeThemeSystem()
    
    // 立即应用主题
    applyTheme()
    
    // 延迟再次应用主题，确保页面已渲染
    setTimeout(() => {
      applyTheme()
    }, 100)
  })
  
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
    initializeThemeSystem,
    
    // 常量
    THEMES
  }
} 