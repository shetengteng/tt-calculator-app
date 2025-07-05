<template>
  <BaseSettingItem 
    :title="t('settings.clearHistory')" 
    icon="ri-delete-bin-line"
    :clickable="true"
    :isDanger="true"
    :showChevron="true"
    @click="handleClearHistory"
  >
    <template #control>
      <!-- 不需要额外的控件，因为已经有chevron了 -->
    </template>
  </BaseSettingItem>
  
  <!-- 自定义确认弹框 -->
  <view class="modal-overlay" v-if="showConfirmModal" @click="hideConfirmModal">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <text class="modal-title">{{ t('settings.confirmClear') }}</text>
      </view>
      <view class="modal-body">
        <text class="modal-text">{{ t('settings.confirmClearContent') }}</text>
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
</template>

<script setup>
import { ref } from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import { useI18n } from '@/composables/useI18n.js'

// Props
const props = defineProps({
  calculator: {
    type: Object,
    required: true
  }
})

// 使用国际化
const { t } = useI18n()

// 弹框状态
const showConfirmModal = ref(false)

// 清除历史记录处理
const handleClearHistory = () => {
  showConfirmModal.value = true
}

// 隐藏确认弹框
const hideConfirmModal = () => {
  showConfirmModal.value = false
}

// 确认清除历史记录
const confirmClearHistory = () => {
  // 直接调用计算器实例的清除历史方法
  if (props.calculator && typeof props.calculator.clearHistory === 'function') {
    props.calculator.clearHistory()
  }
  
  uni.showToast({
    title: t('settings.historyCleared'),
    icon: 'success'
  })
  
  hideConfirmModal()
}
</script>

<style scoped lang="scss">
.picker-arrow {
  font-size: 32rpx;
  color: var(--theme-light-gray);
  margin-left: 10rpx;
}

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
  border-top: 1px solid var(--settings-separator);
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
  border-right: 1px solid var(--settings-separator);
}

.confirm-button .button-text {
  color: var(--settings-danger-color);
  font-weight: 500;
}

.button-text {
  font-size: 30rpx;
  color: var(--settings-text-primary);
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