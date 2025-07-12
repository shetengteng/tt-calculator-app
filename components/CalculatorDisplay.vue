<template>
  <view class="display-section">
    <view class="display-container">
      <scroll-view class="current-display" :class="{ 'shake-animation': error }" scroll-x="true"
        scroll-with-animation="true" :scroll-left="scrollPosition" show-scrollbar="false">
        <text class="result" :class="{ 'error-text': error, [fontSizeClass]: true }">
          {{ expression }}
        </text>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useSettings } from '@/composables/useSettings.js'
import { useCalculator } from '@/composables/useCalculator.js'

// 获取用户设置
const { settings } = useSettings()

const { expressionParts, expressionDisplay, error } = useCalculator()
const expression = computed(() => {
  return expressionDisplay(expressionParts.value)
})

const scrollPosition = ref(9999)

// 监听表达式变化，自动滚动到最右侧
watch(() => expression.value, () => {
  nextTick(() => {
    const textLength = expression.value.length
    scrollPosition.value = textLength * 30 // 粗略估计每个字符的宽度
  })
}, { immediate: true })

// 字体大小调整
const fontSizeClass = computed(() => {
  const length = expression.value.length;
  if (length > 50) return 'text-scale-xl';
  if (length > 30) return 'text-scale-l';
  if (length > 20) return 'text-scale-m';
  if (length > 15) return 'text-scale-s';
  if (length > 10) return 'text-scale';
  return '';
})
</script>

<style scoped lang="scss">
/* 错误晃动动画 */
@keyframes shake {
  0% {
    transform: translateX(0);
  }

  10%,
  90% {
    transform: translateX(-10rpx);
  }

  20%,
  80% {
    transform: translateX(10rpx);
  }

  30%,
  50%,
  70% {
    transform: translateX(-8rpx);
  }

  40%,
  60% {
    transform: translateX(8rpx);
  }

  100% {
    transform: translateX(0);
  }
}

.shake-animation {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

.error-text {
  color: var(--theme-error, #ff4d4f) !important;
}

.display-section {
  /* 移除 flex: 1，它会导致高度设置无效 */
  padding: 0 40rpx;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100rpx; /* 保持较小的高度 */
}

.display-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
}

.current-display {
  width: 100%;
  white-space: nowrap;
}

.result {
  color: var(--theme-text-primary);
  font-size: calc(7vw + 40rpx);
  font-weight: 300;
  line-height: 1.3;
  transition: font-size 0.2s ease;
  white-space: nowrap;
  text-align: right;
  display: inline-block;
  width: max-content;
  padding-left: 5rpx;
  padding-right: 20rpx;
}

/* 文本缩放类 */
.text-scale {
  font-size: calc(6.2vw + 36rpx);
}

/* 文本超长时的额外缩放 */
.text-scale-s {
  font-size: calc(5.5vw + 32rpx);
}

.text-scale-m {
  font-size: calc(4.8vw + 28rpx);
}

.text-scale-l {
  font-size: calc(4.2vw + 24rpx);
}

.text-scale-xl {
  font-size: calc(3.6vw + 20rpx);
}

/* 响应式设计 */
@include extra-small-screen {
  .result {
    font-size: calc(6vw + 32rpx);
  }
}

@include tablet-screen {
  .display-section {
    height: 150rpx; /* 从180rpx减小到150rpx */
  }

  .result {
    font-size: calc(4vw + 48rpx);
  }
}

@include desktop-screen {
  .result {
    font-size: calc(3vw + 56rpx);
  }
}

/* 低高度屏幕适配 */
@include low-height-screen {
  .display-section {
    height: 70rpx; /* 从120rpx减小到100rpx */
    padding: 10rpx 40rpx;
  }

  .result {
    font-size: calc(6vw + 32rpx);
  }
}

/* iPhone 4/4S 专门优化 - 严格控制显示区域高度 */
@include iphone4-optimization {
  .display-section {
    height: 50rpx; /* 从100rpx减小到80rpx */
    padding: 5rpx 30rpx;
  }

  .current-display {
    margin-bottom: 10rpx;
  }
}

/* iPhone 5/SE 专门优化 - 严格控制显示区域高度 */
@include iphone5-optimization {
  .display-section {
    height: 60rpx; /* 从110rpx减小到90rpx */
    padding: 8rpx 35rpx;
  }
}
</style>