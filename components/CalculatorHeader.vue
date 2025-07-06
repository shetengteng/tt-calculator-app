<template>
  <view class="header-section">
    <view class="header-left">
      <view class="setting-button" @click="handleSettings">
        <view class="icon-svg">
          <SvgIcon name="ri-settings-line" size="48rpx" color="currentColor" />
        </view>
      </view>
    </view>
    <view class="header-right">
      <view class="history-button" @click="handleHistory">
        <view class="icon-svg">
          <SvgIcon name="ri-time-line" size="48rpx" color="currentColor" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'

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

.setting-button,
.history-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  cursor: pointer;
  width: 80rpx;
  height: 80rpx;
}

.setting-button:active,
.history-button:active {
  background-color: var(--theme-overlay);
}

.icon-svg {
  width: 48rpx;
  height: 48rpx;
  color: var(--theme-text-primary);
}

.icon-svg svg {
  width: 100%;
  height: 100%;
}

/* 低高度屏幕适配 */
@include low-height-screen {
  .header-section {
    padding: 10rpx 40rpx;
    padding-top: calc(10rpx + var(--status-bar-height));
    min-height: 100rpx;
  }
  
  .setting-button,
  .history-button {
    width: 70rpx;
    height: 70rpx;
    padding: 15rpx;
  }
  
  .icon-svg {
    width: 40rpx;
    height: 40rpx;
  }
}

/* iPhone 4/4S 专门优化 - 最小化header高度 */
@include iphone4-optimization {
  .header-section {
    padding: 6rpx 30rpx !important;
    padding-top: calc(6rpx + var(--status-bar-height)) !important;
    min-height: 80rpx !important;
  }
  
  .setting-button,
  .history-button {
    width: 60rpx !important;
    height: 60rpx !important;
    padding: 12rpx !important;
  }
  
  .icon-svg {
    width: 36rpx !important;
    height: 36rpx !important;
  }
}

/* 超小高度屏幕 */
@include extra-low-height-screen {
  .header-section {
    padding: 4rpx 30rpx !important;
    padding-top: calc(4rpx + var(--status-bar-height)) !important;
    min-height: 70rpx !important;
  }
  
  .setting-button,
  .history-button {
    width: 50rpx !important;
    height: 50rpx !important;
    padding: 10rpx !important;
  }
  
  .icon-svg {
    width: 32rpx !important;
    height: 32rpx !important;
  }
}
</style> 