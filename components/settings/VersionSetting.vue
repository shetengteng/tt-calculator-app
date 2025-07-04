<template>
  <BaseSettingItem 
    title="Version" 
    :description="versionText"
  >
    <template #control>
      <!-- 版本信息不需要控件 -->
    </template>
  </BaseSettingItem>
</template>

<script setup>
import { computed } from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'

// Props
const props = defineProps({
  version: {
    type: String,
    default: 'Calculator App v1.0'
  }
})

// 计算版本文本
const versionText = computed(() => {
  return props.version
})
</script> 