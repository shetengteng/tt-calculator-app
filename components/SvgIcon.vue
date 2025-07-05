<template>
  <svg 
    :class="['svg-icon', className]" 
    :style="iconStyle"
    aria-hidden="true"
  >
    <use :xlink:href="`/static/icons/remixicon.svg#${name}`"></use>
  </svg>
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
    default: '1em'
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
    width: typeof props.size === 'number' ? `${props.size}px` : props.size,
    height: typeof props.size === 'number' ? `${props.size}px` : props.size,
    fill: props.color,
    color: props.color
  }
})
</script>

<style scoped lang="scss">
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style> 