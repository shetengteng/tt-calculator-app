<template>
  <SwitchSetting
    :title="t('settings.hapticFeedback')"
    icon="ri-smartphone-line"
    setting-type="hapticFeedback"
    :model-value="settings.hapticFeedback"
    @change="handleChange"
  />
</template>

<script setup>
import { watch } from 'vue'
import SwitchSetting from './SwitchSetting.vue'
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

// 处理设置变更
const handleChange = (settingData) => {
  updateSetting('hapticFeedback', settingData.value)
  
  // 应用到计算器实例
  if (props.calculator) {
    applySettingsToCalculator(props.calculator)
  }
  
  // 触发触觉反馈测试（如果开启）
  if (settingData.value && uni.vibrateShort) {
    uni.vibrateShort({
      type: 'light'
    })
  }
}

// 监听计算器实例变化，应用设置
watch(() => props.calculator, (newCalculator) => {
  if (newCalculator) {
    applySettingsToCalculator(newCalculator)
  }
}, { immediate: true })
</script> 