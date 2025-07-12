<template>
  <view class="display-section">
    <view class="display-container">
      <scroll-view
          class="current-display"
          :class="{ 'shake-animation': error }"
          scroll-x="true"
          scroll-with-animation="true"
          :scroll-left="scrollPosition"
          show-scrollbar="false"
          ref="displayScrollView">
        <text class="result"
              :class="{ 'error-text': error, [fontSizeClass]: true }"
              ref="resultText">
          {{ expression }}
        </text>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import {computed, nextTick, ref, watch} from 'vue'
import {useSettings} from '@/composables/useSettings.js'
import {useCalculator} from '@/composables/useCalculator.js'

// 获取用户设置
const {settings} = useSettings()

const {expressionParts, expressionDisplay, error} = useCalculator()
const expression = computed(() => {
  return expressionDisplay(expressionParts.value)
})

// 创建引用和滚动位置
const displayScrollView = ref(null)
const resultText = ref(null)
const scrollPosition = ref(9999)

// 监听表达式变化，自动滚动到最右侧
watch(() => expression.value, () => {
  nextTick(() => {
    // updateScrollPosition()
    const textLength = expression.value.length
    scrollPosition.value = textLength * 30 // 粗略估计每个字符的宽度
  })
}, {immediate: true})

// 更新滚动位置
// const updateScrollPosition = () => {
//   // 在下一个渲染周期中获取滚动区域的尺寸信息
//   nextTick(() => {
//     // 某些平台可能需要使用不同的API获取元素尺寸
//     // #ifdef H5 || APP-PLUS
//     if (resultText.value && resultText.value.$el) {
//       const textWidth = resultText.value.$el.offsetWidth || 0
//       const scrollWidth = displayScrollView.value.$el.offsetWidth || 0
//       if (textWidth > scrollWidth) {
//         scrollPosition.value = textWidth - scrollWidth + 30 // 添加一些额外空间
//       }
//     }
//     // #endif
//
//     // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
//     // 微信小程序和其他小程序平台使用SelectorQuery获取元素尺寸
//     uni.createSelectorQuery()
//       .in(this)
//       .select('.result')
//       .boundingClientRect(textRect => {
//         uni.createSelectorQuery()
//           .in(this)
//           .select('.current-display')
//           .boundingClientRect(scrollRect => {
//             if (textRect && scrollRect && textRect.width > scrollRect.width) {
//               scrollPosition.value = textRect.width - scrollRect.width + 30 // 添加一些额外空间
//             }
//           })
//           .exec()
//       })
//       .exec()
//     // #endif
//
//     // 兜底方案：如果无法获取实际尺寸，根据文本长度估算
//     if (scrollPosition.value === 9999) {
//       const textLength = expression.value.length
//       scrollPosition.value = textLength * 20 // 粗略估计每个字符的宽度
//     }
//   })
// }

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
}
</style>