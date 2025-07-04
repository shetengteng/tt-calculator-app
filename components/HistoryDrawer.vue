<template>
  <view class="drawer-container">
    <!-- 历史记录抽屉 -->
    <view 
      class="history-drawer" 
      :class="{ 'drawer-open': isOpen }"
      @touchstart="handleDrawerTouchStart"
      @touchmove="handleDrawerTouchMove"
      @touchend="handleDrawerTouchEnd"
    >
      <view class="drawer-content">
        <!-- 历史记录页面内容 -->
        <view class="drawer-header">
          <text class="drawer-title">History</text>
          <view class="header-actions">
            <text class="clear-button" @click="clearAllHistory" v-if="hasHistory">Clear</text>
            <CloseButton @click="closeDrawer" />
          </view>
        </view>
        
        <!-- 历史记录列表 -->
        <scroll-view class="drawer-scroll" scroll-y="true">
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
              <text class="empty-text">No calculation history</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 遮罩层 -->
    <view 
      class="drawer-overlay" 
      :class="{ 'overlay-visible': isOpen }"
      @click="closeDrawer"
    ></view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import CloseButton from './CloseButton.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  calculator: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close'])

// 历史记录数据
const history = ref([])

// 触摸相关
const touchStartX = ref(0)
const touchStartY = ref(0)

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

// 关闭抽屉
const closeDrawer = () => {
  emit('close')
}

// 复制结果到剪贴板
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

// 格式化时间戳
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

// 清除所有历史记录
const clearAllHistory = () => {
  uni.showModal({
    title: 'Clear History',
    content: 'Are you sure you want to clear all calculation history?',
    success: (res) => {
      if (res.confirm) {
        history.value = []
        uni.removeStorageSync('calculatorHistory')
        
        // 同时清除计算器实例中的历史记录
        if (props.calculator && typeof props.calculator.clearHistory === 'function') {
          props.calculator.clearHistory()
        }
        
        uni.showToast({
          title: 'History cleared',
          icon: 'success',
          duration: 1500
        })
      }
    }
  })
}

// 从本地存储加载历史记录
const loadHistory = () => {
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
}

// 触摸手势处理
const handleDrawerTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleDrawerTouchMove = (e) => {
  // 可以在这里添加手势拖拽逻辑
}

const handleDrawerTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  
  const deltaX = touchEndX - touchStartX.value
  const deltaY = touchEndY - touchStartY.value
  
  // 如果是向右滑动且水平距离大于垂直距离，关闭抽屉
  if (deltaX > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
    closeDrawer()
  }
}

// 监听抽屉打开状态，加载历史记录
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadHistory()
  }
}, { immediate: true })

// 监听历史记录变化
watch(history, (newHistory) => {
  console.log(`历史记录更新，当前有 ${newHistory.length} 条记录`)
}, { deep: true })

onMounted(() => {
  loadHistory()
})
</script>

<style scoped lang="scss">
.drawer-container {
  position: relative;
}

/* 历史记录抽屉 */
.history-drawer {
  position: fixed;
  top: 0;
  right: -80%;
  width: 80%;
  height: 100vh;
  background: #2C2C2E;
  z-index: 1000;
  transition: right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.history-drawer.drawer-open {
  right: 0;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 40rpx;
  padding-top: calc(20rpx + var(--status-bar-height));
  background: #2C2C2E;
  border-bottom: 1px solid #505050;
}

.drawer-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.clear-button {
  font-size: 28rpx;
  color: #FF3B30;
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
  background: rgba(255, 59, 48, 0.1);
  transition: background-color 0.2s ease;
}

.clear-button:active {
  background: rgba(255, 59, 48, 0.2);
}

.drawer-scroll {
  flex: 1;
}

.history-list {
  padding: 20rpx 0;
}

.history-item {
  padding: 30rpx 40rpx;
  background: #3A3A3C;
  border-bottom: 1px solid #505050;
  transition: background-color 0.2s ease;
}

.history-item:active {
  background: #48484A;
}

.history-content {
  display: flex;
  flex-direction: column;
}

.timestamp {
  color: #A6A6A6;
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.result {
  color: #FFFFFF;
  font-size: 44rpx;
  font-weight: 400;
  margin-bottom: 4rpx;
}

.calculation {
  color: #A6A6A6;
  font-size: 28rpx;
}

.separator {
  height: 1rpx;
  background: #505050;
  margin: 30rpx 40rpx 0 40rpx;
}

.empty-history {
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-text {
  color: #A6A6A6;
  font-size: 32rpx;
}

/* 遮罩层 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.drawer-overlay.overlay-visible {
  opacity: 1;
  visibility: visible;
}

/* 小屏幕适配 */
@include small-phone {
  .history-drawer {
    width: 85%;
    right: -85%;
  }
}

/* iPhone 4/4S 专门优化 */
@include iphone4-optimization {
  .history-drawer {
    width: 85%;
    right: -85%;
  }
}
</style> 