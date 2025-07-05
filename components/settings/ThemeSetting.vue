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
            <view class="theme-preview" 
                  :style="{ 
                    background: option.value === 'Auto' ? 
                      'linear-gradient(135deg, ' + themeColors[THEMES.LIGHT].primaryBackground + ' 0%, ' + themeColors[THEMES.LIGHT].primaryBackground + ' 50%, ' + themeColors[THEMES.DARK].primaryBackground + ' 50%, ' + themeColors[THEMES.DARK].primaryBackground + ' 100%)' : 
                      option.colors.primaryBackground,
                    borderColor: option.colors.border
                  }">
              <view class="preview-mockup">
                <view class="mockup-display" 
                      :style="{ 
                        background: option.colors.secondaryBackground,
                        borderColor: option.colors.border
                      }">
                  <text class="display-text" :style="{ color: option.colors.textPrimary }">123</text>
                </view>
                <view class="mockup-buttons">
                  <view class="button-row">
                    <view class="mockup-btn number-btn"
                          :style="{ 
                            background: option.colors.buttonDark,
                            border: 'none'
                          }">
                      <text class="btn-text" :style="{ color: option.colors.buttonDarkText }">7</text>
                    </view>
                    <view class="mockup-btn number-btn"
                          :style="{ 
                            background: option.colors.buttonDark,
                            border: 'none'
                          }">
                      <text class="btn-text" :style="{ color: option.colors.buttonDarkText }">8</text>
                    </view>
                    <view class="mockup-btn operator-btn"
                          :style="{ 
                            background: option.colors.buttonBlue,
                            border: 'none'
                          }">
                      <text class="btn-text op-text" :style="{ color: option.colors.buttonBlueText }">+</text>
                    </view>
                  </view>
                  <view class="button-row">
                    <view class="mockup-btn number-btn"
                          :style="{ 
                            background: option.colors.buttonDark,
                            border: 'none'
                          }">
                      <text class="btn-text" :style="{ color: option.colors.buttonDarkText }">4</text>
                    </view>
                    <view class="mockup-btn number-btn"
                          :style="{ 
                            background: option.colors.buttonDark,
                            border: 'none'
                          }">
                      <text class="btn-text" :style="{ color: option.colors.buttonDarkText }">5</text>
                    </view>
                    <view class="mockup-btn operator-btn"
                          :style="{ 
                            background: option.colors.buttonBlue,
                            border: 'none'
                          }">
                      <text class="btn-text op-text" :style="{ color: option.colors.buttonBlueText }">=</text>
                    </view>
                  </view>
                </view>
              </view>
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
  getCurrentThemeIndex,
  THEMES
} = useTheme()

// 使用国际化系统
const { t } = useI18n()

// 组件状态
const isExpanded = ref(false)
const themeOptions = getThemeOptions()
const themeIndex = ref(getCurrentThemeIndex())

// 主题颜色定义 - 使用实际的主题颜色
const themeColors = {
  [THEMES.LIGHT]: {
    primaryBackground: '#FFFFFF',
    secondaryBackground: '#F2F2F7',
    textPrimary: '#000000',
    buttonBlue: '#007AFF',
    buttonDark: '#E5E5EA',
    buttonDarkText: '#000000',
    buttonBlueText: '#FFFFFF',
    border: '#C6C6C8'
  },
  [THEMES.DARK]: {
    primaryBackground: '#2C2C2E',
    secondaryBackground: '#1C1C1E',
    textPrimary: '#FFFFFF',
    buttonBlue: '#00A8E6',
    buttonDark: '#505050',
    buttonDarkText: '#FFFFFF',
    buttonBlueText: '#FFFFFF',
    border: '#505050'
  }
}

// 获取主题预览颜色
const getThemePreviewColors = (themeValue) => {
  if (themeValue === 'Light') {
    return themeColors[THEMES.LIGHT]
  } else if (themeValue === 'Dark') {
    return themeColors[THEMES.DARK]
  } else if (themeValue === 'Auto') {
    // 自动主题使用当前激活的主题颜色
    const systemInfo = uni.getSystemInfoSync()
    const isDark = systemInfo.theme === 'dark' || (new Date().getHours() >= 18 || new Date().getHours() <= 6)
    return isDark ? themeColors[THEMES.DARK] : themeColors[THEMES.LIGHT]
  }
  return themeColors[THEMES.DARK]
}

// 详细主题选项
const themeOptionsDetailed = computed(() => {
  return themeOptions.map((theme, index) => {
    const themeMap = {
      'Light': { name: t('theme.light') || '浅色', description: t('theme.lightDesc') || '经典浅色主题' },
      'Dark': { name: t('theme.dark') || '深色', description: t('theme.darkDesc') || '护眼深色主题' },
      'Auto': { name: t('theme.auto') || '自动', description: t('theme.autoDesc') || '跟随系统设置' }
    }
    return {
      value: theme,
      name: themeMap[theme]?.name || theme,
      description: themeMap[theme]?.description || '',
      colors: getThemePreviewColors(theme)
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
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid var(--settings-separator);
  overflow: hidden;
}

/* Theme preview styles are now handled dynamically via :style binding */

.preview-mockup {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 4rpx;
  box-sizing: border-box;
}

.mockup-display {
  width: 100%;
  height: 20rpx;
  border-radius: 4rpx;
  margin-bottom: 4rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 4rpx;
  box-sizing: border-box;
}

.display-text {
  font-size: 10rpx;
  font-weight: 500;
  line-height: 1;
  /* Color is now handled dynamically via :style binding */
}

.mockup-buttons {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.button-row {
  display: flex;
  gap: 2rpx;
  flex: 1;
}

.mockup-btn {
  flex: 1;
  border-radius: 3rpx;
  border: none;
  min-height: 10rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
}

.btn-text {
  font-size: 8rpx;
  font-weight: 600;
  line-height: 1;
  /* Color is now handled dynamically via :style binding */
}

.number-btn {
  /* Button styles are now handled dynamically via :style binding */
}

.operator-btn {
  /* Button styles are now handled dynamically via :style binding */
}

.op-text {
  font-weight: 600;
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
    width: 56rpx;
    height: 56rpx;
  }
  
  .preview-mockup {
    padding: 3rpx;
  }
  
  .mockup-display {
    height: 16rpx;
    padding: 0 3rpx;
  }
  
  .display-text {
    font-size: 8rpx;
  }
  
  .mockup-buttons {
    gap: 1rpx;
  }
  
  .button-row {
    gap: 1rpx;
  }
  
  .btn-text {
    font-size: 6rpx;
  }
  
  .option-name {
    font-size: 28rpx;
  }
  
  .option-description {
    font-size: 22rpx;
  }
}
</style> 