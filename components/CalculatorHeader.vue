<template>
  <view class="header-section">
    <view class="header-left">
      <text class="app-title">Calculator</text>
    </view>
    <view class="header-right">
      <view class="header-button" @click="handleCopy">
        <text class="icon icon-copy">📋</text>
        <text class="button-label">Copy</text>
      </view>
      <view class="header-button" @click="handleHistory">
        <text class="icon icon-history">🕒</text>
        <text class="button-label">History</text>
      </view>
    </view>
  </view>
</template>

<script setup>
// 定义事件
const emit = defineEmits(['copy', 'history'])

// 处理复制事件
const handleCopy = () => {
  emit('copy')
}

// 处理历史记录事件
const handleHistory = () => {
  emit('history')
}
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  padding-top: calc(30rpx + var(--status-bar-height));
  color: #FFFFFF;
  background-color: #2C2C2E;
  flex-shrink: 0;
  min-height: 120rpx;
}

.header-left {
  flex: 1;
}

.app-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.header-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx;
  border-radius: 16rpx;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.header-button:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.icon {
  font-size: 48rpx;
  color: #FFFFFF;
}

.button-label {
  font-size: 24rpx;
  color: #FFFFFF;
  margin-top: 4rpx;
}

/* 低高度屏幕适配 */
@media screen and (max-height: 600px) {
  .header-section {
    padding: 10rpx 40rpx;
    padding-top: calc(10rpx + var(--status-bar-height));
    min-height: 100rpx;
  }
  
  .app-title {
    font-size: 32rpx;
  }
  
  .icon {
    font-size: 40rpx;
  }
  
  .button-label {
    font-size: 20rpx;
  }
}

/* iPhone 4/4S 专门优化 - 最小化header高度 */
@media screen and (max-width: 320px) and (max-height: 480px) {
  .header-section {
    padding: 6rpx 30rpx !important;
    padding-top: calc(6rpx + var(--status-bar-height)) !important;
    min-height: 80rpx !important;
  }
  
  .app-title {
    font-size: 28rpx !important;
    font-weight: 500 !important;
  }
  
  .header-right {
    gap: 16rpx !important;
  }
  
  .header-button {
    padding: 4rpx !important;
  }
  
  .icon {
    font-size: 32rpx !important;
  }
  
  .button-label {
    font-size: 16rpx !important;
    margin-top: 2rpx !important;
  }
}

/* 超小高度屏幕 */
@media screen and (max-height: 430px) {
  .header-section {
    padding: 4rpx 30rpx !important;
    padding-top: calc(4rpx + var(--status-bar-height)) !important;
    min-height: 70rpx !important;
  }
  
  .app-title {
    font-size: 24rpx !important;
  }
  
  .icon {
    font-size: 28rpx !important;
  }
  
  .button-label {
    display: none !important;
  }
}
</style> 