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

export default {
  fetchLocalJson,
  fetchLocalJsonWithCache,
  fetchMultipleLocalJson,
  safeStorageOperation
} 