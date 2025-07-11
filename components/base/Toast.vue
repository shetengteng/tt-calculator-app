<template>
  <view v-if="visible" class="toast-overlay" :class="{ 'toast-show': show }">
    <view class="toast-container" :class="`toast-${type}`" :style="{ borderColor: iconColor }">
      <view class="toast-icon" v-if="showIcon">
        <SvgIcon 
          :name="iconName" 
          :color="iconColor"
          size="40"
        />
      </view>
      <text class="toast-text">{{ message }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SvgIcon from '@/components/base/SvgIcon.vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'success', // success, error, warning, info
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 2000
  }
})

// Emits
const emit = defineEmits(['hide'])

// 状态
const show = ref(false)
let hideTimer = null

// 计算图标
const iconName = computed(() => {
  const iconMap = {
    success: 'ri-check-line',
    error: 'ri-close-line',
    warning: 'ri-alert-line',
    info: 'ri-information-line'
  }
  return iconMap[props.type] || iconMap.success
})

// 计算图标颜色 - 使用主题颜色
const iconColor = computed(() => {
  const colorMap = {
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#faad14',
    info: '#1890ff'
  }
  return colorMap[props.type] || colorMap.success
})

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    showToast()
  } else {
    hideToast()
  }
})

// 显示Toast
const showToast = () => {
  clearTimer()
  
  // 立即显示
  show.value = true
  
  // 设置自动隐藏
  if (props.duration > 0) {
    hideTimer = setTimeout(() => {
      hideToast()
    }, props.duration)
  }
}

// 隐藏Toast
const hideToast = () => {
  show.value = false
  clearTimer()
  
  // 等待动画完成后通知父组件
  setTimeout(() => {
    emit('hide')
  }, 300)
}

// 清除定时器
const clearTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// 手动点击隐藏
const handleClick = () => {
  hideToast()
}

// 组件卸载时清理
import { onUnmounted } from 'vue'
onUnmounted(() => {
  clearTimer()
})
</script>

<style scoped lang="scss">
.toast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.toast-overlay.toast-show {
  opacity: 1;
  transform: scale(1);
}

.toast-container {
  background: var(--settings-card-background);
  color: var(--settings-text-primary);
  padding: 24rpx 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  max-width: 80%;
  min-width: 200rpx;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20rpx);
  pointer-events: auto;
  border: none;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
}

.toast-text {
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  color: var(--settings-text-primary);
}
</style> 