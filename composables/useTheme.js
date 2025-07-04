import { ref, computed, watch, onMounted } from 'vue'

// 主题类型
export const THEMES = {
  LIGHT: 'Light',
  DARK: 'Dark',
  AUTO: 'Auto'
}

// 当前主题状态
const currentTheme = ref(THEMES.DARK)
const systemTheme = ref(THEMES.DARK)

// 主题变量定义
const themes = {
  [THEMES.LIGHT]: {
    // 主要颜色
    primaryBackground: '#FFFFFF',
    secondaryBackground: '#F2F2F7',
    tertiaryBackground: '#FFFFFF',
    
    // 文字颜色
    textPrimary: '#000000',
    textSecondary: '#FFFFFF',
    textMuted: '#8E8E93',
    
    // 按钮颜色
    buttonBlue: '#007AFF',
    buttonDark: '#E5E5EA',
    buttonLight: '#F2F2F7',
    buttonBlueText: '#FFFFFF',
    buttonDarkText: '#000000',
    buttonLightText: '#000000',
    
    // 其他颜色
    accentBlue: '#007AFF',
    lightGray: '#8E8E93',
    darkGray: '#C7C7CC',
    border: '#C6C6C8',
    separator: '#C6C6C8',
    overlay: 'rgba(0, 0, 0, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    
    // 抽屉颜色
    drawerBackground: '#F2F2F7',
    drawerHeader: '#F2F2F7',
    drawerItemBackground: '#FFFFFF',
    drawerItemHover: '#E5E5EA'
  },
  
  [THEMES.DARK]: {
    // 主要颜色
    primaryBackground: '#2C2C2E',
    secondaryBackground: '#1C1C1E',
    tertiaryBackground: '#2C2C2E',
    
    // 文字颜色
    textPrimary: '#FFFFFF',
    textSecondary: '#000000',
    textMuted: '#8E8E93',
    
    // 按钮颜色
    buttonBlue: '#00A8E6',
    buttonDark: '#505050',
    buttonLight: '#A6A6A6',
    buttonBlueText: '#FFFFFF',
    buttonDarkText: '#FFFFFF',
    buttonLightText: '#000000',
    
    // 其他颜色
    accentBlue: '#00A8E6',
    lightGray: '#A6A6A6',
    darkGray: '#505050',
    border: '#505050',
    separator: '#505050',
    overlay: 'rgba(0, 0, 0, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    
    // 抽屉颜色
    drawerBackground: '#2C2C2E',
    drawerHeader: '#2C2C2E',
    drawerItemBackground: '#3A3A3C',
    drawerItemHover: '#48484A'
  }
}

export function useTheme() {
  // 计算当前激活的主题
  const activeTheme = computed(() => {
    if (currentTheme.value === THEMES.AUTO) {
      return systemTheme.value
    }
    return currentTheme.value
  })
  
  // 计算当前主题变量
  const themeVars = computed(() => {
    return themes[activeTheme.value] || themes[THEMES.DARK]
  })
  
  // 检测系统主题
  const detectSystemTheme = () => {
    try {
      // 在微信小程序中检测系统主题
      const systemInfo = uni.getSystemInfoSync()
      
      // 检查系统主题设置
      if (systemInfo.theme) {
        systemTheme.value = systemInfo.theme === 'dark' ? THEMES.DARK : THEMES.LIGHT
      } else {
        // 如果无法检测，根据时间判断（简单的fallback）
        const hour = new Date().getHours()
        systemTheme.value = (hour >= 18 || hour <= 6) ? THEMES.DARK : THEMES.LIGHT
      }
    } catch (error) {
      console.warn('Failed to detect system theme:', error)
      systemTheme.value = THEMES.DARK
    }
  }
  
  // 应用主题到页面
  const applyTheme = () => {
    const vars = themeVars.value
    
    try {
      // 在H5环境中设置CSS自定义属性到document root
      if (typeof document !== 'undefined') {
        const root = document.documentElement
        
        // 应用主题变量
        Object.keys(vars).forEach(key => {
          const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
          root.style.setProperty(cssVar, vars[key])
        })
        
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
          frontColor: activeTheme.value === THEMES.LIGHT ? '#000000' : '#ffffff',
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
      console.warn('Failed to apply theme:', error)
    }
  }
  
  // 设置主题
  const setTheme = (theme) => {
    if (!Object.values(THEMES).includes(theme)) {
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
      if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
        currentTheme.value = savedTheme
      }
    } catch (error) {
      console.warn('Failed to load theme:', error)
    }
  }
  
  // 获取主题选项
  const getThemeOptions = () => {
    return Object.values(THEMES)
  }
  
  // 获取当前主题索引（用于picker组件）
  const getCurrentThemeIndex = () => {
    return Object.values(THEMES).indexOf(currentTheme.value)
  }
  
  // 监听系统主题变化
  const watchSystemTheme = () => {
    try {
      // 监听系统主题变化
      uni.onThemeChange && uni.onThemeChange((res) => {
        systemTheme.value = res.theme === 'dark' ? THEMES.DARK : THEMES.LIGHT
        if (currentTheme.value === THEMES.AUTO) {
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
  
  // 初始化
  onMounted(() => {
    detectSystemTheme()
    loadTheme()
    watchSystemTheme()
    
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
    
    // 方法
    setTheme,
    getThemeOptions,
    getCurrentThemeIndex,
    applyTheme,
    
    // 常量
    THEMES
  }
} 