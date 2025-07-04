<template>
  <BaseSettingItem 
    :title="t('settings.decimalPlaces')" 
    icon="ri-hashtag"
    :clickable="true"
    :showChevron="true"
  >
    <template #control>
      <picker @change="onDecimalChange" :value="decimalIndex" :range="decimalOptions">
        <view class="picker-display">
          <text class="picker-text">{{ decimalOptions[decimalIndex] }}</text>
        </view>
      </picker>
    </template>
  </BaseSettingItem>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import { useSettings } from '@/composables/useSettings.js'
import { useI18n } from '@/composables/useI18n.js'

// Props
const props = defineProps({
  calculator: {
    type: Object,
    default: null
  }
})

// 使用设置管理和国际化
const { settings, updateSetting, applySettingsToCalculator } = useSettings()
const { t } = useI18n()

// 小数位数选项
const decimalOptions = ['0', '1', '2', '3', '4', '5']

// 计算当前选中的索引
const decimalIndex = computed(() => {
  return decimalOptions.indexOf(settings.decimalPlaces.toString())
})

// 小数位数变更处理
const onDecimalChange = (e) => {
  const decimalPlaces = parseInt(decimalOptions[e.detail.value])
  
  // 更新设置
  updateSetting('decimalPlaces', decimalPlaces)
  
  // 应用到计算器实例
  if (props.calculator) {
    applySettingsToCalculator(props.calculator)
  }
}

// 监听计算器实例变化，应用设置
watch(() => props.calculator, (newCalculator) => {
  if (newCalculator) {
    applySettingsToCalculator(newCalculator)
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.picker-display {
  display: flex;
  align-items: center;
  padding: 0;
  justify-content: flex-end;
}

.picker-text {
  font-size: 28rpx;
  color: var(--settings-text-secondary);
  font-weight: 400;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .picker-text {
    font-size: 24rpx;
  }
}
</style> 