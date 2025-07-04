<template>
  <BaseSettingItem 
    :title="t('settings.clearHistory')" 
    :description="t('settings.clearHistoryDesc')"
    :clickable="true"
    :isDanger="true"
    @click="handleClearHistory"
  >
    <template #control>
      <text class="picker-arrow">›</text>
    </template>
  </BaseSettingItem>
</template>

<script setup>
import BaseSettingItem from './BaseSettingItem.vue'
import { useI18n } from '@/composables/useI18n.js'

// Props
const props = defineProps({
  calculator: {
    type: Object,
    required: true
  }
})

// 使用国际化
const { t } = useI18n()

// 清除历史记录处理
const handleClearHistory = () => {
  uni.showModal({
    title: t('settings.confirmClear'),
    content: t('settings.confirmClearContent'),
    success: (res) => {
      if (res.confirm) {
        // 直接调用计算器实例的清除历史方法
        if (props.calculator && typeof props.calculator.clearHistory === 'function') {
          props.calculator.clearHistory()
        }
        
        uni.showToast({
          title: t('settings.historyCleared'),
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.picker-arrow {
  font-size: 32rpx;
  color: var(--theme-light-gray);
  margin-left: 10rpx;
}
</style> 