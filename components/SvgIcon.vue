<template>
  <i 
    :class="['svg-icon', className, name]" 
    :style="iconStyle"
    aria-hidden="true"
  ></i>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: '24rpx'
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  className: {
    type: String,
    default: ''
  }
})

// 计算样式
const iconStyle = computed(() => {
  return {
    fontSize: typeof props.size === 'number' ? `${props.size}rpx` : props.size,
    color: props.color
  }
})
</script>

<style scoped lang="scss">
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}
</style> 