<template>
  <view class="button-group-section">
    <view class="button-grid">
      <CalculatorButton
        v-for="(button, index) in buttons"
        :key="index"
        :text="button.text"
        :theme="button.theme"
        :info="button"
        @click="handleButtonClick"
      />
    </view>
  </view>
</template>

<script setup>
import CalculatorButton from './CalculatorButton.vue'
import {useCalculator} from '@/composables/useCalculator.js'
import createButtonsConfig from '@/config/buttons.js'

const {handleButtonClick} = useCalculator()

// 使用配置函数创建按钮配置数组
const buttons = createButtonsConfig()

</script>

<style scoped lang="scss">
.button-group-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx;
  padding-top: 0;
  flex-shrink: 0;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 20rpx;
  width: 100%;
  max-width: 640rpx;
  margin: 0 auto;
  place-items: center;
}

/* 小屏幕适配 */
@include small-screen {
  .button-group-section {
    padding: 30rpx;
  }

  .button-grid {
    gap: 16rpx;
    max-width: 520rpx;
  }
}

/* 超小屏幕适配 */
@include extra-small-screen {
  .button-group-section {
    padding: 20rpx;
  }

  .button-grid {
    gap: 12rpx;
    max-width: 440rpx;
  }
}

/* iPhone 4/4S 专门优化 - 按钮网格完全贴近底部 */
@include iphone4-optimization {
  .button-group-section {
    padding: 10rpx 15rpx 20rpx 15rpx;
    align-items: flex-end;
    justify-content: center;
    flex-grow: 1;
  }

  .button-grid {
    gap: 8rpx;
    max-width: 470rpx;
  }
}

/* iPhone 5/SE 专门优化 - 按钮网格贴近底部 */
@include iphone5-optimization {
  .button-group-section {
    padding: 15rpx 20rpx 25rpx 20rpx;
    align-items: flex-end;
    justify-content: center;
    flex-grow: 1;
  }

  .button-grid {
    gap: 10rpx;
    max-width: 480rpx;
  }
}

/* 大屏幕适配 */
@include large-screen {
  .button-group-section {
    padding: 60rpx;
  }

  .button-grid {
    gap: 30rpx;
    max-width: 800rpx;
  }
}
</style> 