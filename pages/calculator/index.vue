<template>
  <view class="calculator-container">
    <!-- 设置抽屉组件 -->
    <SettingsDrawer 
      :is-open="isSettingsOpen" 
      :calculator="calculator"
      @close="closeSettings"
    />
    
    <!-- 历史记录抽屉组件 -->
    <HistoryDrawer 
      :is-open="isHistoryOpen" 
      :calculator="calculator"
      @close="closeHistory"
    />
    
    <!-- 主计算器内容 -->
    <view 
      class="calculator" 
      :class="{ 
        'calculator-shifted-left': isSettingsOpen,
        'calculator-shifted-right': isHistoryOpen
      }"
      :style="{ background: '#2C2C2E' }"
    >
      <!-- 1. Header Section -->
      <CalculatorHeader 
        @settings-click="openSettings" 
        @history-click="openHistory"
      />
      
      <!-- 2. Display Section -->
      <CalculatorDisplay 
        :calculation="calculator.calculation"
        :result="calculator.result"
        :secondary-calculation="calculator.secondaryCalculation"
        :secondary-result="calculator.secondaryResult"
      />
      
      <!-- 3. Button Group Section -->
      <CalculatorButtonGrid 
        :calculator="calculator"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CalculatorHeader from '@/components/CalculatorHeader.vue'
import CalculatorDisplay from '@/components/CalculatorDisplay.vue'
import CalculatorButtonGrid from '@/components/CalculatorButtonGrid.vue'
import SettingsDrawer from '@/components/SettingsDrawer.vue'
import HistoryDrawer from '@/components/HistoryDrawer.vue'
import { useCalculator } from '@/composables/useCalculator.js'

// 使用计算器组合函数，获取完整的计算器实例
const calculator = useCalculator()

// 抽屉状态
const isSettingsOpen = ref(false)
const isHistoryOpen = ref(false)

// 打开设置抽屉
const openSettings = () => {
  // 如果历史记录抽屉打开，先关闭它
  if (isHistoryOpen.value) {
    isHistoryOpen.value = false
  }
  isSettingsOpen.value = true
}

// 关闭设置抽屉
const closeSettings = () => {
  isSettingsOpen.value = false
}

// 打开历史记录抽屉
const openHistory = () => {
  // 如果设置抽屉打开，先关闭它
  if (isSettingsOpen.value) {
    isSettingsOpen.value = false
  }
  isHistoryOpen.value = true
}

// 关闭历史记录抽屉
const closeHistory = () => {
  isHistoryOpen.value = false
}

// 生命周期
onMounted(() => {
  calculator.initializeHistory()
})
</script>

<style lang="scss">
.calculator-container {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* 主计算器内容 */
.calculator {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 设置抽屉打开时向右滑动 */
.calculator.calculator-shifted-left {
  transform: translateX(80%);
}

/* 历史记录抽屉打开时向左滑动 */
.calculator.calculator-shifted-right {
  transform: translateX(-80%);
}

/* iPhone 4/4S 专门优化 - 确保按钮网格贴近底部 */
@include iphone4-optimization {
  .calculator {
    justify-content: space-between;
  }
  
  .calculator.calculator-shifted-left {
    transform: translateX(85%);
  }
  
  .calculator.calculator-shifted-right {
    transform: translateX(-85%);
  }
}

/* iPhone 5/SE 专门优化 - 确保按钮网格贴近底部 */
@include iphone5-optimization {
  .calculator {
    justify-content: space-between;
  }
  
  .calculator.calculator-shifted-left {
    transform: translateX(85%);
  }
  
  .calculator.calculator-shifted-right {
    transform: translateX(-85%);
  }
}

/* 小屏幕适配 */
@include small-phone {
  .calculator.calculator-shifted-left {
    transform: translateX(85%);
  }
  
  .calculator.calculator-shifted-right {
    transform: translateX(-85%);
  }
}
</style> 