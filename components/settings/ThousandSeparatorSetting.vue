<template>
  <SwitchSetting
    :title="t('settings.thousandSeparator')"
    icon="ri-separator"
    setting-type="thousandSeparator"
    :model-value="settings.thousandSeparator"
    @change="handleChange"
  />
</template>

<script setup>
// 不再需要 watch 导入
import SwitchSetting from './SwitchSetting.vue'
import { useSettings } from '@/composables/useSettings.js'
import { useI18n } from '@/composables/useI18n.js'

// Props - 不再需要 calculator 实例

// 使用设置管理和国际化
const { settings, updateSetting } = useSettings()
const { t } = useI18n()

// 处理设置变更
const handleChange = (settingData) => {
  updateSetting('thousandSeparator', settingData.value)
  // 设置会自动通过事件通知系统应用
}
</script> 