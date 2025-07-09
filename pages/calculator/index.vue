<template>
  <view class="calculator-container" :class="{[`${getCurrentPracticalThemeClass()}`]: true}">
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
      <CalculatorDisplay
          :calculation="calculator.calculation.value"
          :result="calculator.result.value"
          :secondary-calculation="calculator.secondaryCalculation.value"
          :secondary-result="calculator.secondaryResult.value"
      />

      <!-- 3. Button Group Section -->
      <CalculatorButtonGrid
          :calculator="calculator"
      />
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
import {onMounted, onUnmounted, ref} from 'vue'
import CalculatorHeader from '@/components/CalculatorHeader.vue'
import CalculatorDisplay from '@/components/CalculatorDisplay.vue'
import CalculatorButtonGrid from '@/components/CalculatorButtonGrid.vue'
import SettingsDrawer from '@/components/SettingsDrawer.vue'
import HistoryDrawer from '@/components/HistoryDrawer.vue'
import Toast from '@/components/base/Toast.vue'
import {useCalculator} from '@/composables/useCalculator.js'
import {useCalculatorHistory} from '@/composables/useCalculatorHistory.js'
import {useTheme} from '@/composables/useTheme.js'
import {useI18n} from '@/composables/useI18n.js'
import {useSettings} from '@/composables/useSettings.js'
import {useToast} from '@/composables/useToast.js'

// 使用计算器组合函数，获取完整的计算器实例
const calculator = useCalculator()

// 使用历史记录系统
const {loadHistory} = useCalculatorHistory()

// 使用主题系统
const {getCurrentPracticalThemeClass} = useTheme()

// 使用国际化系统
const {loadLanguage} = useI18n()

// 使用设置系统
const {loadSettings} = useSettings()

// 使用Toast系统
const {toastState, hideToast} = useToast()

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
  console.log('----------33333333333----------')
  loadSettings()
  loadHistory()
  loadLanguage()

  // 监听设置变更事件
  uni.$on('settingsChanged', handleSettingsChanged)
})

// 处理设置变更
const handleSettingsChanged = (data) => {
  console.log('Settings changed:', data.key, data.value)
  // 这里可以根据需要处理特定的设置变更
  // 例如，如果主题变更，可以重新应用主题
  if (data.key === 'theme') {
    // applyTheme()
  }
}

// 清理事件监听器
onUnmounted(() => {
  uni.$off('settingsChanged', handleSettingsChanged)
})
</script>

<script>
export default {
  async onShow() {
    console.log('Calculator page show')

    try {
      // // 页面显示时只进行必要的更新，不重新初始化缓存
      // const { applyTheme } = useTheme()
      //
      // // 重新应用主题（可能系统主题已更改）
      // applyTheme()

      console.log('Calculator page theme refreshed')
    } catch (error) {
      console.error('Failed to refresh theme on calculator page show:', error)
    }
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