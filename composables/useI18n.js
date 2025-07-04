import { ref, computed } from 'vue'

// 支持的语言列表
export const LANGUAGES = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
  JA_JP: 'ja-JP',
  KO_KR: 'ko-KR'
}

// 语言显示名称
export const LANGUAGE_NAMES = {
  [LANGUAGES.ZH_CN]: '简体中文',
  [LANGUAGES.EN_US]: 'English',
  [LANGUAGES.JA_JP]: '日本語',
  [LANGUAGES.KO_KR]: '한국어'
}

// 当前语言状态
const currentLanguage = ref(LANGUAGES.ZH_CN)

// 翻译数据缓存
const translationsCache = ref({})

// 加载语言文件
const loadLanguageFile = async (language) => {
  // 如果已经缓存，直接返回
  if (translationsCache.value[language]) {
    return translationsCache.value[language]
  }
  
  try {
    // 在 uni-app 中使用 uni.request 加载本地JSON文件
    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: `/static/locales/${language}.json`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error(`Failed to load language file: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
    
    // 缓存翻译数据
    translationsCache.value[language] = response
    return response
  } catch (error) {
    console.warn(`Failed to load language file for ${language}:`, error)
    
    // 降级到默认语言
    if (language !== LANGUAGES.ZH_CN) {
      return await loadLanguageFile(LANGUAGES.ZH_CN)
    }
    
    // 如果连默认语言都加载失败，返回空对象
    return {}
  }
}

// 获取嵌套对象的值
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

export function useI18n() {
  // 获取当前语言的翻译数据
  const currentTranslations = computed(() => {
    return translationsCache.value[currentLanguage.value] || {}
  })
  
  // 翻译函数
  const t = (key, params = {}) => {
    const translations = currentTranslations.value
    let text = getNestedValue(translations, key)
    
    // 如果没有找到翻译，尝试使用默认语言
    if (!text && currentLanguage.value !== LANGUAGES.ZH_CN) {
      const defaultTranslations = translationsCache.value[LANGUAGES.ZH_CN] || {}
      text = getNestedValue(defaultTranslations, key)
    }
    
    // 如果仍然没有找到，返回键名
    if (!text) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    
    // 支持参数替换
    if (typeof text === 'string' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), params[param])
      })
    }
    
    return text
  }
  
  // 设置语言
  const setLanguage = async (language) => {
    if (!Object.values(LANGUAGES).includes(language)) {
      console.warn('Invalid language:', language)
      return
    }
    
    try {
      // 加载语言文件
      await loadLanguageFile(language)
      
      // 更新当前语言
      currentLanguage.value = language
      
      // 保存到本地存储
      try {
        uni.setStorageSync('app-language', language)
      } catch (error) {
        console.warn('Failed to save language:', error)
      }
      
      console.log(`Language changed to: ${language}`)
    } catch (error) {
      console.error('Failed to set language:', error)
    }
  }
  
  // 从本地存储加载语言
  const loadLanguage = async () => {
    try {
      const savedLanguage = uni.getStorageSync('app-language')
      if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
        await setLanguage(savedLanguage)
      } else {
        // 检测系统语言
        await detectSystemLanguage()
      }
    } catch (error) {
      console.warn('Failed to load language:', error)
      await detectSystemLanguage()
    }
  }
  
  // 检测系统语言
  const detectSystemLanguage = async () => {
    try {
      const systemInfo = uni.getSystemInfoSync()
      const systemLanguage = systemInfo.language || 'zh-CN'
      
      // 映射系统语言到支持的语言
      const languageMap = {
        'zh': LANGUAGES.ZH_CN,
        'zh-CN': LANGUAGES.ZH_CN,
        'zh-Hans': LANGUAGES.ZH_CN,
        'en': LANGUAGES.EN_US,
        'en-US': LANGUAGES.EN_US,
        'ja': LANGUAGES.JA_JP,
        'ja-JP': LANGUAGES.JA_JP,
        'ko': LANGUAGES.KO_KR,
        'ko-KR': LANGUAGES.KO_KR
      }
      
      const detectedLanguage = languageMap[systemLanguage] || 
                              languageMap[systemLanguage.split('-')[0]] || 
                              LANGUAGES.ZH_CN
      
      await setLanguage(detectedLanguage)
    } catch (error) {
      console.warn('Failed to detect system language:', error)
      await setLanguage(LANGUAGES.ZH_CN)
    }
  }
  
  // 获取语言选项
  const getLanguageOptions = () => {
    return Object.values(LANGUAGES).map(lang => ({
      value: lang,
      label: LANGUAGE_NAMES[lang]
    }))
  }
  
  // 获取当前语言索引（用于picker组件）
  const getCurrentLanguageIndex = () => {
    return Object.values(LANGUAGES).indexOf(currentLanguage.value)
  }
  
  // 获取当前语言名称
  const getCurrentLanguageName = () => {
    return LANGUAGE_NAMES[currentLanguage.value] || LANGUAGE_NAMES[LANGUAGES.ZH_CN]
  }
  
  // 预加载所有语言文件
  const preloadLanguages = async () => {
    const loadPromises = Object.values(LANGUAGES).map(lang => loadLanguageFile(lang))
    try {
      await Promise.all(loadPromises)
      console.log('All language files preloaded')
    } catch (error) {
      console.warn('Failed to preload some language files:', error)
    }
  }
  
  return {
    // 状态
    currentLanguage,
    
    // 方法
    t,
    setLanguage,
    loadLanguage,
    detectSystemLanguage,
    getLanguageOptions,
    getCurrentLanguageIndex,
    getCurrentLanguageName,
    preloadLanguages,
    
    // 常量
    LANGUAGES,
    LANGUAGE_NAMES
  }
} 