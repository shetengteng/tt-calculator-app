<template>
  <view class="calculator-container" :class="{ [`${getCurrentPracticalTheme().class}`]: true }" @touchmove.prevent>
    <!-- 主计算器内容 -->
    <view class="calculator" :class="{
      'calculator-shifted-left': isSettingsOpen,
      'calculator-shifted-right': isHistoryOpen
    }">
      <!-- 1. Header Section -->
      <CalculatorHeader @settings-click="openSettings" @history-click="openHistory" />

      <view class="calculator-content">
        <!-- 临时记录容器 -->
        <TempRecordsContainer class="temp-records" />
        <!-- 2. Display Section -->
        <CalculatorDisplay class="calculator-display" />
      </view>
      <!-- 3. Button Group Section -->
      <CalculatorButtonGrid />
    </view>

    <!-- 设置抽屉组件 -->
    <SettingsDrawer :is-open="isSettingsOpen" @close="closeSettings" />

    <!-- 历史记录抽屉组件 -->
    <HistoryDrawer :is-open="isHistoryOpen" @close="closeHistory" />

    <!-- 全局Toast组件 -->
    <Toast :visible="toastState.visible" :message="toastState.message" :type="toastState.type"
      :show-icon="toastState.showIcon" :duration="toastState.duration" @hide="hideToast" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CalculatorHeader from '@/components/CalculatorHeader.vue'
import CalculatorDisplay from '@/components/CalculatorDisplay.vue'
import CalculatorButtonGrid from '@/components/CalculatorButtonGrid.vue'
import SettingsDrawer from '@/components/SettingsDrawer.vue'
import HistoryDrawer from '@/components/HistoryDrawer.vue'
import Toast from '@/components/base/Toast.vue'
import TempRecordsContainer from '@/components/TempRecordsContainer.vue'

import { useTheme } from '@/composables/useTheme.js'
import { useToast } from '@/composables/useToast.js'

// 使用主题系统
const { getCurrentPracticalTheme } = useTheme()

// 使用Toast系统
const { toastState, hideToast } = useToast()

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

// 在挂载时禁用页面滚动
onMounted(() => {
  // 针对H5，禁用默认的下拉刷新行为
  // #ifdef H5
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.height = '100%'
  // #endif
})
</script>

<script>
export default {
  async onShow() {
    console.log('Calculator page show')
  },
  onLoad() {
    // 禁用页面滚动和下拉刷新
    uni.setPageMeta({
      pullDownRefresh: {
        enable: false
      },
      allowsBounceVertical: "NO"
    })
  },
  // 监听页面触摸移动事件，阻止默认下拉行为
  onPageScroll() {
    return false
  }
}
</script>

<style lang="scss">
.calculator-container {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  touch-action: none;
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

/* 计算器中间内容区域，自动填充剩余空间 */
.calculator-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 为临时记录容器设置固定高度 */
.temp-records {
  height: 40vh; /* 与组件内部保持一致 */
  min-height: 100rpx;
  max-height: 40vh;
  /* 移除overflow-y，使用组件内部的scroll-view处理滚动 */
  /* 确保容器样式不与scroll-view冲突 */
  padding: 0 40rpx;
  margin-bottom: 10rpx;
  box-sizing: border-box; /* 确保内边距不会增加总高度 */
}

/* 为计算器显示区设置固定高度 */
.calculator-display {
  height: 100rpx;
  border: none !important; /* 覆盖主题中的边框样式 */
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