<template>
  <BaseSettingItem 
    :title="t('settings.version') || 'Version'"
    icon="ri-information-line"
  >
    <template #control>
      <text class="version-text">{{ versionText }}</text>
    </template>
  </BaseSettingItem>
</template>

<script setup>
import { computed } from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import { useI18n } from '@/composables/useI18n.js'

// Props
const props = defineProps({
  version: {
    type: String,
    default: 'Calculator App v1.0'
  }
})

// 使用国际化
const { t } = useI18n()

// 计算版本文本
const versionText = computed(() => {
  return props.version
})
</script>

<style scoped lang="scss">
.version-text {
  font-size: 28rpx;
  color: var(--settings-text-secondary);
  font-weight: 400;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .version-text {
    font-size: 24rpx;
  }
}
</style> 