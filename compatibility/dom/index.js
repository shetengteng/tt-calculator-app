/**
 * DOM操作适配器
 * 提供跨平台的DOM操作接口
 */

class DomAdapter {
  /**
   * 设置CSS自定义属性
   * @param {string} property - CSS属性名
   * @param {string} value - CSS属性值
   * @param {Element} element - 目标元素（可选）
   */
  setCustomProperty(property, value, element = null) {
    // #ifdef H5
    const targetElement = element || document.documentElement
    if (targetElement && targetElement.style) {
      targetElement.style.setProperty(property, value)
    }
    // #endif
    
    // #ifdef MP
    // 小程序环境通过页面实例设置样式
    try {
      const pages = getCurrentPages()
      if (pages.length > 0) {
        const page = pages[pages.length - 1]
        if (page && page.$el && page.$el.style) {
          page.$el.style.setProperty(property, value)
        }
      }
    } catch (error) {
      console.warn('Failed to set custom property in mini-program:', error)
    }
    // #endif
  }
  
  /**
   * 批量设置CSS自定义属性
   * @param {Object} properties - 属性对象 {propertyName: value}
   * @param {Element} element - 目标元素（可选）
   */
  setCustomProperties(properties, element = null) {
    Object.keys(properties).forEach(key => {
      this.setCustomProperty(key, properties[key], element)
    })
  }
  
  /**
   * 设置元素样式
   * @param {Element} element - 目标元素
   * @param {Object} styles - 样式对象
   */
  setElementStyles(element, styles) {
    // #ifdef H5
    if (element && element.style) {
      Object.keys(styles).forEach(key => {
        element.style[key] = styles[key]
      })
    }
    // #endif
    
    // #ifdef MP
    // 小程序环境样式设置
    try {
      const pages = getCurrentPages()
      if (pages.length > 0) {
        const page = pages[pages.length - 1]
        if (page && page.$el && page.$el.style) {
          Object.keys(styles).forEach(key => {
            page.$el.style[key] = styles[key]
          })
        }
      }
    } catch (error) {
      console.warn('Failed to set element styles in mini-program:', error)
    }
    // #endif
  }
  
  /**
   * 设置页面背景色
   * @param {string} backgroundColor - 背景色
   * @param {string} textColor - 文字色（可选）
   */
  setPageBackground(backgroundColor, textColor = null) {
    // #ifdef H5
    if (document.body) {
      document.body.style.backgroundColor = backgroundColor
      if (textColor) {
        document.body.style.color = textColor
      }
    }
    // #endif
    
    // #ifdef MP
    // 小程序环境设置页面背景
    try {
      const pages = getCurrentPages()
      if (pages.length > 0) {
        const page = pages[pages.length - 1]
        if (page && page.$el && page.$el.style) {
          page.$el.style.backgroundColor = backgroundColor
          if (textColor) {
            page.$el.style.color = textColor
          }
        }
      }
    } catch (error) {
      console.warn('Failed to set page background in mini-program:', error)
    }
    // #endif
  }
  
  /**
   * 设置元素属性
   * @param {Element} element - 目标元素
   * @param {string} attribute - 属性名
   * @param {string} value - 属性值
   */
  setAttribute(element, attribute, value) {
    // #ifdef H5
    if (element && element.setAttribute) {
      element.setAttribute(attribute, value)
    }
    // #endif
    
    // #ifdef MP
    // 小程序环境属性设置
    console.log(`Setting attribute ${attribute}=${value} in mini-program environment`)
    // 小程序中通过数据绑定设置属性，这里主要用于日志记录
    // #endif
  }
  
  /**
   * 获取根元素
   * @returns {Element|null} 根元素
   */
  getRootElement() {
    // #ifdef H5
    return document.documentElement
    // #endif
    
    // #ifdef MP
    // 小程序环境返回当前页面元素
    try {
      const pages = getCurrentPages()
      if (pages.length > 0) {
        const page = pages[pages.length - 1]
        return page && page.$el ? page.$el : null
      }
    } catch (error) {
      console.warn('Failed to get root element in mini-program:', error)
    }
    return null
    // #endif
  }
  
  /**
   * 添加CSS类名
   * @param {Element|string} element - 目标元素或选择器
   * @param {string} className - 类名
   * @returns {boolean} 是否成功
   */
  addClass(element, className) {
    if (typeof element === 'string') {
      element = this.querySelector(element)
    }
    
    if (!element) return false
    
    // #ifdef H5
    if (element.classList) {
      element.classList.add(className)
      return true
    }
    // #endif
    
    // #ifdef MP
    // 小程序环境：通过操作className属性
    try {
      const currentClass = element.className || ''
      const classes = currentClass.split(' ').filter(Boolean)
      if (!classes.includes(className)) {
        classes.push(className)
        element.className = classes.join(' ')
      }
      return true
    } catch (error) {
      console.warn('Failed to add class in mini-program:', error)
      return false
    }
    // #endif
    
    return false
  }
  
  /**
   * 移除CSS类名
   * @param {Element|string} element - 目标元素或选择器
   * @param {string} className - 类名
   * @returns {boolean} 是否成功
   */
  removeClass(element, className) {
    if (typeof element === 'string') {
      element = this.querySelector(element)
    }
    
    if (!element) return false
    
    // #ifdef H5
    if (element.classList) {
      element.classList.remove(className)
      return true
    }
    // #endif
    
    // #ifdef MP
    // 小程序环境：通过操作className属性
    try {
      const currentClass = element.className || ''
      const classes = currentClass.split(' ').filter(Boolean)
      const index = classes.indexOf(className)
      if (index > -1) {
        classes.splice(index, 1)
        element.className = classes.join(' ')
      }
      return true
    } catch (error) {
      console.warn('Failed to remove class in mini-program:', error)
      return false
    }
    // #endif
    
    return false
  }
  
  /**
   * 查询元素
   * @param {string} selector - 选择器
   * @returns {Element|null} 元素
   */
  querySelector(selector) {
    // #ifdef H5
    return document.querySelector(selector)
    // #endif
    
    // #ifdef MP
    // 小程序环境暂不支持复杂选择器，返回null
    console.warn('querySelector not fully supported in mini-program environment')
    return null
    // #endif
  }
  
  /**
   * 检查DOM是否可用
   * @returns {boolean} DOM是否可用
   */
  isDomAvailable() {
    // #ifdef H5
    return typeof document !== 'undefined' && document.documentElement
    // #endif
    
    // #ifdef MP
    // 小程序环境检查页面是否存在
    try {
      const pages = getCurrentPages()
      return pages.length > 0
    } catch (error) {
      return false
    }
    // #endif
  }
}

export const domAdapter = new DomAdapter()
export default domAdapter 