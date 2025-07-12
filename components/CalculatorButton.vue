<template>
  <view :class="buttonClasses" @click="handleClick" :style="customStyle">
    {{ text }}
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
  info: {
    type: Object,
    default: () => ({})
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

const handleClick = () => {
  if (props.disabled) return
  emit('click', props.info)
}
</script>

<style lang="scss" scoped>
.calculator-button {
  @include button-base;
  @include button-size(medium);
  border-radius: $border-radius-circle;
  font-weight: 400;
}

/* 主题样式现在通过全局主题类定义 */
/* 按钮的主题样式在 themes.scss 中的 .theme-* 选择器下定义 */

/* 激活状态 */
.calculator-button.active {
  opacity: 0.8;
  transform: scale(0.95);
}

/* 交互效果 */
.calculator-button {
  @include button-interactions;
}

/* 尺寸变体 */
.size-small {
  @include button-size(small);
}

.size-medium {
  @include button-size(medium);
}

.size-large {
  @include button-size(large);
}

/* 形状变体 */
.shape-circle {
  border-radius: $border-radius-circle;
}

.shape-rounded {
  border-radius: $border-radius-large;
}

.shape-square {
  border-radius: $border-radius-medium;
}

/* 小屏幕适配 */
@include small-screen {
  .calculator-button {
    @include button-size(small);
  }

  .size-small {
    width: 100rpx;
    height: 100rpx;
    font-size: $font-size-button-small;
  }

  .size-medium {
    @include button-size(small);
  }

  .size-large {
    @include button-size(medium);
  }
}

/* 超小屏幕适配 */
@include extra-small-screen {
  .calculator-button {
    width: 100rpx;
    height: 100rpx;
    font-size: $font-size-button-small;
  }

  .size-small {
    width: 80rpx;
    height: 80rpx;
    font-size: $font-size-button-xs;
  }

  .size-medium {
    width: 100rpx;
    height: 100rpx;
    font-size: $font-size-button-small;
  }

  .size-large {
    @include button-size(small);
  }
}

/* iPhone 4/4S 专门优化 */
@include iphone4-optimization {
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

/* iPhone 5/SE 专门优化 - 按钮稍微放大 */
@include iphone5-optimization {
  .calculator-button {
    width: 125rpx;
    height: 125rpx;
    font-size: 40rpx;
  }

  .size-small {
    width: 105rpx;
    height: 105rpx;
    font-size: 36rpx;
  }

  .size-medium {
    width: 125rpx;
    height: 125rpx;
    font-size: 40rpx;
  }

  .size-large {
    width: 145rpx;
    height: 145rpx;
    font-size: 44rpx;
  }
}

/* 大屏幕适配 */
@include large-screen {
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