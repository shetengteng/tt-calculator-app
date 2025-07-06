<template>
  <view class="copy-button" @click="handleCopy">
    <SvgIcon 
      :name="currentIcon" 
      color="var(--settings-text-secondary)"
      size="28rpx"
    />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import SvgIcon from '@/components/base/SvgIcon.vue'

// Props
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  successMessage: {
    type: String,
    default: 'Copied to clipboard'
  },
  failMessage: {
    type: String,
    default: 'Copy failed'
  },
  resetDelay: {
    type: Number,
    default: 2000
  }
})

// Emits
const emit = defineEmits(['copy-success', 'copy-fail'])

// 状态
const isCopied = ref(false)
const resetTimer = ref(null)

// 计算当前图标
const currentIcon = computed(() => {
  return isCopied.value ? 'ri-check-line' : 'ri-file-copy-line'
})

// 处理复制
const handleCopy = async () => {
  try {
    await uni.setClipboardData({
      data: props.text,
      success: () => {
        isCopied.value = true
        
        // 显示成功提示
        uni.showToast({
          title: props.successMessage,
          icon: 'none',
          duration: 1500
        })
        
        // 触发成功事件
        emit('copy-success', props.text)
        
        // 清除之前的定时器
        if (resetTimer.value) {
          clearTimeout(resetTimer.value)
        }
        
        // 设置还原定时器
        resetTimer.value = setTimeout(() => {
          isCopied.value = false
          resetTimer.value = null
        }, props.resetDelay)
      },
      fail: (error) => {
        uni.showToast({
          title: props.failMessage,
          icon: 'none',
          duration: 1500
        })
        
        // 触发失败事件
        emit('copy-fail', error)
      }
    })
  } catch (error) {
    uni.showToast({
      title: props.failMessage,
      icon: 'none',
      duration: 1500
    })
    
    // 触发失败事件
    emit('copy-fail', error)
  }
}

// 组件销毁时清理定时器
const cleanup = () => {
  if (resetTimer.value) {
    clearTimeout(resetTimer.value)
    resetTimer.value = null
  }
}

// 监听组件卸载
import { onUnmounted } from 'vue'
onUnmounted(() => {
  cleanup()
})
</script>

<style scoped lang="scss">
.copy-button {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  background: transparent;
  transition: all 0.2s ease;
  margin-left: 8rpx;
  cursor: pointer;
}

.copy-button:active {
  background: var(--settings-separator);
  transform: scale(0.95);
}

.copy-button:hover {
  background: var(--settings-separator);
}
</style> 