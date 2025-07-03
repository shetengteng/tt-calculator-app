<template>
  <view class="button-group-section">
    <view class="button-grid">
      <!-- Row 1: Function buttons -->
      <CalculatorButton 
        :text="allClear ? 'AC' : 'C'" 
        theme="light" 
        action="clear"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="+/-" 
        theme="light" 
        action="toggle-sign"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="%" 
        theme="light" 
        action="percentage"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="÷" 
        theme="light" 
        action="operator"
        :active="currentOperator === '÷'" 
        @click="handleButtonClick"
      />
      
      <!-- Row 2: Numbers 7-9 and multiply -->
      <CalculatorButton 
        text="7" 
        theme="dark" 
        action="number"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="8" 
        theme="dark" 
        action="number"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="9" 
        theme="dark" 
        action="number"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="×" 
        theme="dark" 
        action="operator"
        :active="currentOperator === '×'" 
        @click="handleButtonClick"
      />
      
      <!-- Row 3: Numbers 4-6 and subtract -->
      <CalculatorButton 
        text="4" 
        theme="dark" 
        action="number"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="5" 
        theme="dark" 
        action="number"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="6" 
        theme="dark" 
        action="number"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="−" 
        theme="dark" 
        action="operator"
        :active="currentOperator === '−'" 
        @click="handleButtonClick"
      />
      
      <!-- Row 4: Numbers 1-3 and add -->
      <CalculatorButton 
        text="1" 
        theme="dark" 
        action="number"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="2" 
        theme="dark" 
        action="number"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="3" 
        theme="dark" 
        action="number"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="+" 
        theme="dark" 
        action="operator"
        :active="currentOperator === '+'" 
        @click="handleButtonClick"
      />
      
      <!-- Row 5: Zero, decimal, backspace and equals -->
      <CalculatorButton 
        text="0" 
        theme="dark" 
        action="number"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="." 
        theme="dark" 
        action="decimal"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="←" 
        theme="dark" 
        action="backspace"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="=" 
        theme="blue" 
        action="equals"
        @click="handleButtonClick"
      />
    </view>
  </view>
</template>

<script setup>
import CalculatorButton from './CalculatorButton.vue'
import { useCalculator } from '@/composables/useCalculator.js'

// 定义组件属性 - 现在只需要传入计算器实例
const props = defineProps({
  // 计算器实例，包含所有状态和方法
  calculator: {
    type: Object,
    required: true
  }
})

// 从计算器实例解构需要的状态和方法
const {
  currentOperator,
  allClear,
  appendNumber,
  appendDecimal,
  setOperator,
  calculate,
  clear,
  toggleSign,
  percentage,
  backspace
} = props.calculator

// 处理按钮点击事件 - 直接调用计算器方法
const handleButtonClick = (buttonData) => {
  const { text, action } = buttonData
  
  switch (action) {
    case 'number':
      appendNumber(text)
      break
    case 'operator':
      setOperator(text)
      break
    case 'clear':
      clear()
      break
    case 'toggle-sign':
      toggleSign()
      break
    case 'percentage':
      percentage()
      break
    case 'equals':
      calculate()
      break
    case 'decimal':
      appendDecimal()
      break
    case 'backspace':
      backspace()
      break
    default:
      console.log(`未处理的按钮动作: ${action}`)
  }
}
</script>

<style scoped>
.button-group-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx;
  padding-bottom: calc(40rpx + var(--window-bottom, 0px));
  flex-shrink: 0;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 20rpx;
  width: 100%;
  max-width: 640rpx;
  margin: 0 auto;
  place-items: center;
}

/* 小屏幕适配 */
@media screen and (max-width: 750rpx) {
  .button-group-section {
    padding: 30rpx;
    padding-bottom: calc(30rpx + var(--window-bottom, 0px));
  }
  
  .button-grid {
    gap: 16rpx;
    max-width: 520rpx;
  }
}

/* 超小屏幕适配 */
@media screen and (max-width: 640rpx) {
  .button-group-section {
    padding: 20rpx;
    padding-bottom: calc(20rpx + var(--window-bottom, 0px));
  }
  
  .button-grid {
    gap: 12rpx;
    max-width: 440rpx;
  }
}

/* iPhone 4/4S 专门优化 (320x480) - 按钮网格完全贴近底部 */
@media screen and (max-width: 320px) and (max-height: 480px) {
  .button-group-section {
    padding: 10rpx 20rpx 20rpx 20rpx;
    align-items: flex-end;
    justify-content: center;
    flex-grow: 1;
  }
  
  .button-grid {
    gap: 10rpx;
    max-width: 400rpx;
  }
}

/* 大屏幕适配 */
@media screen and (min-width: 1500rpx) {
  .button-group-section {
    padding: 60rpx;
    padding-bottom: calc(60rpx + var(--window-bottom, 0px));
  }
  
  .button-grid {
    gap: 30rpx;
    max-width: 800rpx;
  }
}
</style> 