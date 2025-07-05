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
  themeConfigs
} = useTheme()

// 使用国际化系统
const { t } = useI18n()

// 组件状态
const isExpanded = ref(false)
const themeOptions = getThemeOptions()
const themeIndex = ref(getCurrentThemeIndex())

// 获取主题预览颜色
const getThemePreviewColors = (themeValue) => {
  const themeId = themeValue.toLowerCase()
  
  // 直接从主题配置中获取颜色
  if (themeConfigs.value[themeId] && themeConfigs.value[themeId].colors) {
    return themeConfigs.value[themeId].colors
  }
  
  // 如果是自动主题，使用对应的主题配置
  if (themeValue === 'Auto') {
    const systemInfo = uni.getSystemInfoSync()
    const isDark = systemInfo.theme === 'dark' || (new Date().getHours() >= 18 || new Date().getHours() <= 6)
    const fallbackThemeId = isDark ? 'dark' : 'light'
    
    if (themeConfigs.value[fallbackThemeId] && themeConfigs.value[fallbackThemeId].colors) {
      return themeConfigs.value[fallbackThemeId].colors
    }
  }
  
  // 如果配置文件还没有加载，返回空对象等待配置加载完成
  console.warn(`Theme configuration not yet loaded for ${themeValue}, waiting for initialization...`)
  return {}
}

// 获取Auto主题的预览背景
const getAutoThemePreviewBackground = computed(() => {
  const lightColors = themeConfigs.value.light?.colors
  const darkColors = themeConfigs.value.dark?.colors
  
  if (lightColors && darkColors) {
    return `linear-gradient(135deg, ${lightColors.primaryBackground} 0%, ${lightColors.primaryBackground} 50%, ${darkColors.primaryBackground} 50%, ${darkColors.primaryBackground} 100%)`
  }
  
  // 如果配置还没有加载，返回透明渐变等待配置加载完成
  return 'linear-gradient(135deg, transparent 0%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 100%)'
})

// 详细主题选项
const themeOptionsDetailed = computed(() => {
  return themeOptions.map((theme, index) => {
    const themeId = theme.toLowerCase()
    const config = themeConfigs.value[themeId]
    
    // 使用配置文件中的数据
    return {
      value: theme,
      name: config?.name || theme,
      description: config?.description || '',
      colors: config?.colors || getThemePreviewColors(theme),
      metadata: config?.metadata || {}
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