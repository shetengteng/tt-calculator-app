import { ref, computed } from 'vue'

// 语言配置缓存
const languageConfig = ref({
  languages: [],
  systemLanguageMapping: {},
  defaultLanguage: 'zh-CN'
})

// 当前语言状态
const currentLanguage = ref('zh-CN')

// 翻译数据缓存
const translationsCache = ref({})

// 语言名称缓存
const languageNamesCache = ref({})

// 支持的语言列表（动态加载）
const availableLanguages = ref([])

// 初始化状态
const isInitialized = ref(false)

// 加载语言列表
const loadLanguageList = async () => {
  try {
    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: '/static/locales/languages.json',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error(`Failed to load languages.json: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
    
    // 更新语言配置
    languageConfig.value = {
      languages: response.languages || ['zh-CN'],
      systemLanguageMapping: response.systemLanguageMapping || {},
      defaultLanguage: response.defaultLanguage || 'zh-CN'
    }
    
    availableLanguages.value = languageConfig.value.languages
    
    // 更新当前语言的初始值
    if (currentLanguage.value === 'zh-CN') {
      currentLanguage.value = languageConfig.value.defaultLanguage
    }
    
    console.log('Language list loaded:', availableLanguages.value)
  } catch (error) {
    console.error('Failed to load language list:', error)
    throw error
  }
}

// 加载语言名称
const loadLanguageName = async (language) => {
  if (languageNamesCache.value[language]) {
    return languageNamesCache.value[language]
  }
  
  try {
    const languageData = await loadLanguageFile(language)
    const name = languageData._metadata?.name || language
    languageNamesCache.value[language] = name
    return name
  } catch (error) {
    console.error(`Failed to load language name for ${language}:`, error)
    throw error
  }
}

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
    console.error(`Failed to load language file for ${language}:`, error)
    throw error
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
    if (!text && currentLanguage.value !== languageConfig.value.defaultLanguage) {
      const defaultTranslations = translationsCache.value[languageConfig.value.defaultLanguage] || {}
      text = getNestedValue(defaultTranslations, key)
    }
    
    // 如果仍然没有找到，返回键名
    if (!text) {
      // 只有在语言系统已经初始化完成的情况下才输出警告
      if (isInitialized.value) {
        console.warn(`Translation missing for key: ${key}`)
      }
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
    // 确保语言列表已经加载
    if (availableLanguages.value.length === 0) {
      await loadLanguageList()
    }
    
    if (!availableLanguages.value.includes(language)) {
      console.warn('Invalid language:', language)
      return
    }
    
    try {
      // 加载语言文件
      await loadLanguageFile(language)
      
      // 更新当前语言
      currentLanguage.value = language
      
      // 标记为已初始化
      isInitialized.value = true
      
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
      // 确保语言列表已经加载
      if (availableLanguages.value.length === 0) {
        await loadLanguageList()
      }
      
      const savedLanguage = uni.getStorageSync('app-language')
      if (savedLanguage && availableLanguages.value.includes(savedLanguage)) {
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
      // 确保语言列表已经加载
      if (availableLanguages.value.length === 0) {
        await loadLanguageList()
      }
      
      const systemInfo = uni.getSystemInfoSync()
      const systemLanguage = systemInfo.language || 'zh-CN'
      
      // 使用配置文件中的系统语言映射
      const languageMap = languageConfig.value.systemLanguageMapping
      
      const detectedLanguage = languageMap[systemLanguage] || 
                              languageMap[systemLanguage.split('-')[0]] || 
                              languageConfig.value.defaultLanguage
      
      // 确保检测到的语言在可用语言列表中
      const finalLanguage = availableLanguages.value.includes(detectedLanguage) 
                           ? detectedLanguage 
                           : (availableLanguages.value[0] || languageConfig.value.defaultLanguage)
      
      await setLanguage(finalLanguage)
    } catch (error) {
      console.warn('Failed to detect system language:', error)
      await setLanguage(languageConfig.value.defaultLanguage)
    }
  }
  
  // 获取语言选项
  const getLanguageOptions = async () => {
    // 如果语言列表还没有加载，先加载它
    if (availableLanguages.value.length === 0) {
      await loadLanguageList()
    }
    
    const options = []
    
    for (const lang of availableLanguages.value) {
      const name = await loadLanguageName(lang)
      options.push({
        value: lang,
        label: name
      })
    }
    
    return options
  }
  
  // 获取当前语言索引（用于picker组件）
  const getCurrentLanguageIndex = () => {
    // 如果语言列表还没有加载，返回0作为默认值
    if (availableLanguages.value.length === 0) {
      return 0
    }
    
    return availableLanguages.value.indexOf(currentLanguage.value)
  }
  
  // 获取当前语言名称
  const getCurrentLanguageName = async () => {
    return await loadLanguageName(currentLanguage.value)
  }
  
  // 预加载所有语言文件
  const preloadLanguages = async () => {
    await loadLanguageList()
    const loadPromises = availableLanguages.value.map(lang => loadLanguageFile(lang))
    try {
      await Promise.all(loadPromises)
      isInitialized.value = true
      console.log('All language files preloaded')
    } catch (error) {
      console.warn('Failed to preload some language files:', error)
    }
  }
  
  return {
    // 状态
    currentLanguage,
    availableLanguages,
    
    // 方法
    t,
    setLanguage,
    loadLanguage,
    detectSystemLanguage,
    getLanguageOptions,
    getCurrentLanguageIndex,
    getCurrentLanguageName,
    preloadLanguages,
    loadLanguageList,
    
    // 常量
    defaultLanguage: languageConfig.value.defaultLanguage
  }
} 