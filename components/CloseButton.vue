<template>
  <view class="close-button" @click="handleClick">
    <view class="icon-svg">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
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

<style scoped lang="scss">
.close-button {
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

.close-button:active {
  background-color: var(--theme-overlay);
}

.icon-svg {
  width: 48rpx;
  height: 48rpx;
  color: var(--theme-light-gray);
}

.icon-svg svg {
  width: 100%;
  height: 100%;
}

/* 低高度屏幕适配 */
@include low-height-screen {
  .close-button {
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
@include iphone4-optimization {
  .close-button {
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
  .close-button {
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