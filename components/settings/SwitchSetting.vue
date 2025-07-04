<template>
  <BaseSettingItem 
    :title="title" 
    :description="description"
    :icon="icon"
  >
    <template #control>
      <view class="switch-container">
        <switch 
          @change="onSwitchChange" 
          :checked="modelValue" 
          :color="switchColor"
          class="custom-switch"
        />
      </view>
    </template>
  </BaseSettingItem>
</template>

<script setup>
import { computed } from 'vue'
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
  icon: {
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

// 计算开关颜色
const switchColor = computed(() => {
  return 'var(--settings-toggle-active)'
})

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

<style scoped lang="scss">
.switch-container {
  display: flex;
  align-items: center;
}

.custom-switch {
  transform: scale(0.6);
}

/* 针对不同平台的开关样式优化 */
/* #ifdef APP-PLUS */
.custom-switch {
  transform: scale(0.5);
}
/* #endif */

/* #ifdef H5 */
.custom-switch {
  transform: scale(0.6);
}
/* #endif */

/* #ifdef MP */
.custom-switch {
  transform: scale(0.55);
}
/* #endif */
</style> 