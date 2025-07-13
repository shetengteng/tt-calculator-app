<template>
  <view class="display-section">
    <view class="display-container">
      <scroll-view class="current-display" scroll-x="true"
        scroll-with-animation="true" :scroll-left="scrollPosition" show-scrollbar="false">
        <text class="expression" :class="{ [expressionFontSizeClass]: true }">{{ expression }}</text>
      </scroll-view>
      <scroll-view class="current-display" scroll-x="true"
        scroll-with-animation="true" show-scrollbar="false">
        <text class="result" :class="{ 'error-text': error, [resultFontSizeClass]: true }">
          = {{ formatNumber(result) }}
        </text>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useCalculator } from '@/composables/useCalculator.js'
import { useDisplay } from '@/composables/useDisplay.js'

const { expressionParts, error, result } = useCalculator()
const { formatExpression, formatNumber } = useDisplay()

const expression = computed(() => {
  return formatExpression(expressionParts.value)
})

const scrollPosition = ref(9999)

// 监听表达式变化，自动滚动到最右侧
watch(() => expression.value, () => {
  nextTick(() => {
    const textLength = expression.value.length
    scrollPosition.value = textLength * 30 // 粗略估计每个字符的宽度
  })
}, { immediate: true })

// 表达式字体大小调整 - 比结果字体小
const expressionFontSizeClass = computed(() => {
  const length = expression.value.length;
  if (length > 50) return 'expression-scale-xl';
  if (length > 40) return 'expression-scale-l';
  if (length > 30) return 'expression-scale-m';
  if (length > 20) return 'expression-scale-s';
  return '';
})

// 结果字体大小调整 - 比表达式字体大
const resultFontSizeClass = computed(() => {
  const length = result.value.length;
  if (length > 50) return 'result-scale-xl';
  if (length > 30) return 'result-scale-l';
  if (length > 20) return 'result-scale-m';
  if (length > 15) return 'result-scale-s';
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
  padding: 0 40rpx;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 180rpx;
  /* 增加高度以确保两行显示 */
  box-sizing: border-box;
  border: none;
}

.display-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
}

.current-display {
  width: 100%;
  white-space: nowrap;
}

.expression {
  color: var(--theme-text-secondary, #999999);
  font-size: calc(4vw + 34rpx);
  /* 增大表达式字体 */
  font-weight: 300;
  line-height: 1.2;
  transition: font-size 0.2s ease;
  white-space: nowrap;
  text-align: right;
  display: inline-block;
  width: max-content;
  padding-left: 5rpx;
  padding-right: 20rpx;
}

.result {
  color: var(--theme-text-primary);
  font-size: calc(4vw + 36rpx);
  /* 比表达式字体大2rpx */
  font-weight: 500;
  /* 加粗结果字体 */
  line-height: 1.3;
  transition: font-size 0.2s ease;
  white-space: nowrap;
  text-align: right;
  padding: 20rpx;
}

/* 表达式文本缩放类 - 比结果字体小 */
.expression-scale {
  font-size: calc(3.7vw + 22rpx);
}

.expression-scale-s {
  font-size: calc(3.5vw + 20rpx);
}

.expression-scale-m {
  font-size: calc(3.3vw + 18rpx);
}

.expression-scale-l {
  font-size: calc(3vw + 16rpx);
}

.expression-scale-xl {
  font-size: calc(2.7vw + 14rpx);
}

/* 结果文本缩放类 - 比表达式字体大2rpx */
.result-scale {
  font-size: calc(3.7vw + 24rpx);
}

.result-scale-s {
  font-size: calc(3.5vw + 22rpx);
}

.result-scale-m {
  font-size: calc(3.3vw + 20rpx);
}

.result-scale-l {
  font-size: calc(3vw + 18rpx);
}

.result-scale-xl {
  font-size: calc(2.7vw + 16rpx);
}

/* 响应式设计 */
@include extra-small-screen {
  .expression {
    font-size: calc(3.5vw + 20rpx);
  }

  .result {
    font-size: calc(3.5vw + 22rpx);
  }
}

@include tablet-screen {
  .display-section {
    height: 220rpx;
    /* 增加高度以适应两行显示 */
  }

  .expression {
    font-size: calc(2.7vw + 30rpx);
  }

  .result {
    font-size: calc(2.7vw + 32rpx);
  }
}

@include desktop-screen {
  .expression {
    font-size: calc(2.3vw + 36rpx);
  }

  .result {
    font-size: calc(2.3vw + 38rpx);
  }
}

/* 低高度屏幕适配 */
@include low-height-screen {
  .display-section {
    height: 140rpx;
    /* 增加高度以适应两行显示 */
    padding: 10rpx 40rpx;
  }

  .expression {
    font-size: calc(3.3vw + 18rpx);
  }

  .result {
    font-size: calc(3.3vw + 20rpx);
  }
}

/* iPhone 4/4S 专门优化 - 严格控制显示区域高度 */
@include iphone4-optimization {
  .display-section {
    height: 120rpx;
    /* 增加高度以适应两行显示 */
    padding: 5rpx 30rpx;
  }

  .current-display {
    margin-bottom: 5rpx;
  }

  .expression {
    font-size: calc(3vw + 16rpx);
  }

  .result {
    font-size: calc(3vw + 18rpx);
  }
}

/* iPhone 5/SE 专门优化 - 严格控制显示区域高度 */
@include iphone5-optimization {
  .display-section {
    height: 130rpx;
    /* 增加高度以适应两行显示 */
    padding: 8rpx 35rpx;
  }

  .expression {
    font-size: calc(3.2vw + 18rpx);
  }

  .result {
    font-size: calc(3.2vw + 20rpx);
  }
}
</style>