<template>
  <BaseSettingItem 
    :title="t('menu.theme')" 
    :description="t('settings.theme')"
  >
    <template #control>
      <picker @change="onThemeChange" :value="themeIndex" :range="themeOptions">
        <view class="picker-display">
          <text class="picker-text">{{ themeOptions[themeIndex] }}</text>
          <text class="picker-arrow">›</text>
        </view>
      </picker>
    </template>
  </BaseSettingItem>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import { useTheme } from '@/composables/useTheme.js'
import { useI18n } from '@/composables/useI18n.js'

// Emits
const emit = defineEmits(['change'])

// 使用主题系统
const { 
  currentTheme, 
  setTheme, 
  getThemeOptions, 
  getCurrentThemeIndex
} = useTheme()

// 使用国际化系统
const { t } = useI18n()

// 主题选项数据
const themeOptions = getThemeOptions()
const themeIndex = ref(getCurrentThemeIndex())

// 主题变更处理
const onThemeChange = (e) => {
  themeIndex.value = e.detail.value
  const selectedTheme = themeOptions[e.detail.value]
  setTheme(selectedTheme)
  
  // 触发变更事件
  emit('change', {
    type: 'theme',
    value: selectedTheme,
    index: themeIndex.value
  })
}

// 监听当前主题变化，同步索引
watch(currentTheme, () => {
  themeIndex.value = getCurrentThemeIndex()
})

// 初始化
onMounted(() => {
  themeIndex.value = getCurrentThemeIndex()
})
</script>

<style scoped lang="scss">
.picker-display {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background: var(--theme-dark-gray);
  border-radius: 16rpx;
  min-width: 120rpx;
  justify-content: space-between;
}

.picker-text {
  font-size: 28rpx;
  color: var(--theme-text-primary);
}

.picker-arrow {
  font-size: 32rpx;
  color: var(--theme-light-gray);
  margin-left: 10rpx;
}
</style> 