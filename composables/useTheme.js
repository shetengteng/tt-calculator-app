import { ref, computed, watch, onMounted } from 'vue'
import { themeConfig, getTheme } from '@/config/themes/index.js'
import { PlatformAdapter } from '@/compatibility/index.js'

// 动态主题类型（将从配置文件加载）
export const THEMES = ref({})

// 当前主题状态
const currentTheme = ref('Dark')
const systemTheme = ref('Dark')

// 主题配置缓存
const themeConfigs = ref({})
const themeIndex = ref(null)


// 加载主题索引（直接使用导入的配置）
const loadThemeIndex = () => {
  // 如果已经加载过，直接返回缓存的结果
  if (themeIndex.value) {
    return themeIndex.value
  }
  
  // 直接使用导入的主题配置
  themeIndex.value = themeConfig
  console.log('Theme index loaded from direct import:', themeConfig)
  return themeConfig
}

// 加载单个主题配置（直接从主题配置获取）
const loadSingleThemeConfig = (themeId) => {
  // 如果已缓存，直接返回
  if (themeConfigs.value[themeId]) {
    return themeConfigs.value[themeId]
  }
  
  // 直接从主题配置获取
  const config = getTheme(themeId)
  if (!config) {
    throw new Error(`Theme config not found for ${themeId}`)
  }
  
  // 验证配置文件格式（auto主题的colors可以为null）
  if (!config.colors && themeId !== 'auto') {
    throw new Error(`Invalid theme config: missing colors for ${themeId}`)
  }
  
  // 缓存配置
  themeConfigs.value[themeId] = config
  console.log(`Theme config loaded from direct import: ${themeId}`)
  return config
}

// 统一的主题系统初始化函数
const initializeThemeSystem = () => {
  // 清除缓存
  themeConfigs.value = {}
  themeIndex.value = null
  THEMES.value = {}
  console.log('Theme cache cleared, reinitializing...')
  
  // 加载主题索引
  const index = loadThemeIndex()
  const themeList = index.themes || []
  
  // 初始化主题常量和配置
  const themes = {}
  const availableThemes = []
  
  for (const theme of themeList) {
    const config = loadSingleThemeConfig(theme.id)
    if (config) {
      // 将主题ID转换为常量名称格式
      const constantName = theme.id.toUpperCase().replace(/-/g, '_')
      const themeValue = theme.id.charAt(0).toUpperCase() + theme.id.slice(1)
      themes[constantName] = themeValue
      availableThemes.push(config)
    }
  }
  
  THEMES.value = themes
  console.log('Theme system initialized:', THEMES.value)
  
  return {
    themes: THEMES.value,
    availableThemes,
    index
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
        console.warn('Theme vars is empty, skipping theme application')
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
      setTimeout(() => setTheme(theme), 100)
      return
    }
    
    if (!Object.values(THEMES.value).includes(theme)) {
      console.warn('Invalid theme:', theme)
      return
    }
    
    currentTheme.value = theme
    PlatformAdapter.storage.setSync('app-theme', theme)
    applyTheme()
  }
  
  // 从本地存储加载主题
  const loadTheme = () => {
    const savedTheme = PlatformAdapter.storage.getSync('app-theme')
    if (!savedTheme) return
    
    // 确保THEMES已初始化
    if (!THEMES.value || Object.keys(THEMES.value).length === 0) {
      console.warn('THEMES not initialized yet, deferring theme loading')
      setTimeout(() => loadTheme(), 100)
      return
    }
    
    if (Object.values(THEMES.value).includes(savedTheme)) {
      currentTheme.value = savedTheme
    }
  }
  
  // 获取主题选项
  const getThemeOptions = () => {
    const { themes } = initializeThemeSystem()
    return Object.values(themes)
  }
  
  // 获取当前主题索引（用于picker组件）
  const getCurrentThemeIndex = () => {
    if (!THEMES.value || Object.keys(THEMES.value).length === 0) return 0
    return Object.values(THEMES.value).indexOf(currentTheme.value)
  }
  
  // 监听系统主题变化
  const watchSystemTheme = () => {
    try {
      PlatformAdapter.system.watchSystemTheme((res) => {
        systemTheme.value = res.theme === 'dark' ? 'Dark' : 'Light'
        if (currentTheme.value === 'Auto') applyTheme()
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
  onMounted(() => {
    // 初始化主题系统
    initializeThemeSystem()
    detectSystemTheme()
    loadTheme()
    watchSystemTheme()
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

    initializeThemeSystem,
    
    // 常量
    THEMES
  }
} 