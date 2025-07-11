<template>
  <view class="calculator-container" :class="{[`${getCurrentPracticalTheme().class}`]: true}">
    <!-- 主计算器内容 -->
    <view
        class="calculator"
        :class="{
        'calculator-shifted-left': isSettingsOpen,
        'calculator-shifted-right': isHistoryOpen
      }"
    >
      <!-- 1. Header Section -->
      <CalculatorHeader
          @settings-click="openSettings"
          @history-click="openHistory"
      />

      <!-- 2. Display Section -->
      <CalculatorDisplay />

      <!-- 3. Button Group Section -->
      <CalculatorButtonGrid />

    </view>

    <!-- 设置抽屉组件 -->
    <SettingsDrawer
        :is-open="isSettingsOpen"
        @close="closeSettings"
    />

    <!-- 历史记录抽屉组件 -->
    <HistoryDrawer
        :is-open="isHistoryOpen"
        @close="closeHistory"
    />

    <!-- 全局Toast组件 -->
    <Toast
        :visible="toastState.visible"
        :message="toastState.message"
        :type="toastState.type"
        :show-icon="toastState.showIcon"
        :duration="toastState.duration"
        @hide="hideToast"
    />
  </view>
</template>

<script setup>
import {ref} from 'vue'
import CalculatorHeader from '@/components/CalculatorHeader.vue'
import CalculatorDisplay from '@/components/CalculatorDisplay.vue'
import CalculatorButtonGrid from '@/components/CalculatorButtonGrid.vue'
import SettingsDrawer from '@/components/SettingsDrawer.vue'
import HistoryDrawer from '@/components/HistoryDrawer.vue'
import Toast from '@/components/base/Toast.vue'
import { calculator } from '@/composables/useCalculator.js'
import {useTheme} from '@/composables/useTheme.js'
import {useToast} from '@/composables/useToast.js'

// 使用计算器组合函数，获取完整的计算器实例
// const calculator = useCalculator() // 删除此行

// 使用主题系统
const {getCurrentPracticalTheme} = useTheme()

// 使用Toast系统
const {toastState, hideToast} = useToast()

const isSettingsOpen = ref(false)
const isHistoryOpen = ref(false)

const openSettings = () => {
  if (isHistoryOpen.value) isHistoryOpen.value = false
  isSettingsOpen.value = true
}

const closeSettings = () => {
  isSettingsOpen.value = false
}

const openHistory = () => {
  if (isSettingsOpen.value) isSettingsOpen.value = false
  isHistoryOpen.value = true
}

const closeHistory = () => {
  isHistoryOpen.value = false
}
</script>

<script>
export default {
  async onShow() {
    console.log('Calculator page show')
  }
}
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

  /* 主题样式现在通过themes.scss中的主题类定义 */
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