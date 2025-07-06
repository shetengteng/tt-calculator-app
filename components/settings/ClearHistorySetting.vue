<template>
  <BaseSettingItem 
    :title="t('settings.clearHistory')" 
    icon="ri-delete-bin-line"
    :clickable="true"
    :isDanger="true"
    :showChevron="true"
    @click="handleClearHistory"
  >
    <template #control>
      <!-- 不需要额外的控件，因为已经有chevron了 -->
    </template>
  </BaseSettingItem>
  
  <!-- 确认对话框 -->
  <ConfirmDialog
    :visible="showConfirmModal"
    :title="t('settings.confirmClear')"
    :content="t('settings.confirmClearContent')"
    :is-danger="true"
    @confirm="confirmClearHistory"
    @cancel="hideConfirmModal"
    @close="hideConfirmModal"
  />
</template>

<script setup>
import { ref } from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import ConfirmDialog from '@/components/base/ConfirmDialog.vue'
import { useI18n } from '@/composables/useI18n.js'
import { useToast } from '@/composables/useToast.js'
import { useCalculatorHistory } from '@/composables/useCalculatorHistory.js'

// 使用历史记录系统
const { clearHistory } = useCalculatorHistory()

// 使用国际化
const { t } = useI18n()

// 使用Toast系统
const { success } = useToast()

// 弹框状态
const showConfirmModal = ref(false)

// 清除历史记录处理
const handleClearHistory = () => {
  showConfirmModal.value = true
}

// 隐藏确认弹框
const hideConfirmModal = () => {
  showConfirmModal.value = false
}

// 确认清除历史记录
const confirmClearHistory = () => {
  // 直接调用历史记录清除方法
  clearHistory()
  
  // 隐藏弹框
  hideConfirmModal()
  
  // 使用自定义Toast显示成功提示
  success(t('settings.historyCleared'))
}
</script>

<style scoped lang="scss">
/* 如果需要自定义样式，可以在这里添加 */
</style> 