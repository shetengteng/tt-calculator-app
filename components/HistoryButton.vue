<template>
  <view class="history-button" @click="handleClick">
    <view class="icon-svg">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"/>
      </svg>
    </view>
  </view>
</template>

<script setup>
const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
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

.history-button:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.icon-svg {
  width: 48rpx;
  height: 48rpx;
  color: #FFFFFF;
}

.icon-svg svg {
  width: 100%;
  height: 100%;
}

/* 低高度屏幕适配 */
@media screen and (max-height: 600px) {
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

/* iPhone 4/4S 专门优化 */
@media screen and (max-width: 320px) and (max-height: 480px) {
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
@media screen and (max-height: 430px) {
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