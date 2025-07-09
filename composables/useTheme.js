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
  
  // 主题配置验证（现在不需要colors，由themes.scss负责）
  if (!config.id) {
    throw new Error(`Invalid theme config: missing id for ${themeId}`)
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
  
  // 计算当前主题变量（现在主要用于主题类名）
  const themeVars = computed(() => {
    // 确保activeTheme.value存在
    if (!activeTheme.value) {
      console.warn('Active theme is undefined')
      return {}
    }
    
    const themeId = activeTheme.value.toLowerCase()
    
          // 从主题配置中获取scss类名
      const themeConfig = themeConfigs.value[themeId]
      const themeClass = themeConfig?.scss || `theme-${themeId}`
      
      // 现在主要返回主题类名，实际样式由themes.scss负责
      return {
        themeClass: themeClass,
        themeId: themeId
      }
  })
  
  // 使用 CSS 变量获取颜色，避免硬编码
  const getThemeVariable = (themeId, variable) => {
    // 如果 DOM 可用，尝试从 CSS 变量获取值
    if (PlatformAdapter.dom.isDomAvailable()) {
      try {
        // 创建临时元素并添加主题类
        const tempElement = document.createElement('div');
        tempElement.className = `theme-${themeId}`;
        document.body.appendChild(tempElement);
        
        // 获取计算后的样式
        const style = window.getComputedStyle(tempElement);
        const value = style.getPropertyValue(variable).trim();
        
        // 移除临时元素
        document.body.removeChild(tempElement);
        
        if (value) {
          return value;
        }
        throw new Error(`Theme variable ${variable} not found for theme ${themeId}`);
      } catch (error) {
        console.error(`Failed to get theme variable ${variable}:`, error);
        throw error;
      }
    }
    
    throw new Error(`DOM not available, cannot get theme variable ${variable} for theme ${themeId}`);
  };
  
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
      if (!vars || !vars.themeClass) {
        console.warn('Theme vars is empty, skipping theme application')
        return
      }
      
      // 使用动态类名方案（适用于小程序和H5）
      if (PlatformAdapter.dom.isDomAvailable()) {
        const rootElement = PlatformAdapter.dom.getRootElement()
        if (rootElement) {
          // 移除所有主题类
          const themeClasses = ['theme-dark', 'theme-light', 'theme-auto', 'theme-minimal-black', 'theme-minimal-white']
          themeClasses.forEach(cls => {
            PlatformAdapter.dom.removeClass(rootElement, cls)
          })
          
          // 添加当前主题类
          PlatformAdapter.dom.addClass(rootElement, vars.themeClass)
          
          // 设置主题数据属性
          PlatformAdapter.dom.setAttribute(rootElement, 'data-theme', vars.themeId)
          
          console.log('Applied theme class:', vars.themeClass)
        }
        
        // 设置页面背景色 - 使用 CSS 变量
        const backgroundColor = getThemeVariable(
          vars.themeId, 
          '--theme-primary-background'
        );
        
        const textColor = getThemeVariable(
          vars.themeId, 
          '--theme-text-primary'
        );
        
        PlatformAdapter.dom.setPageBackground(backgroundColor, textColor);
      }
      
      // 设置导航栏颜色 - 使用 CSS 变量
      const navBackgroundColor = getThemeVariable(
        vars.themeId,
        '--theme-primary-background'
      );
      
      const navFrontColor = getThemeVariable(
        vars.themeId,
        '--theme-text-primary'
      );
      
      await PlatformAdapter.system.setNavigationBarColor({
        frontColor: navFrontColor,
        backgroundColor: navBackgroundColor,
        animation: {
          duration: 300,
          timingFunc: 'easeInOut'
        }
      });
      
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