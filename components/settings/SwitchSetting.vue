<template>
  <BaseSettingItem 
    :title="title" 
    :description="description"
  >
    <template #control>
      <switch 
        @change="onSwitchChange" 
        :checked="modelValue" 
        color="#007AFF"
      />
    </template>
  </BaseSettingItem>
</template>

<script setup>
import BaseSettingItem from './BaseSettingItem.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  settingType: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

// 开关变更处理
const onSwitchChange = (e) => {
  const value = e.detail.value
  
  // 更新v-model
  emit('update:modelValue', value)
  
  // 触发变更事件
  emit('change', {
    type: props.settingType,
    value: value
  })
}
</script> 