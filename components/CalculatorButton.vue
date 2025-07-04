<template>
  <view 
    :class="buttonClasses" 
    @click="handleClick"
    :style="customStyle"
  >
    {{ displayText }}
  </view>
</template>

<script setup>
import { computed } from 'vue'

// 定义组件属性
const props = defineProps({
  // 按钮显示的文本
  text: {
    type: String,
    required: true
  },
  // 按钮主题：blue, dark, light
  theme: {
    type: String,
    default: 'dark',
    validator: (value) => {
      return ['blue', 'dark', 'light'].includes(value)
    }
  },
  // 按钮尺寸：small, medium, large
  size: {
    type: String,
    default: 'medium',
    validator: (value) => {
      return ['small', 'medium', 'large'].includes(value)
    }
  },
  // 是否激活状态（主要用于操作符按钮）
  active: {
    type: Boolean,
    default: false
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 按钮形状：circle, rounded, square
  shape: {
    type: String,
    default: 'rounded',
    validator: (value) => {
      return ['circle', 'rounded', 'square'].includes(value)
    }
  },
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({})
  },
  // 按钮功能类型（用于事件处理）
  action: {
    type: String,
    default: 'default'
  }
})

// 定义事件
const emit = defineEmits(['click'])

// 计算按钮的CSS类
const buttonClasses = computed(() => {
  const baseClass = 'calculator-button'
  const themeClass = `theme-${props.theme}`
  const sizeClass = `size-${props.size}`
  const shapeClass = `shape-${props.shape}`
  const activeClass = props.active ? 'active' : ''
  const disabledClass = props.disabled ? 'disabled' : ''
  
  return [baseClass, themeClass, sizeClass, shapeClass, activeClass, disabledClass].filter(Boolean).join(' ')
})

// 显示的文本（可以根据类型进行特殊处理）
const displayText = computed(() => {
  return props.text
})

// 处理点击事件
const handleClick = () => {
  if (!props.disabled) {
    emit('click', {
      text: props.text,
      theme: props.theme,
      action: props.action
    })
  }
}
</script>

<style scoped>
.calculator-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  font-size: 42rpx;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  width: 140rpx;
  height: 140rpx;
  position: relative;
  overflow: hidden;
}

/* 主题样式 */
.theme-blue {
  background-color: #00A8E6;
  color: #FFFFFF;
}

.theme-dark {
  background-color: #505050;
  color: #FFFFFF;
}

.theme-light {
  background-color: #A6A6A6;
  color: #000000;
}

/* 激活状态 */
.calculator-button.active {
  background-color: #FFFFFF !important;
  color: #00A8E6 !important;
}

/* 悬停和点击效果 */
.calculator-button:hover {
  opacity: 0.8;
}

.calculator-button:active {
  transform: scale(0.95);
  opacity: 0.6;
}

/* 禁用状态 */
.calculator-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.calculator-button.disabled:active {
  transform: none;
}

/* 尺寸变体 */
.size-small {
  width: 120rpx;
  height: 120rpx;
  font-size: 38rpx;
}

.size-medium {
  width: 140rpx;
  height: 140rpx;
  font-size: 42rpx;
}

.size-large {
  width: 160rpx;
  height: 160rpx;
  font-size: 46rpx;
}

/* 形状变体 */
.shape-circle {
  border-radius: 50%;
}

.shape-rounded {
  border-radius: 45%;
}

.shape-square {
  border-radius: 25%;
}

/* 小屏幕适配 */
@media screen and (max-width: 750rpx) {
  .calculator-button {
    width: 120rpx;
    height: 120rpx;
    font-size: 38rpx;
  }
  
  .size-small {
    width: 100rpx;
    height: 100rpx;
    font-size: 34rpx;
  }
  
  .size-medium {
    width: 120rpx;
    height: 120rpx;
    font-size: 38rpx;
  }
  
  .size-large {
    width: 140rpx;
    height: 140rpx;
    font-size: 42rpx;
  }
}

/* 超小屏幕适配 */
@media screen and (max-width: 640rpx) {
  .calculator-button {
    width: 100rpx;
    height: 100rpx;
    font-size: 34rpx;
  }
  
  .size-small {
    width: 80rpx;
    height: 80rpx;
    font-size: 30rpx;
  }
  
  .size-medium {
    width: 100rpx;
    height: 100rpx;
    font-size: 34rpx;
  }
  
  .size-large {
    width: 120rpx;
    height: 120rpx;
    font-size: 38rpx;
  }
}

/* iPhone 4/4S 专门优化 (320x480) - 按钮适当放大 */
@media screen and (max-width: 320px) and (max-height: 480px) {
  .calculator-button {
    width: 110rpx;
    height: 110rpx;
    font-size: 36rpx;
  }
  
  .size-small {
    width: 90rpx;
    height: 90rpx;
    font-size: 32rpx;
  }
  
  .size-medium {
    width: 110rpx;
    height: 110rpx;
    font-size: 36rpx;
  }
  
  .size-large {
    width: 130rpx;
    height: 130rpx;
    font-size: 40rpx;
  }
}

/* 大屏幕适配 */
@media screen and (min-width: 1500rpx) {
  .calculator-button {
    width: 180rpx;
    height: 180rpx;
    font-size: 50rpx;
  }
  
  .size-small {
    width: 160rpx;
    height: 160rpx;
    font-size: 46rpx;
  }
  
  .size-medium {
    width: 180rpx;
    height: 180rpx;
    font-size: 50rpx;
  }
  
  .size-large {
    width: 200rpx;
    height: 200rpx;
    font-size: 54rpx;
  }
}
</style> 