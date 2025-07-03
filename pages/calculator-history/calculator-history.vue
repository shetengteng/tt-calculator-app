<template>
  <view class="history-screen">
    <!-- Header -->
    <view class="header">
      <text class="clear-button" @click="clearAllHistory" v-if="hasHistory">Clear</text>
      <text class="close-button" @click="closeHistory">×</text>
    </view>
    
    <!-- History List -->
    <view class="history-list">
      <view class="history-item" v-for="(item, index) in formattedHistory" :key="item.id" @click="copyResult(item.result)">
        <view class="history-content">
          <text class="timestamp">{{ item.formattedTimestamp }}</text>
          <text class="result">{{ item.result }}</text>
          <text class="calculation">{{ item.calculation }}</text>
        </view>
        <view class="separator" v-if="index !== formattedHistory.length - 1"></view>
      </view>
      
      <view class="empty-history" v-if="!hasHistory">
        <text>No calculation history</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const history = ref([])

// 计算属性 - 检查是否有历史记录
const hasHistory = computed(() => {
  return history.value && history.value.length > 0
})

// 计算属性 - 格式化后的历史记录
const formattedHistory = computed(() => {
  return history.value.map((item, index) => ({
    ...item,
    formattedTimestamp: formatTimestamp(item.timestamp),
    id: `history-${index}`
  }))
})

// 监听历史记录变化
watch(history, (newHistory) => {
  console.log(`历史记录更新，当前有 ${newHistory.length} 条记录`)
}, { deep: true })

const closeHistory = () => {
  uni.navigateBack()
}

const copyResult = (result) => {
  uni.setClipboardData({
    data: result,
    success: () => {
      uni.showToast({
        title: 'Copied to clipboard',
        icon: 'none',
        duration: 1500
      })
    },
    fail: () => {
      uni.showToast({
        title: 'Copy failed',
        icon: 'none',
        duration: 1500
      })
    }
  })
}

const formatTimestamp = (timestamp) => {
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

const clearAllHistory = () => {
  uni.showModal({
    title: 'Clear History',
    content: 'Are you sure you want to clear all calculation history?',
    success: (res) => {
      if (res.confirm) {
        history.value = []
        uni.removeStorageSync('calculatorHistory')
        uni.showToast({
          title: 'History cleared',
          icon: 'success',
          duration: 1500
        })
      }
    }
  })
}

onMounted(() => {
  // Load history from storage
  try {
    const historyStr = uni.getStorageSync('calculatorHistory')
    if (historyStr) {
      const parsedHistory = JSON.parse(historyStr)
      // 验证历史数据的完整性
      if (Array.isArray(parsedHistory)) {
        history.value = parsedHistory.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
      }
    }
  } catch (error) {
    console.error('Failed to load calculator history:', error)
    // 如果历史数据损坏，清除它
    uni.removeStorageSync('calculatorHistory')
    uni.showToast({
      title: 'History data corrupted, cleared',
      icon: 'none',
      duration: 2000
    })
  }
})
</script>

<style>
.history-screen {
  background-color: #FFFFFF;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: calc(20px + var(--status-bar-height));
}

.clear-button {
  font-size: 16px;
  color: #FF3B30;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: rgba(255, 59, 48, 0.1);
}

.close-button {
  font-size: 30px;
  color: #8E8E93;
  height: 40px;
  width: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
}

.history-list {
  flex: 1;
}

.history-item {
  padding: 15px 20px;
}

.history-content {
  display: flex;
  flex-direction: column;
}

.timestamp {
  color: #8E8E93;
  font-size: 16px;
  margin-bottom: 5px;
}

.result {
  color: #000000;
  font-size: 22px;
  font-weight: 400;
}

.calculation {
  color: #8E8E93;
  font-size: 16px;
  margin-top: 2px;
}

.separator {
  height: 1px;
  background-color: #E5E5E7;
  margin-top: 15px;
}

.empty-history {
  padding: 20px;
  text-align: center;
  color: #8E8E93;
}

/* 按钮点击效果 */
.clear-button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-out;
  background-color: rgba(255, 59, 48, 0.2);
}

.close-button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-out;
  background-color: rgba(142, 142, 147, 0.1);
}
</style> 