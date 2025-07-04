/**
 * 页面导航工具类
 * 专门用于处理页面跳转逻辑
 */

/**
 * 返回上一页
 */
export const goBack = () => {
  uni.navigateBack()
}

/**
 * 跳转到指定页面
 * @param {string} url - 页面路径
 * @param {Object} options - 跳转选项
 */
export const navigateTo = (url, options = {}) => {
  uni.navigateTo({
    url,
    ...options
  })
}

/**
 * 替换当前页面
 * @param {string} url - 页面路径
 * @param {Object} options - 跳转选项
 */
export const redirectTo = (url, options = {}) => {
  uni.redirectTo({
    url,
    ...options
  })
}

/**
 * 切换到 tabBar 页面
 * @param {string} url - 页面路径
 */
export const switchTab = (url) => {
  uni.switchTab({
    url
  })
} 