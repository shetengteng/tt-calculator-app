/**
 * 系统信息适配器
 * 提供跨平台的系统信息接口
 */

class SystemAdapter {
  /**
   * 获取系统信息
   * @returns {Object} 系统信息
   */
  getSystemInfo() {
    try {
      // #ifdef H5
      // H5环境获取浏览器信息
      return {
        platform: 'h5',
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        theme: this.getSystemTheme()
      }
      // #endif

      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.getSystemInfoSync
      if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
        return uni.getSystemInfoSync()
      }
      // #endif

      return {}
    } catch (error) {
      console.warn('Failed to get system info:', error)
      return {}
    }
  }

  /**
   * 异步获取系统信息
   * @returns {Promise<Object>} 系统信息
   */
  async getSystemInfoAsync() {
    try {
      // #ifdef H5
      // H5环境直接返回系统信息
      return this.getSystemInfo()
      // #endif

      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.getSystemInfo
      if (typeof uni !== 'undefined' && uni.getSystemInfo) {
        return new Promise((resolve, reject) => {
          uni.getSystemInfo({
            success: (res) => {
              resolve(res)
            },
            fail: (err) => {
              reject(err)
            }
          })
        })
      }
      // #endif

      return {}
    } catch (error) {
      console.warn('Failed to get system info async:', error)
      return {}
    }
  }

  /**
   * 获取系统主题
   * @returns {string} 系统主题 'light' | 'dark'
   */
  getSystemTheme() {
    try {
      // #ifdef H5
      // H5环境检查媒体查询
      if (typeof window !== 'undefined' && window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
        return darkModeQuery.matches ? 'dark' : 'light'
      }
      // #endif

      // #ifdef MP || APP-PLUS
      // 小程序和App环境从系统信息获取
      const systemInfo = this.getSystemInfo()
      return systemInfo.theme || 'light'
      // #endif

    } catch (error) {
      console.warn('Failed to get system theme:', error)
    }
    return 'light'
  }

  /**
   * 监听系统主题变化
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消监听的函数
   */
  watchSystemTheme(callback) {
    try {
      // #ifdef H5
      // H5环境监听媒体查询变化
      if (typeof window !== 'undefined' && window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e) => {
          callback({theme: e.matches ? 'dark' : 'light'})
        }
        darkModeQuery.addEventListener('change', handler)
        return () => darkModeQuery.removeEventListener('change', handler)
      }
      // #endif

      // #ifdef MP || APP-PLUS
      // 小程序和App环境监听主题变化
      if (typeof uni !== 'undefined' && uni.onThemeChange) {
        uni.onThemeChange(callback)
        return () => {
          if (uni.offThemeChange) {
            uni.offThemeChange(callback)
          }
        }
      }
      // #endif

      return () => {
      }
    } catch (error) {
      console.warn('Failed to watch system theme:', error)
      return () => {
      }
    }
  }

  /**
   * 设置导航栏颜色
   * @param {Object} options - 导航栏配置
   * @param {string} options.frontColor - 前景色
   * @param {string} options.backgroundColor - 背景色
   * @param {Object} options.animation - 动画配置
   * @returns {boolean} 是否成功
   */
  setNavigationBarColor(options) {
    try {
      // #ifdef H5
      // H5环境设置页面标题栏颜色（有限支持）
      if (typeof document !== 'undefined') {
        // 设置meta标签
        const metaThemeColor = document.querySelector('meta[name="theme-color"]')
        if (metaThemeColor) {
          metaThemeColor.content = options.backgroundColor
        } else {
          const meta = document.createElement('meta')
          meta.name = 'theme-color'
          meta.content = options.backgroundColor
          document.head.appendChild(meta)
        }
        return true
      }
      // #endif

      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.setNavigationBarColor
      if (typeof uni !== 'undefined' && uni.setNavigationBarColor) {
        uni.setNavigationBarColor({...options})
        return true
      }
      // #endif

      return false
    } catch (error) {
      console.warn('Failed to set navigation bar color:', error)
      return false
    }
  }

  /**
   * 获取设备信息
   * @returns {Object} 设备信息
   */
  getDeviceInfo() {
    try {
      const systemInfo = this.getSystemInfo()
      return {
        brand: systemInfo.brand || 'unknown',
        model: systemInfo.model || 'unknown',
        system: systemInfo.system || 'unknown',
        platform: systemInfo.platform || 'unknown',
        version: systemInfo.version || 'unknown',
        screenWidth: systemInfo.screenWidth || 0,
        screenHeight: systemInfo.screenHeight || 0,
        windowWidth: systemInfo.windowWidth || 0,
        windowHeight: systemInfo.windowHeight || 0,
        pixelRatio: systemInfo.pixelRatio || 1
      }
    } catch (error) {
      console.warn('Failed to get device info:', error)
      return {
        brand: 'unknown',
        model: 'unknown',
        system: 'unknown',
        platform: 'unknown',
        version: 'unknown',
        screenWidth: 0,
        screenHeight: 0,
        windowWidth: 0,
        windowHeight: 0,
        pixelRatio: 1
      }
    }
  }

  /**
   * 检查是否支持某个功能
   * @param {string} feature - 功能名称
   * @returns {boolean} 是否支持
   */
  isSupported(feature) {
    try {
      // #ifdef H5
      // H5环境功能检查
      switch (feature) {
        case 'audio':
          return typeof Audio !== 'undefined'
        case 'localStorage':
          return typeof localStorage !== 'undefined'
        case 'geolocation':
          return typeof navigator !== 'undefined' && navigator.geolocation
        case 'vibration':
          return typeof navigator !== 'undefined' && navigator.vibrate
        default:
          return false
      }
      // #endif

      // #ifdef MP || APP-PLUS
      // 小程序和App环境功能检查
      switch (feature) {
        case 'audio':
          return typeof uni !== 'undefined' && uni.createInnerAudioContext
        case 'storage':
          return typeof uni !== 'undefined' && uni.getStorageSync
        case 'location':
          return typeof uni !== 'undefined' && uni.getLocation
        case 'vibration':
          return typeof uni !== 'undefined' && uni.vibrateLong
        default:
          return false
      }
      // #endif

      return false
    } catch (error) {
      console.warn(`Failed to check feature support ${feature}:`, error)
      return false
    }
  }

  /**
   * 触发震动
   * @param {string} type - 震动类型 'short' | 'long'
   * @returns {Promise<boolean>} 是否成功
   */
  async vibrate(type = 'short') {
    try {
      // #ifdef H5
      // H5环境使用Vibration API
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        const duration = type === 'long' ? 1000 : 200
        navigator.vibrate(duration)
        return true
      }
      // #endif

      // #ifdef MP || APP-PLUS
      // 小程序和App环境使用uni.vibrate
      if (typeof uni !== 'undefined') {
        const vibrateMethod = type === 'long' ? uni.vibrateLong : uni.vibrateShort
        if (vibrateMethod) {
          return new Promise((resolve) => {
            vibrateMethod({
              success: () => {
                resolve(true)
              },
              fail: () => {
                resolve(false)
              }
            })
          })
        }
      }
      // #endif

      return false
    } catch (error) {
      console.warn('Failed to vibrate:', error)
      return false
    }
  }
}

export const systemAdapter = new SystemAdapter()