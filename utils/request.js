/**
 * 通用的本地JSON文件请求工具
 * 用于统一处理 uni.request 的逻辑，减少代码重复
 */

/**
 * 获取本地JSON文件
 * @param {string} url - 请求的URL
 * @returns {Promise<any>} 返回JSON数据
 */
export const fetchLocalJson = async (url) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`Failed to load ${url}: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 获取本地JSON文件（带缓存破坏）
 * @param {string} url - 请求的URL
 * @returns {Promise<any>} 返回JSON数据
 */
export const fetchLocalJsonWithCache = async (url) => {
  const urlWithTimestamp = `${url}?t=${Date.now()}`
  return fetchLocalJson(urlWithTimestamp)
}

/**
 * 批量获取本地JSON文件
 * @param {string[]} urls - 请求的URL数组
 * @returns {Promise<any[]>} 返回JSON数据数组
 */
export const fetchMultipleLocalJson = async (urls) => {
  const requests = urls.map(url => fetchLocalJson(url))
  return Promise.all(requests)
}

/**
 * 安全的本地存储操作
 * @param {string} operation - 操作类型 'get' 或 'set'
 * @param {string} key - 存储键
 * @param {any} value - 存储值（仅set操作需要）
 * @returns {any} get操作返回存储的值，set操作返回操作结果
 */
export const safeStorageOperation = (operation, key, value = null) => {
  try {
    return operation === 'get' ? uni.getStorageSync(key) : uni.setStorageSync(key, value)
  } catch (error) {
    console.warn(`Storage operation failed: ${error.message}`)
    return operation === 'get' ? null : false
  }
}

/**
 * 加载配置文件（支持 JS 和 JSON 格式）
 * @param {string} configType - 配置类型 ('locales', 'themes', 'sounds')
 * @param {string} configName - 配置名称（可选，如果不提供则加载索引配置）
 * @returns {Promise<any>} 返回配置数据
 */
export const loadConfig = async (configType, configName = null) => {
  try {
    // 动态导入配置文件
    let configModule;
    
    if (configName) {
      // 加载特定配置文件
      configModule = await import(`../config/${configType}/${configName}.js`);
    } else {
      // 加载索引配置文件
      configModule = await import(`../config/${configType}/index.js`);
    }
    
    // 优先返回默认导出，如果没有则返回整个模块
    const result = configModule.default || configModule;
    console.log(`Loaded config ${configType}/${configName || 'index'}:`, result);
    return result;
  } catch (error) {
    console.error(`Failed to load config ${configType}/${configName || 'index'}:`, error);
    throw error;
  }
}

/**
 * 加载语言配置
 * @param {string} langCode - 语言代码（如 'zh-CN'）
 * @returns {Promise<any>} 返回语言配置数据
 */
export const loadLocaleConfig = async (langCode = null) => {
  if (langCode) {
    return await loadConfig('locales', langCode);
  }
  return await loadConfig('locales');
}

/**
 * 加载主题配置
 * @param {string} themeId - 主题ID（如 'dark'）
 * @returns {Promise<any>} 返回主题配置数据
 */
export const loadThemeConfig = async (themeId = null) => {
  if (themeId) {
    return await loadConfig('themes', themeId);
  }
  return await loadConfig('themes');
}

/**
 * 加载声音配置
 * @returns {Promise<any>} 返回声音配置数据
 */
export const loadSoundConfig = async () => {
  return await loadConfig('sounds');
}

/**
 * 加载所有配置
 * @returns {Promise<any>} 返回所有配置数据
 */
export const loadAllConfigs = async () => {
  try {
    const configModule = await import('../config/index.js');
    return configModule.default || configModule;
  } catch (error) {
    console.warn('Failed to load all configs:', error);
    throw error;
  }
}

export default {
  fetchLocalJson,
  fetchLocalJsonWithCache,
  fetchMultipleLocalJson,
  safeStorageOperation,
  loadConfig,
  loadLocaleConfig,
  loadThemeConfig,
  loadSoundConfig,
  loadAllConfigs
} 