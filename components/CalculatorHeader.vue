<template>
  <view class="header-section">
    <view class="header-left">
      <SettingButton @click="handleSettings" />
    </view>
    <view class="header-right">
      <HistoryButton @click="handleHistory" />
    </view>
  </view>
</template>

<script setup>
import SettingButton from './SettingButton.vue'
import HistoryButton from './HistoryButton.vue'

// 定义事件
const emit = defineEmits(['settings-click', 'history-click'])

// 处理历史记录事件 - 发射事件而不是导航
const handleHistory = () => {
  emit('history-click')
}

// 处理设置事件 - 发射事件而不是导航
const handleSettings = () => {
  emit('settings-click')
}
</script>

<style scoped lang="scss">
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  padding-top: calc(30rpx + var(--status-bar-height));
  color: var(--theme-text-primary);
  background-color: var(--theme-primary-background);
  flex-shrink: 0;
  min-height: 120rpx;
}

.header-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

/* 低高度屏幕适配 */
@include low-height-screen {
  .header-section {
    padding: 10rpx 40rpx;
    padding-top: calc(10rpx + var(--status-bar-height));
    min-height: 100rpx;
  }
}

/* iPhone 4/4S 专门优化 - 最小化header高度 */
@include iphone4-optimization {
  .header-section {
    padding: 6rpx 30rpx !important;
    padding-top: calc(6rpx + var(--status-bar-height)) !important;
    min-height: 80rpx !important;
  }
}

/* 超小高度屏幕 */
@include extra-low-height-screen {
  .header-section {
    padding: 4rpx 30rpx !important;
    padding-top: calc(4rpx + var(--status-bar-height)) !important;
    min-height: 70rpx !important;
  }
}
</style> 