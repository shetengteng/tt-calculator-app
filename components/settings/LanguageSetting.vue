<template>
  <view class="language-setting">
    <!-- 语言设置头部 -->
    <BaseSettingItem
        :title="t('menu.language')"
        icon="ri-global-line"
        :clickable="true"
        :showChevron="true"
        @click="toggleCollapse"
    >
      <template #control>
        <view class="current-language">
          <text class="language-flag">{{ currentLanguageFlag }}</text>
          <text class="language-name">{{ currentLanguageName }}</text>
        </view>
      </template>
    </BaseSettingItem>

    <!-- 折叠面板内容 -->
    <view class="language-collapse" :class="{ 'collapsed': !isExpanded }">
      <view class="language-options">
        <view
            class="language-option"
            v-for="option in languages"
            :key="option.id"
            :class="{ 'active': option.id === currentLanguageId }"
            @click="selectLanguage(option.id)"
        >
          <view class="option-content">
            <text class="option-flag">{{ option.value._metadata.flag }}</text>
            <view class="option-text">
              <text class="option-name">{{ option.value._metadata.name }}</text>
              <text class="option-region">{{ option.value._metadata.region }}</text>
            </view>
          </view>
          <view class="option-check" v-if="option.id === currentLanguageId">
            <text class="check-icon">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import {useI18n} from '@/composables/useI18n.js'

const emit = defineEmits(['change'])

// 使用国际化系统
const {
  t,
  languages,
  currentLanguageId,
  currentLanguageValue,
  setLocale
} = useI18n()

// 组件状态
const isExpanded = ref(false)
const currentLanguageName = ref('')
const currentLanguageFlag = ref('')

// 切换折叠状态
const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value
}

// 选择语言
const selectLanguage = (languageId) => {
  setLocale(languageId)
  isExpanded.value = false
  updateCurrentLanguageInfo()

}
const updateCurrentLanguageInfo = () => {
  currentLanguageName.value = currentLanguageValue.value._metadata.name
  currentLanguageFlag.value = currentLanguageValue.value._metadata.flag || '🌐'
}

onMounted(() => {
  updateCurrentLanguageInfo()
})

</script>

<style scoped lang="scss">
.language-setting {
  background: var(--settings-card-background);
  border-radius: 16rpx;
  overflow: hidden;
}

.current-language {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.language-flag {
  font-size: 32rpx;
}

.language-name {
  font-size: 28rpx !important;
  color: var(--settings-text-secondary);
  font-weight: 400 !important;
}

.language-collapse {
  max-height: 1000rpx;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.language-collapse.collapsed {
  max-height: 0;
}

.language-options {
  border-top: 1px solid var(--settings-separator);
}

.language-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 40rpx;
  border-bottom: 1px solid var(--settings-separator);
  transition: background-color 0.2s ease;
}

.language-option:last-child {
  border-bottom: none;
}

.language-option:active {
  background: var(--theme-overlay);
}

.language-option.active {
  background: rgba(0, 122, 255, 0.1);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.option-flag {
  font-size: 40rpx;
  width: 56rpx;
  text-align: center;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.option-name {
  font-size: 30rpx;
  color: var(--settings-text-primary);
  font-weight: 500;
}

.option-region {
  font-size: 24rpx;
  color: var(--settings-text-secondary);
}

.option-check {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 28rpx;
  color: var(--settings-primary-color);
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .language-option {
    padding: 16rpx 32rpx;
  }

  .option-flag {
    font-size: 36rpx;
    width: 48rpx;
  }

  .option-name {
    font-size: 28rpx;
  }

  .option-region {
    font-size: 22rpx;
  }
}
</style> 