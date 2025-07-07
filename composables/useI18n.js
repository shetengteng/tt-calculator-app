import { ref, computed } from 'vue'
import { safeStorageOperation, loadLocaleConfig } from '../utils/request.js'

// 常量定义
const DEFAULT_LANGUAGE = 'zh-CN'
const DEFAULT_FLAG = '🌐'
const LANGUAGE_STORAGE_KEY = 'app-language'

// 语言配置缓存
const languageConfig = ref({
  languages: [],
  systemLanguageMapping: {},
  defaultLanguage: DEFAULT_LANGUAGE
})

// 当前语言状态
const currentLanguage = ref(DEFAULT_LANGUAGE)

// 翻译数据缓存
const translationsCache = ref({})

// 语言名称缓存
const languageNamesCache = ref({})

// 支持的语言列表（动态加载）
const availableLanguages = ref([])

// 参数替换正则表达式缓存
const paramRegexCache = new Map()

// 初始化状态标记
const isInitialized = ref(false)
const isInitializing = ref(false)

// 获取或创建参数替换正则表达式（缓存优化）
const getParamRegex = (param) => {
  if (!paramRegexCache.has(param)) {
    paramRegexCache.set(param, new RegExp(`{${param}}`, 'g'))
  }
  return paramRegexCache.get(param)
}

// 加载语言列表
const loadLanguageList = async () => {
  try {
    // 清空相关缓存
    languageConfig.value = {
      languages: [],
      systemLanguageMapping: {},
      defaultLanguage: DEFAULT_LANGUAGE
    }
    availableLanguages.value = []
    console.log('Language list cache cleared, reloading...')
    
    // 从新的配置系统加载
    const configModule = await loadLocaleConfig()
    const response = {
      languages: configModule.languages || [DEFAULT_LANGUAGE],
      systemLanguageMapping: configModule.systemLanguageMapping || {},
      defaultLanguage: configModule.defaultLanguage || DEFAULT_LANGUAGE
    }
    
    // 更新语言配置
    languageConfig.value = response
    availableLanguages.value = response.languages
    
    // 更新当前语言的初始值
    if (currentLanguage.value === DEFAULT_LANGUAGE) {
      currentLanguage.value = response.defaultLanguage
    }
    
    console.log('Language list loaded from config system:', availableLanguages.value)
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
    const languageInfo = {
      name: languageData._metadata?.name || language,
      flag: languageData._metadata?.flag || DEFAULT_FLAG,
      region: languageData._metadata?.region || ''
    }
    languageNamesCache.value[language] = languageInfo
    return languageInfo
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
    // 从新的配置系统加载
    const configModule = await loadLocaleConfig(language)
    const response = configModule.locale || configModule.default || configModule
    
    // 缓存翻译数据
    translationsCache.value[language] = response
    console.log(`Language file loaded from config system: ${language}`)
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

// 完整的语言系统初始化（清空缓存重新加载并预加载所有语言）
const initializeLanguageSystem = async () => {
  try {
    // 标记开始初始化
    isInitializing.value = true
    isInitialized.value = false
    
    // 清空所有缓存
    translationsCache.value = {}
    languageNamesCache.value = {}
    paramRegexCache.clear()
    console.log('Language cache cleared, reinitializing...')
    
    // 重新加载语言配置
    await loadLanguageList()
    
    // 重新加载当前语言
    const savedLanguage = safeStorageOperation('get', LANGUAGE_STORAGE_KEY)
    const targetLanguage = (savedLanguage && availableLanguages.value.includes(savedLanguage)) 
                          ? savedLanguage 
                          : languageConfig.value.defaultLanguage
    
    // 更新当前语言
    currentLanguage.value = targetLanguage
    
    // 预加载所有语言文件（避免重复调用 loadLanguageList）
    const loadPromises = availableLanguages.value.map(lang => loadLanguageFile(lang))
    await Promise.all(loadPromises)
    
    // 标记初始化完成
    isInitialized.value = true
    isInitializing.value = false
    
    console.log('Language system initialized and all languages preloaded successfully')
  } catch (error) {
    console.error('Failed to refresh language cache:', error)
    isInitializing.value = false
    throw error
  }
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
      // 只在完全初始化后才显示警告，避免启动时的误报
      if (isInitialized.value && !isInitializing.value) {
        console.warn(`Translation missing for key: ${key}`)
      }
      return key
    }
    
    // 支持参数替换功能（优化：使用缓存的正则表达式）
    // 检查翻译文本是否为字符串类型，并且传入的参数对象不为空
    if (typeof text === 'string' && Object.keys(params).length > 0) {
      // 遍历参数对象的每个键值对
      Object.keys(params).forEach(param => {
        // 使用缓存的正则表达式进行替换，提升性能
        // 例如：将 "{count}分钟前" 中的 {count} 替换为实际数值
        text = text.replace(getParamRegex(param), params[param])
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
    
    // 更新当前语言
    currentLanguage.value = language
    
    // 保存到本地存储（使用安全的存储操作）
    safeStorageOperation('set', LANGUAGE_STORAGE_KEY, language)
    
    console.log(`Language changed to: ${language}`)
  }
  
  // 从本地存储加载语言
  const loadLanguage = async () => {
    try {
      // 确保语言列表已经加载
      if (availableLanguages.value.length === 0) {
        await loadLanguageList()
      }
      
      // 获取要使用的语言
      const savedLanguage = safeStorageOperation('get', LANGUAGE_STORAGE_KEY)
      const targetLanguage = (savedLanguage && availableLanguages.value.includes(savedLanguage)) 
                            ? savedLanguage 
                            : languageConfig.value.defaultLanguage
      
      // 设置并加载语言
      await setLanguage(targetLanguage)
      await loadLanguageFile(targetLanguage)
      
      // 如果是单独加载（不是在初始化过程中），标记为已初始化
      if (!isInitializing.value) {
        isInitialized.value = true
      }
    } catch (error) {
      console.warn('Failed to load language:', error)
      // 使用默认语言作为后备
      const defaultLang = languageConfig.value.defaultLanguage
      await setLanguage(defaultLang)
      await loadLanguageFile(defaultLang)
      
      // 如果是单独加载（不是在初始化过程中），标记为已初始化
      if (!isInitializing.value) {
        isInitialized.value = true
      }
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
      const languageInfo = await loadLanguageName(lang)
      options.push({
        value: lang,
        label: languageInfo.name,
        name: languageInfo.name,
        flag: languageInfo.flag,
        region: languageInfo.region
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
  

  return {
    // 状态
    currentLanguage,
    availableLanguages,
    
    // 方法
    t,
    setLanguage,
    loadLanguage,
    getLanguageOptions,
    getCurrentLanguageIndex,
    getCurrentLanguageName,
    loadLanguageList,
    initializeLanguageSystem,
    
    // 常量
    defaultLanguage: languageConfig.value.defaultLanguage
  }
} 