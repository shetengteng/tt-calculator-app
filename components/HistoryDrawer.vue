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
          <text class="drawer-title">{{ t('history.title') }}</text>
          <view class="header-actions">
            <text class="clear-button" @click="clearAllHistory" v-if="hasHistory">{{ t('history.clear') }}</text>
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
              <text class="empty-text">{{ t('history.empty') }}</text>
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
    
    <!-- 自定义确认弹框 -->
    <view class="modal-overlay" v-if="showConfirmModal" @click="hideConfirmModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ t('history.clear') }}</text>
        </view>
        <view class="modal-body">
          <text class="modal-text">{{ t('messages.historyClearConfirm') }}</text>
        </view>
        <view class="modal-footer">
          <view class="modal-button cancel-button" @click="hideConfirmModal">
            <text class="button-text">{{ t('common.cancel') }}</text>
          </view>
          <view class="modal-button confirm-button" @click="confirmClearHistory">
            <text class="button-text">{{ t('common.confirm') }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import CloseButton from './CloseButton.vue'
import { useI18n } from '@/composables/useI18n.js'

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

// 使用国际化系统
const { t } = useI18n()

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
  showConfirmModal.value = true
}

// 弹框状态
const showConfirmModal = ref(false)

// 隐藏确认弹框
const hideConfirmModal = () => {
  showConfirmModal.value = false
}

// 确认清除历史记录
const confirmClearHistory = () => {
  history.value = []
  uni.removeStorageSync('calculatorHistory')
  
  // 同时清除计算器实例中的历史记录
  if (props.calculator && typeof props.calculator.clearHistory === 'function') {
    props.calculator.clearHistory()
  }
  
  uni.showToast({
    title: t('history.cleared'),
    icon: 'success',
    duration: 1500
  })
  
  hideConfirmModal()
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
  background: var(--theme-drawer-background);
  z-index: 1000;
  transition: right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: -2px 0 10px var(--theme-shadow-color, rgba(0, 0, 0, 0.1));
}

.history-drawer.drawer-open {
  right: 0;
}

.drawer-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 40rpx;
  padding-top: calc(20rpx + var(--status-bar-height));
  background: var(--theme-drawer-header);
  border-bottom: 1px solid var(--theme-separator);
}

.drawer-title {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--theme-text-primary);
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
  /* 修复宽度问题 - 确保不超过父容器宽度 */
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.history-list {
  padding: 20rpx 0;
}

.history-item {
  padding: 30rpx 40rpx;
  background: var(--theme-drawer-item-background);
  border-bottom: 1px solid var(--theme-separator);
  transition: background-color 0.2s ease;
}

.history-item:active {
  background: var(--theme-drawer-item-hover);
}

.history-content {
  display: flex;
  flex-direction: column;
}

.timestamp {
  color: var(--theme-light-gray);
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.result {
  color: var(--theme-text-primary);
  font-size: 44rpx;
  font-weight: 400;
  margin-bottom: 4rpx;
}

.calculation {
  color: var(--theme-light-gray);
  font-size: 28rpx;
}

.separator {
  height: 1rpx;
  background: var(--theme-separator);
  margin: 30rpx 40rpx 0 40rpx;
}

.empty-history {
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-text {
  color: var(--theme-light-gray);
  font-size: 32rpx;
}

/* 遮罩层 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: var(--theme-overlay);
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

/* 超小高度屏幕 */
@include extra-low-height-screen {
  .history-drawer {
    width: 50rpx !important;
    height: 50rpx !important;
    padding: 10rpx !important;
  }
  
  .icon-svg {
    width: 32rpx !important;
    height: 32rpx !important;
  }
}

/* 自定义弹框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001; /* 确保在抽屉之上 */
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--theme-drawer-item-background);
  border-radius: 24rpx;
  width: 560rpx;
  max-width: 90%;
  overflow: hidden;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

.modal-header {
  padding: 40rpx 40rpx 20rpx;
  text-align: center;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--theme-text-primary);
}

.modal-body {
  padding: 0 40rpx 40rpx;
  text-align: center;
}

.modal-text {
  font-size: 28rpx;
  color: var(--theme-text-muted);
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  border-top: 1px solid var(--theme-separator);
}

.modal-button {
  flex: 1;
  padding: 32rpx;
  text-align: center;
  transition: background-color 0.2s ease;
}

.modal-button:active {
  background: var(--theme-overlay);
}

.cancel-button {
  border-right: 1px solid var(--theme-separator);
}

.confirm-button .button-text {
  color: #FF3B30;
  font-weight: 500;
}

.button-text {
  font-size: 30rpx;
  color: var(--theme-text-primary);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style> 