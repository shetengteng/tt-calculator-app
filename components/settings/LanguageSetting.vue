<template>
  <BaseSettingItem 
    :title="t('menu.language')" 
    :description="t('settings.language')"
  >
    <template #control>
      <picker @change="onLanguageChange" :value="languageIndex" :range="languageOptions">
        <view class="picker-display">
          <text class="picker-text">{{ languageOptions[languageIndex] }}</text>
          <text class="picker-arrow">›</text>
        </view>
      </picker>
    </template>
  </BaseSettingItem>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import { useI18n } from '@/composables/useI18n.js'

// Emits
const emit = defineEmits(['change'])

// 使用国际化系统
const { 
  t, 
  setLanguage, 
  getLanguageOptions, 
  getCurrentLanguageIndex
} = useI18n()

// 语言选项数据
const languageOptions = getLanguageOptions().map(opt => opt.label)
const languageIndex = ref(getCurrentLanguageIndex())

// 语言变更处理
const onLanguageChange = (e) => {
  languageIndex.value = e.detail.value
  const selectedLanguage = getLanguageOptions()[e.detail.value].value
  setLanguage(selectedLanguage)
  
  // 触发变更事件
  emit('change', {
    type: 'language',
    value: selectedLanguage,
    index: languageIndex.value
  })
}

// 初始化
onMounted(() => {
  languageIndex.value = getCurrentLanguageIndex()
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