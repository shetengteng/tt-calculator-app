<template>
  <view class="theme-setting">
    <!-- 主题设置头部 -->
    <BaseSettingItem 
      :title="t('menu.theme')" 
      icon="ri-palette-line"
      :clickable="true"
      :showChevron="true"
      @click="toggleCollapse"
    >
      <template #control>
        <view class="current-theme">
          <text class="theme-name">{{ currentThemeName }}</text>
        </view>
      </template>
    </BaseSettingItem>
    
    <!-- 折叠面板内容 -->
    <view class="theme-collapse" :class="{ 'collapsed': !isExpanded }">
      <view class="theme-options">
        <view 
          class="theme-option" 
          v-for="(option, index) in themeOptionsDetailed" 
          :key="option.value"
          :class="{ 'active': index === themeIndex }"
          @click="selectTheme(index)"
        >
          <view class="option-content">
            <view class="theme-preview" :class="'theme-preview-' + option.value">
              <view class="preview-circle"></view>
            </view>
            <view class="option-text">
              <text class="option-name">{{ option.name }}</text>
              <text class="option-description">{{ option.description }}</text>
            </view>
          </view>
          <view class="option-check" v-if="index === themeIndex">
            <text class="check-icon">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import { useTheme } from '@/composables/useTheme.js'
import { useI18n } from '@/composables/useI18n.js'

// Props
const props = defineProps({
  calculator: {
    type: Object,
    required: true
  }
})

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

// 组件状态
const isExpanded = ref(false)
const themeOptions = getThemeOptions()
const themeIndex = ref(getCurrentThemeIndex())

// 详细主题选项
const themeOptionsDetailed = computed(() => {
  return themeOptions.map((theme, index) => {
    const themeMap = {
      'light': { name: t('theme.light') || '浅色', description: t('theme.lightDesc') || '经典浅色主题' },
      'dark': { name: t('theme.dark') || '深色', description: t('theme.darkDesc') || '护眼深色主题' },
      'auto': { name: t('theme.auto') || '自动', description: t('theme.autoDesc') || '跟随系统设置' }
    }
    return {
      value: theme,
      name: themeMap[theme]?.name || theme,
      description: themeMap[theme]?.description || ''
    }
  })
})

// 当前主题名称
const currentThemeName = computed(() => {
  return themeOptionsDetailed.value[themeIndex.value]?.name || themeOptions[themeIndex.value]
})

// 切换折叠状态
const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value
}

// 选择主题
const selectTheme = (index) => {
  themeIndex.value = index
  const selectedTheme = themeOptions[index]
  setTheme(selectedTheme)
  
  // 触发变更事件
  emit('change', {
    type: 'theme',
    value: selectedTheme,
    index: themeIndex.value
  })
  
  // 选择后自动收起
  isExpanded.value = false
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
.theme-setting {
  background: var(--settings-card-background);
  border-radius: 16rpx;
  overflow: hidden;
}

.current-theme {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.theme-name {
  font-size: 28rpx;
  color: var(--settings-text-secondary);
}

.theme-collapse {
  max-height: 600rpx;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.theme-collapse.collapsed {
  max-height: 0;
}

.theme-options {
  border-top: 1px solid var(--settings-separator);
}

.theme-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 40rpx;
  border-bottom: 1px solid var(--settings-separator);
  transition: background-color 0.2s ease;
}

.theme-option:last-child {
  border-bottom: none;
}

.theme-option:active {
  background: var(--theme-overlay);
}

.theme-option.active {
  background: rgba(0, 122, 255, 0.1);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.theme-preview {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid var(--settings-separator);
}

.theme-preview-light {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.theme-preview-dark {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.theme-preview-auto {
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #1a1a1a 50%, #1a1a1a 100%);
}

.preview-circle {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: var(--settings-primary-color);
  opacity: 0.8;
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

.option-description {
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
  .theme-option {
    padding: 16rpx 32rpx;
  }
  
  .theme-preview {
    width: 40rpx;
    height: 40rpx;
  }
  
  .preview-circle {
    width: 16rpx;
    height: 16rpx;
  }
  
  .option-name {
    font-size: 28rpx;
  }
  
  .option-description {
    font-size: 22rpx;
  }
}
</style> 