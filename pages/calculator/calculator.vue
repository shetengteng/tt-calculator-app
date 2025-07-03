<template>
  <view class="calculator" :style="{ background: '#2C2C2E' }">
    <!-- 1. Header Section -->
    <CalculatorHeader 
      @copy="calculator.copyResult"
      @history="calculator.showHistory"
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
</template>

<script setup>
import { onMounted } from 'vue'
import CalculatorHeader from '@/components/CalculatorHeader.vue'
import CalculatorDisplay from '@/components/CalculatorDisplay.vue'
import CalculatorButtonGrid from '@/components/CalculatorButtonGrid.vue'
import { useCalculator } from '@/composables/useCalculator.js'

// 使用计算器组合函数，获取完整的计算器实例
const calculator = useCalculator()

// 生命周期
onMounted(() => {
  calculator.initializeHistory()
})
</script>

<style>
.calculator {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}
</style> 