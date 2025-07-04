<template>
  <view class="display-section">
    <view class="display-container">
      <!-- Secondary calculation (previous operation) -->
      <view class="secondary-display" v-if="secondaryCalculation && secondaryResult && secondaryCalculation !== '' && secondaryResult !== ''">
        <text class="secondary-calculation">{{ secondaryCalculation }}</text>
        <text class="secondary-result">{{ secondaryResult }}</text>
      </view>
      
      <!-- Current calculation -->
      <view class="current-display">
        <text class="calculation" v-if="calculation && calculation !== ''">{{ calculation }}</text>
        <text class="result">{{ displayResult }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

// 定义组件属性
const props = defineProps({
  // 当前计算表达式
  calculation: {
    type: String,
    default: ''
  },
  // 计算结果
  result: {
    type: String,
    default: '0'
  },
  // 历史计算表达式
  secondaryCalculation: {
    type: String,
    default: ''
  },
  // 历史计算结果
  secondaryResult: {
    type: String,
    default: ''
  }
})

// 格式化显示结果
const displayResult = computed(() => {
  return formatNumber(props.result)
})

// 数字格式化函数
const formatNumber = (value) => {
  if (value === 'Error') return value
  
  const num = parseFloat(String(value))
  if (isNaN(num)) return '0'
  
  // Check if scientific notation is needed
  if (Math.abs(num) >= 1e10 || (Math.abs(num) < 0.0001 && Math.abs(num) > 0)) {
    return num.toExponential(5)
  }
  
  // Format with commas
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}
</script>

<style scoped>
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
  color: #8E8E93;
  font-size: calc(2.5vw + 16rpx);
  margin-bottom: 8rpx;
}

.secondary-calculation {
  color: #8E8E93;
  font-size: calc(2.5vw + 16rpx);
  margin-bottom: 4rpx;
}

.secondary-result {
  color: #FFFFFF;
  font-size: calc(4vw + 20rpx);
  margin-bottom: 20rpx;
}

.current-display {
  margin-bottom: 20rpx;
}

.calculation {
  color: #8E8E93;
  font-size: calc(3.5vw + 24rpx);
  margin-bottom: 10rpx;
  min-height: 40rpx;
}

.result {
  color: #FFFFFF;
  font-size: calc(7vw + 40rpx);
  font-weight: 300;
  line-height: 1.1;
}

/* 响应式设计 */
@media screen and (max-width: 320px) {
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

@media screen and (min-width: 768px) {
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

@media screen and (min-width: 1024px) {
  .result {
    font-size: calc(3vw + 56rpx);
  }
  
  .calculation {
    font-size: calc(2vw + 36rpx);
  }
}

/* 低高度屏幕适配 */
@media screen and (max-height: 600px) {
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
@media screen and (max-width: 320px) and (max-height: 480px) {
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

/* 超小高度屏幕 - 进一步减少显示区域 */
@media screen and (max-height: 430px) {
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