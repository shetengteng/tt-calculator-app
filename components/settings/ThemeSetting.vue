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
                      getAutoThemePreviewBackground : 
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

// Props - 不再需要 calculator 实例

// Emits
const emit = defineEmits(['change'])

// 使用主题系统
const { 
  currentTheme, 
  setTheme, 
  getThemeOptions, 
  getCurrentThemeIndex,
  themeConfigs,
  initializeThemeSystem
} = useTheme()

// 使用国际化系统
const { t, currentLanguage, setLanguage } = useI18n()

// 组件状态
const isExpanded = ref(false)
const themeOptions = ref([])
const themeIndex = ref(getCurrentThemeIndex())

// 获取主题预览颜色 - 使用硬编码的预览颜色
const getThemePreviewColors = (themeValue) => {
  const themeId = themeValue.toLowerCase()
  
  // 硬编码的预览颜色，仅用于主题选择界面
  const previewColors = {
    light: {
      primaryBackground: "#FFFFFF",
      secondaryBackground: "#F2F2F7",
      textPrimary: "#000000",
      buttonDark: "#E5E5EA", 
      buttonDarkText: "#000000",
      buttonBlue: "#007AFF",
      buttonBlueText: "#FFFFFF",
      border: "#C6C6C8"
    },
    dark: {
      primaryBackground: "#1a1a1a",
      secondaryBackground: "#1a1a1a",
      textPrimary: "#ffffff",
      buttonDark: "#505050", 
      buttonDarkText: "#ffffff",
      buttonBlue: "#ff9500",
      buttonBlueText: "#ffffff",
      border: "#444444"
    },
    'minimal-black': {
      primaryBackground: "#000000",
      secondaryBackground: "#000000",
      textPrimary: "#ffffff",
      buttonDark: "#000000", 
      buttonDarkText: "#ffffff",
      buttonBlue: "#007AFF",
      buttonBlueText: "#ffffff",
      border: "#0F0F0F"
    },
    'minimal-white': {
      primaryBackground: "#ffffff",
      secondaryBackground: "#ffffff",
      textPrimary: "#000000",
      buttonDark: "#ffffff", 
      buttonDarkText: "#000000",
      buttonBlue: "#007AFF",
      buttonBlueText: "#000000",
      border: "#F0F0F0"
    },
    auto: {
      primaryBackground: "#FFFFFF",
      secondaryBackground: "#F2F2F7",
      textPrimary: "#000000",
      buttonDark: "#E5E5EA", 
      buttonDarkText: "#000000",
      buttonBlue: "#007AFF",
      buttonBlueText: "#FFFFFF",
      border: "#C6C6C8"
    }
  }
  
  return previewColors[themeId] || previewColors.light
}

// 获取Auto主题的预览背景 - 使用硬编码颜色
const getAutoThemePreviewBackground = computed(() => {
  const lightBackground = "#FFFFFF"
  const darkBackground = "#1a1a1a"
  
  return `linear-gradient(135deg, ${lightBackground} 0%, ${lightBackground} 50%, ${darkBackground} 50%, ${darkBackground} 100%)`
})

// 详细主题选项
const themeOptionsDetailed = computed(() => {
  return themeOptions.value.map((theme, index) => {
    const themeId = theme.toLowerCase()
    const config = themeConfigs.value[themeId]
    
    // 从 locales 中获取主题名称和描述
    const themeName = t(`themes.${themeId}`) || theme
    const themeDescription = t(`themes.${themeId}Desc`) || ''
    
    // 使用硬编码的预览颜色
    return {
      value: theme,
      name: themeName,
      description: themeDescription,
      colors: getThemePreviewColors(theme),
      scss: config?.scss || `theme-${themeId}`
    }
  })
})

// 当前主题名称
const currentThemeName = computed(() => {
  return themeOptionsDetailed.value[themeIndex.value]?.name || themeOptions.value[themeIndex.value]
})

// 切换折叠状态
const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value
}

// 选择主题
const selectTheme = (index) => {
  themeIndex.value = index
  const selectedTheme = themeOptions.value[index]
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

// 监听语言变化，重新计算主题选项
watch(currentLanguage, async () => {
  // 语言变化时，刷新翻译缓存
  await setLanguage(currentLanguage.value)
  console.log('Language changed, theme options updated with fresh translations')
})

// 初始化主题选项
const initializeThemeOptions = async () => {
  try {
    // 先尝试重新初始化主题系统以获取最新配置
    await initializeThemeSystem()
    
    const options = await getThemeOptions()
    themeOptions.value = options
    themeIndex.value = getCurrentThemeIndex()
    
    console.log('Theme options initialized:', options)
  } catch (error) {
    console.error('Failed to initialize theme options:', error)
  }
}

// 初始化
onMounted(async () => {
  await initializeThemeOptions()
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
  font-size: 28rpx !important;
  color: var(--settings-text-secondary);
  font-weight: 400 !important;
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
  border: none;
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