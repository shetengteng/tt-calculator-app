<template>
  <SwitchSetting
    :title="t('settings.autoSaveHistory')"
    icon="ri-save-line"
    setting-type="autoSaveHistory"
    :model-value="settings.autoSaveHistory"
    @change="handleChange"
  />
</template>

<script setup>
// 不再需要 watch 导入
import SwitchSetting from './SwitchSetting.vue'
import { useSettings } from '@/composables/useSettings.js'
import { useI18n } from '@/composables/useI18n.js'


// 使用设置管理和国际化
const { settings, updateSetting } = useSettings()
const { t } = useI18n()

// 处理设置变更
const handleChange = (settingData) => {
  updateSetting('autoSaveHistory', settingData.value)
}
</script> 