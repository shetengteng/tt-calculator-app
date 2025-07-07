/**
 * 存储操作适配器
 * 提供跨平台的存储操作接口
 */

class StorageAdapter {
  /**
   * 同步获取存储数据
   * @param {string} key - 存储键
   * @param {any} defaultValue - 默认值
   * @returns {any} 存储的值
   */
  getSync(key, defaultValue = null) {
    try {
      // #ifdef H5
      // H5环境使用localStorage
      if (typeof localStorage !== 'undefined') {
        const value = localStorage.getItem(key)
        return value ? JSON.parse(value) : defaultValue
      }
      // #endif
      
      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.getStorageSync
      if (typeof uni !== 'undefined' && uni.getStorageSync) {
        const value = uni.getStorageSync(key)
        return value || defaultValue
      }
      // #endif
      
      return defaultValue
    } catch (error) {
      console.warn(`Failed to get storage ${key}:`, error)
      return defaultValue
    }
  }
  
  /**
   * 同步设置存储数据
   * @param {string} key - 存储键
   * @param {any} value - 存储值
   * @returns {boolean} 是否成功
   */
  setSync(key, value) {
    try {
      // #ifdef H5
      // H5环境使用localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value))
        return true
      }
      // #endif
      
      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.setStorageSync
      if (typeof uni !== 'undefined' && uni.setStorageSync) {
        uni.setStorageSync(key, value)
        return true
      }
      // #endif
      
      return false
    } catch (error) {
      console.warn(`Failed to set storage ${key}:`, error)
      return false
    }
  }
  
  /**
   * 异步获取存储数据
   * @param {string} key - 存储键
   * @param {any} defaultValue - 默认值
   * @returns {Promise<any>} 存储的值
   */
  async get(key, defaultValue = null) {
    try {
      // #ifdef H5
      // H5环境使用localStorage（同步操作）
      if (typeof localStorage !== 'undefined') {
        const value = localStorage.getItem(key)
        return value ? JSON.parse(value) : defaultValue
      }
      // #endif
      
      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.getStorage
      if (typeof uni !== 'undefined' && uni.getStorage) {
        return new Promise((resolve) => {
          uni.getStorage({
            key,
            success: (res) => {
              resolve(res.data || defaultValue)
            },
            fail: () => {
              resolve(defaultValue)
            }
          })
        })
      }
      // #endif
      
      return defaultValue
    } catch (error) {
      console.warn(`Failed to get storage ${key}:`, error)
      return defaultValue
    }
  }
  
  /**
   * 异步设置存储数据
   * @param {string} key - 存储键
   * @param {any} value - 存储值
   * @returns {Promise<boolean>} 是否成功
   */
  async set(key, value) {
    try {
      // #ifdef H5
      // H5环境使用localStorage（同步操作）
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value))
        return true
      }
      // #endif
      
      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.setStorage
      if (typeof uni !== 'undefined' && uni.setStorage) {
        return new Promise((resolve) => {
          uni.setStorage({
            key,
            data: value,
            success: () => {
              resolve(true)
            },
            fail: () => {
              resolve(false)
            }
          })
        })
      }
      // #endif
      
      return false
    } catch (error) {
      console.warn(`Failed to set storage ${key}:`, error)
      return false
    }
  }
  
  /**
   * 删除存储数据
   * @param {string} key - 存储键
   * @returns {boolean} 是否成功
   */
  remove(key) {
    try {
      // #ifdef H5
      // H5环境使用localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key)
        return true
      }
      // #endif
      
      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.removeStorageSync
      if (typeof uni !== 'undefined' && uni.removeStorageSync) {
        uni.removeStorageSync(key)
        return true
      }
      // #endif
      
      return false
    } catch (error) {
      console.warn(`Failed to remove storage ${key}:`, error)
      return false
    }
  }
  
  /**
   * 异步删除存储数据
   * @param {string} key - 存储键
   * @returns {Promise<boolean>} 是否成功
   */
  async removeAsync(key) {
    try {
      // #ifdef H5
      // H5环境使用localStorage（同步操作）
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key)
        return true
      }
      // #endif
      
      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.removeStorage
      if (typeof uni !== 'undefined' && uni.removeStorage) {
        return new Promise((resolve) => {
          uni.removeStorage({
            key,
            success: () => {
              resolve(true)
            },
            fail: () => {
              resolve(false)
            }
          })
        })
      }
      // #endif
      
      return false
    } catch (error) {
      console.warn(`Failed to remove storage ${key}:`, error)
      return false
    }
  }
  
  /**
   * 清空所有存储
   * @returns {boolean} 是否成功
   */
  clear() {
    try {
      // #ifdef H5
      // H5环境使用localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.clear()
        return true
      }
      // #endif
      
      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.clearStorageSync
      if (typeof uni !== 'undefined' && uni.clearStorageSync) {
        uni.clearStorageSync()
        return true
      }
      // #endif
      
      return false
    } catch (error) {
      console.warn('Failed to clear storage:', error)
      return false
    }
  }
  
  /**
   * 获取所有存储键
   * @returns {string[]} 存储键数组
   */
  getKeys() {
    try {
      // #ifdef H5
      // H5环境使用localStorage
      if (typeof localStorage !== 'undefined') {
        return Object.keys(localStorage)
      }
      // #endif
      
      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.getStorageInfoSync
      if (typeof uni !== 'undefined' && uni.getStorageInfoSync) {
        const info = uni.getStorageInfoSync()
        return info.keys || []
      }
      // #endif
      
      return []
    } catch (error) {
      console.warn('Failed to get storage keys:', error)
      return []
    }
  }
  
  /**
   * 获取存储信息
   * @returns {Object} 存储信息
   */
  getInfo() {
    try {
      // #ifdef H5
      // H5环境计算localStorage信息
      if (typeof localStorage !== 'undefined') {
        const keys = Object.keys(localStorage)
        let currentSize = 0
        keys.forEach(key => {
          currentSize += localStorage.getItem(key).length
        })
        return {
          keys,
          currentSize,
          limitSize: 5 * 1024 * 1024 // 5MB 估算
        }
      }
      // #endif
      
      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.getStorageInfoSync
      if (typeof uni !== 'undefined' && uni.getStorageInfoSync) {
        return uni.getStorageInfoSync()
      }
      // #endif
      
      return {
        keys: [],
        currentSize: 0,
        limitSize: 0
      }
    } catch (error) {
      console.warn('Failed to get storage info:', error)
      return {
        keys: [],
        currentSize: 0,
        limitSize: 0
      }
    }
  }
  
  /**
   * 检查存储是否可用
   * @returns {boolean} 存储是否可用
   */
  isStorageAvailable() {
    // #ifdef H5
    return typeof localStorage !== 'undefined'
    // #endif
    
    // #ifdef MP || APP-PLUS
    return typeof uni !== 'undefined' && uni.getStorageSync
    // #endif
    
    return false
  }
}

export const storageAdapter = new StorageAdapter()
export default storageAdapter 