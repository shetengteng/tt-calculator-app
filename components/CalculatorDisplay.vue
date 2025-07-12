<template>
  <view class="display-section">
    <view class="temp-records-container">
      <scroll-view class="temp-records" scroll-y="true" scroll-x="true" show-scrollbar="false"
        :scroll-into-view="lastItemId" :enhanced="true" :bounces="false">
        <view v-for="(record, index) in tempRecords" :key="index" class="temp-record-item" :id="'temp-record-' + index">
          <text class="temp-record-expression">{{ expressionDisplay(record.expression) }}</text>
          <text class="temp-record-result">= {{ record.result }}</text>
        </view>
        <!-- 底部空白元素用于滚动定位 -->
        <view :id="'temp-record-' + (tempRecords.length)" class="scroll-anchor"></view>
      </scroll-view>
    </view>
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

const { expressionParts, expressionDisplay, error, tempRecords } = useCalculator()
const expression = computed(() => {
  return expressionDisplay(expressionParts.value)
})

const scrollPosition = ref(9999)
const tempRecordsScrollTop = ref(0)

// 监听表达式变化，自动滚动到最右侧
watch(() => expression.value, () => {
  nextTick(() => {
    const textLength = expression.value.length
    scrollPosition.value = textLength * 30 // 粗略估计每个字符的宽度
  })
}, { immediate: true })

// 监听tempRecords变化，自动滚动到底部
const lastItemId = ref('')
watch(() => tempRecords.value.length, (newLength) => {
  // 使用 scroll-into-view 功能滚动到最后一个元素
  if (newLength == 0) return
  nextTick(() => {
    lastItemId.value = 'temp-record-' + (newLength - 1)
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
  flex: 1;
  padding: 20rpx 40rpx;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 20vh;
  max-height: 35vh;
}

.temp-records-container {
  flex: 1;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.temp-records {
  height: 100%;
  width: 100%;
  flex-direction: column;
}

.temp-record-item {
  padding: 6rpx 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.temp-record-expression {
  color: var(--theme-text-secondary);
  font-size: 24rpx;
  display: inline-block;
  width: max-content;
  text-align: right;
}

.temp-record-result {
  color: var(--theme-text-primary);
  font-size: 32rpx;
  font-weight: 500;
  display: inline-block;
  width: max-content;
  text-align: right;
}

/* 底部滚动锚点 */
.scroll-anchor {
  height: 1px;
  width: 100%;
}

.display-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
}

.current-display {
  margin-bottom: 20rpx;
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
    max-height: 40vh;
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
    min-height: 15vh;
    max-height: 25vh;
    padding: 10rpx 40rpx;
  }

  .result {
    font-size: calc(6vw + 32rpx);
  }
}

/* iPhone 4/4S 专门优化 - 严格控制显示区域高度 */
@include iphone4-optimization {
  .display-section {
    min-height: 12vh !important;
    max-height: 18vh !important;
    padding: 10rpx 30rpx !important;
  }

  .result {
    font-size: calc(5.5vw + 28rpx) !important;
    line-height: 1.0 !important;
  }

  .current-display {
    margin-bottom: 10rpx !important;
  }

  .temp-record-expression {
    font-size: 20rpx !important;
  }

  .temp-record-result {
    font-size: 26rpx !important;
  }
}

/* iPhone 5/SE 专门优化 - 控制显示区域高度 */
@include iphone5-optimization {
  .display-section {
    min-height: 14vh !important;
    max-height: 22vh !important;
    padding: 12rpx 30rpx !important;
  }

  .result {
    font-size: calc(6vw + 30rpx) !important;
    line-height: 1.1 !important;
  }

  .current-display {
    margin-bottom: 12rpx !important;
  }

  .temp-record-expression {
    font-size: 22rpx !important;
  }

  .temp-record-result {
    font-size: 28rpx !important;
  }
}

/* 超小高度屏幕 - 进一步减少显示区域 */
@include extra-low-height-screen {
  .display-section {
    min-height: 10vh !important;
    max-height: 15vh !important;
    padding: 6rpx 30rpx !important;
  }

  .result {
    font-size: calc(5vw + 24rpx) !important;
  }

  .temp-record-item {
    padding: 4rpx 0 !important;
  }

  .temp-record-expression {
    font-size: 18rpx !important;
  }

  .temp-record-result {
    font-size: 24rpx !important;
  }
}
</style>