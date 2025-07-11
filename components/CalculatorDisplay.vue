<template>
  <view class="display-section">
    <view class="display-container">
      <!-- Secondary calculation (previous operation) -->
      <view class="secondary-display" v-if="calculator.secondaryCalculation.value && calculator.secondaryResult.value && calculator.secondaryCalculation.value !== '' && calculator.secondaryResult.value !== '' && calculator.secondaryCalculation.value !== 'null' && calculator.secondaryResult.value !== 'null'">
        <text class="secondary-calculation">{{ calculator.secondaryCalculation.value || '' }}</text>
        <text class="secondary-result">{{ calculator.secondaryResult.value || '0' }}</text>
      </view>
      
      <!-- Current calculation -->
      <view class="current-display">
        <text class="calculation" v-if="calculator.calculation.value && calculator.calculation.value !== '' && calculator.calculation.value !== 'null'">{{ calculator.calculation.value || '' }}</text>
        <text class="result" v-else>{{ displayResult }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { calculator } from '@/composables/useCalculator.js'
import { useSettings } from '@/composables/useSettings.js'

// 获取用户设置
const { settings } = useSettings()

// 格式化显示结果
const displayResult = computed(() => {
  // 处理特殊情况
  if (calculator.result.value === 'Error') {
    return 'Error'
  }
  
  if (calculator.result.value === null || calculator.result.value === undefined || calculator.result.value === '') {
    return '0'
  }
  
  // 获取数值
  const num = parseFloat(String(calculator.result.value))
  if (isNaN(num)) return '0'
  
  // 处理科学计数法情况
  if (Math.abs(num) >= 1e10 || (Math.abs(num) < 0.0001 && Math.abs(num) > 0)) {
    return num.toExponential(settings.decimalPlaces || 5)
  }
  
  // 处理小数位数和千位分隔符
  let formattedNum
  if (settings.decimalPlaces !== undefined && settings.decimalPlaces !== null) {
    formattedNum = num.toFixed(settings.decimalPlaces)
  } else {
    formattedNum = String(num)
  }
  
  // 应用千位分隔符（如果设置启用）
  if (settings.thousandSeparator) {
    const parts = formattedNum.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    formattedNum = parts.join('.')
  }
  
  return formattedNum
})
</script>

<style scoped lang="scss">
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
}

.secondary-display {
  color: var(--theme-text-muted);
  font-size: calc(2.5vw + 16rpx);
  margin-bottom: 8rpx;
}

.secondary-calculation {
  color: var(--theme-text-muted);
  font-size: calc(2.5vw + 16rpx);
  margin-bottom: 4rpx;
}

.secondary-result {
  color: var(--theme-text-primary);
  font-size: calc(4vw + 20rpx);
  margin-bottom: 20rpx;
}

.current-display {
  margin-bottom: 20rpx;
}

.calculation {
  color: var(--theme-text-muted);
  font-size: calc(3.5vw + 24rpx);
  margin-bottom: 10rpx;
  min-height: 40rpx;
}

.result {
  color: var(--theme-text-primary);
  font-size: calc(7vw + 40rpx);
  font-weight: 300;
  line-height: 1.1;
}

/* 响应式设计 */
@include extra-small-screen {
  .result {
    font-size: calc(6vw + 32rpx);
  }
  
  .calculation {
    font-size: calc(3vw + 20rpx);
  }
  
  .secondary-calculation {
    font-size: calc(2vw + 12rpx);
  }
  
  .secondary-result {
    font-size: calc(3.5vw + 16rpx);
  }
}

@include tablet-screen {
  .display-section {
    max-height: 40vh;
  }
  
  .result {
    font-size: calc(4vw + 48rpx);
  }
  
  .calculation {
    font-size: calc(2.5vw + 32rpx);
  }
}

@include desktop-screen {
  .result {
    font-size: calc(3vw + 56rpx);
  }
  
  .calculation {
    font-size: calc(2vw + 36rpx);
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
  
  .calculation {
    font-size: calc(3vw + 20rpx);
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
  
  .calculation {
    font-size: calc(2.8vw + 16rpx) !important;
    margin-bottom: 6rpx !important;
    min-height: 36rpx !important;
  }
  
  .secondary-display {
    font-size: calc(2.2vw + 12rpx) !important;
    margin-bottom: 4rpx !important;
  }
  
  .secondary-calculation {
    font-size: calc(2vw + 10rpx) !important;
    margin-bottom: 2rpx !important;
  }
  
  .secondary-result {
    font-size: calc(3vw + 12rpx) !important;
    margin-bottom: 10rpx !important;
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
  
  .calculation {
    font-size: calc(3vw + 18rpx) !important;
    margin-bottom: 8rpx !important;
    min-height: 38rpx !important;
  }
  
  .secondary-display {
    font-size: calc(2.3vw + 14rpx) !important;
    margin-bottom: 6rpx !important;
  }
  
  .secondary-calculation {
    font-size: calc(2.1vw + 12rpx) !important;
    margin-bottom: 4rpx !important;
  }
  
  .secondary-result {
    font-size: calc(3.2vw + 14rpx) !important;
    margin-bottom: 12rpx !important;
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