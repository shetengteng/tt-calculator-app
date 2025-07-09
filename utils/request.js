/**
 * 通用的本地存储工具
 * 用于统一处理存储操作
 */

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
    console.warn(`[warn] Storage operation failed: ${error.message}`)
    return operation === 'get' ? null : false
  }
}

export default {
  safeStorageOperation
} 