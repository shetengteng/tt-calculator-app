<template>
  <view class="close-button" @click="handleClick">
    <view class="icon-svg">
      <SvgIcon name="ri-close-line" size="48rpx" color="currentColor" />
    </view>
  </view>
</template>

<script setup>
import SvgIcon from '@/components/base/SvgIcon.vue'

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