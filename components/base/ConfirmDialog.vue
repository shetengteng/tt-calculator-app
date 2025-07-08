<template>
  <!-- 自定义确认弹框 -->
  <view class="modal-overlay" v-if="visible" @click="handleOverlayClick">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <text class="modal-title">{{ title }}</text>
      </view>
      <view class="modal-body">
        <text class="modal-text">{{ content }}</text>
      </view>
      <view class="modal-footer">
        <view class="modal-button cancel-button" @click="handleCancel">
          <text class="button-text">{{ defaultCancelText }}</text>
        </view>
        <view class="modal-button confirm-button" @click="handleConfirm">
          <text class="button-text" :class="{ 'danger-text': isDanger }">{{ defaultConfirmText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n.js'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: null
  },
  cancelText: {
    type: String,
    default: null
  },
  isDanger: {
    type: Boolean,
    default: false
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['confirm', 'cancel', 'close'])

// 使用国际化
const { t } = useI18n()

// 计算默认按钮文本
const defaultConfirmText = computed(() => {
  return props.confirmText || t('common.confirm')
})

const defaultCancelText = computed(() => {
  return props.cancelText || t('common.cancel')
})

// 处理确认
const handleConfirm = () => {
  emit('confirm')
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}

// 处理遮罩点击
const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    emit('close')
  }
}

// 导入computed
import { computed } from 'vue'
</script>

<style scoped lang="scss">
/* 自定义弹框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000; /* 确保在抽屉之上 */
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--settings-card-background);
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
  color: var(--settings-text-primary);
}

.modal-body {
  padding: 0 40rpx 40rpx;
  text-align: center;
}

.modal-text {
  font-size: 28rpx;
  color: var(--settings-text-secondary);
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  border-top: none;
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
  border-right: none;
}

.button-text {
  font-size: 30rpx;
  color: var(--settings-text-primary);
}

.danger-text {
  color: var(--settings-danger-color);
  font-weight: 500;
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