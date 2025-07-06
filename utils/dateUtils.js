/**
 * 日期时间工具类
 */

/**
 * 格式化时间戳为完整的年月日时分格式
 * @param {Date|number} timestamp - 时间戳
 * @returns {string} 格式化后的时间字符串 (YYYY/MM/DD HH:MM)
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  
  // 始终显示完整的年月日时分格式
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  
  return `${year}/${month}/${day} ${hours}:${minutes}`
}

/**
 * 获取日期键值用于分组
 * @param {Date} date - 日期对象
 * @param {Date} now - 当前时间
 * @returns {string} 日期键值
 */
export const getDateKey = (date, now) => {
  const dateStr = date.toDateString()
  const nowStr = now.toDateString()
  
  if (dateStr === nowStr) {
    return 'today'
  }
  
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  if (dateStr === yesterdayStr) {
    return 'yesterday'
  }
  
  // 返回日期字符串作为键
  return date.toDateString()
}

/**
 * 获取日期标题用于显示
 * @param {Date} date - 日期对象
 * @param {Date} now - 当前时间
 * @param {Function} t - 国际化函数
 * @returns {string} 日期标题
 */
export const getDateTitle = (date, now, t = (key) => key) => {
  const dateStr = date.toDateString()
  const nowStr = now.toDateString()
  
  if (dateStr === nowStr) {
    return t('history.today') || '今天'
  }
  
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  if (dateStr === yesterdayStr) {
    return t('history.yesterday') || '昨天'
  }
  
  // 显示具体日期
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}/${day}`
}

/**
 * 格式化相对时间（相对于当前时间的描述）
 * @param {Date|number} timestamp - 时间戳
 * @returns {string} 相对时间描述
 */
export const formatRelativeTime = (timestamp) => {
  const now = new Date()
  const date = new Date(timestamp)
  
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return 'A few seconds ago'
  } else if (diffInMinutes === 1) {
    return 'A minute ago'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInMinutes < 24 * 60) {
    // Format as HH:MM
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  } else {
    // Format as MM/DD HH:MM
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}/${day} ${hours}:${minutes}`
  }
} 