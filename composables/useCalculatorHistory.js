import { ref } from 'vue'

// 全局单例状态
let globalHistory = ref([])
const historyKey = 'calculator-history'
// 过滤最近30天的历史记录
const filterRecentHistory = (historyArray) => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return historyArray.filter(item => {
    const itemDate = new Date(item.timestamp)
    return itemDate >= thirtyDaysAgo
  })
}

// 加载历史记录
const loadHistory = () => {
  try {
    const historyStr = uni.getStorageSync(historyKey)
    if (historyStr) {
      const parsedHistory = JSON.parse(historyStr)

      if (Array.isArray(parsedHistory)) {
        const historyWithDates = parsedHistory.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))

        // 过滤最近30天的记录
        const filteredHistory = filterRecentHistory(historyWithDates)
        globalHistory.value = filteredHistory

        // 如果过滤后的数据和原数据不同，更新存储
        if (filteredHistory.length !== historyWithDates.length) {
          uni.setStorageSync(historyKey, JSON.stringify(filteredHistory))
        }
      }
    } else {
      // 如果没有存储数据，确保数组为空
      globalHistory.value = []
    }
  } catch (error) {
    console.error('[error] Failed to load calculator history:', error)
    uni.removeStorageSync(historyKey)
    globalHistory.value = []
  }
}

// 添加历史记录
const addHistory = (expression, result) => {
  // 存储原始结果值，以便在显示时可以根据设置格式化
  const historyItem = {
    expression,
    result: result,
    timestamp: new Date()
  }
  globalHistory.value.unshift(historyItem)

  // 过滤最近30天的记录
  globalHistory.value = filterRecentHistory(globalHistory.value)

  // 限制历史记录数量（保险起见）
  if (globalHistory.value.length > 100) {
    globalHistory.value = globalHistory.value.slice(0, 100)
  }

  // 保存到本地存储
  try {
    uni.setStorageSync(historyKey, JSON.stringify(globalHistory.value))
  } catch (error) {
    console.error('[error] 保存历史记录失败:', error)
  }
}

// 清空历史记录
const clearHistory = () => {
  globalHistory.value = []
  try {
    uni.removeStorageSync(historyKey)
  } catch (error) {
    console.error('[error] 清空历史记录失败:', error)
  }
}

export function useCalculatorHistory() {

  return {
    // 状态
    history: globalHistory,

    // 方法
    loadHistory,
    addHistory,
    clearHistory
  }
} 