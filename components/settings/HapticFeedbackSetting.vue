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

// Props - 不再需要 calculator 实例

// 使用设置管理和国际化
const { settings, updateSetting } = useSettings()
const { t } = useI18n()

// 处理设置变更
const handleChange = (settingData) => {
  updateSetting('hapticFeedback', settingData.value)
  // 设置会自动通过事件通知系统应用
  
  // 触发触觉反馈测试（如果开启）
  if (settingData.value && uni.vibrateShort) {
    uni.vibrateShort({
      type: 'light'
    })
  }
}
</script> 