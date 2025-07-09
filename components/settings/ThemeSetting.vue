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
          <text class="theme-name">{{ t(`themes.${currentThemeId}`) || 'unknown' }}</text>
        </view>
      </template>
    </BaseSettingItem>

    <!-- 折叠面板内容 -->
    <view class="theme-collapse" :class="{ 'collapsed': !isExpanded }">
      <view class="theme-options">
        <view
            class="theme-option"
            v-for="theme in themes"
            :key="theme.id"
            :class="{ 'active': theme.id === currentThemeId }"
            @click="selectTheme(theme.id)"
        >
          <view class="option-content">
            <view class="theme-preview"
                  :style="{ 
                    background: theme.colors.primaryBackground,
                    borderColor: theme.colors.border
                  }">
              <view class="preview-mockup">
                <view class="mockup-display"
                      :style="{ 
                        background: theme.colors.secondaryBackground,
                        borderColor: theme.colors.border
                      }">
                  <text class="display-text" :style="{ color: theme.colors.textPrimary }">123</text>
                </view>
                <view class="mockup-buttons">
                  <view class="button-row">
                    <view class="mockup-btn number-btn"
                          :style="{ 
                            background: theme.colors.buttonDark,
                            border: 'none'
                          }">
                      <text class="btn-text" :style="{ color: theme.colors.buttonDarkText }">7</text>
                    </view>
                    <view class="mockup-btn number-btn"
                          :style="{ 
                            background: theme.colors.buttonDark,
                            border: 'none'
                          }">
                      <text class="btn-text" :style="{ color: theme.colors.buttonDarkText }">8</text>
                    </view>
                    <view class="mockup-btn operator-btn"
                          :style="{ 
                            background: theme.colors.buttonBlue,
                            border: 'none'
                          }">
                      <text class="btn-text op-text" :style="{ color: theme.colors.buttonBlueText }">+</text>
                    </view>
                  </view>
                  <view class="button-row">
                    <view class="mockup-btn number-btn"
                          :style="{ 
                            background: theme.colors.buttonDark,
                            border: 'none'
                          }">
                      <text class="btn-text" :style="{ color: theme.colors.buttonDarkText }">4</text>
                    </view>
                    <view class="mockup-btn number-btn"
                          :style="{ 
                            background: theme.colors.buttonDark,
                            border: 'none'
                          }">
                      <text class="btn-text" :style="{ color: theme.colors.buttonDarkText }">5</text>
                    </view>
                    <view class="mockup-btn operator-btn"
                          :style="{ 
                            background: theme.colors.buttonBlue,
                            border: 'none'
                          }">
                      <text class="btn-text op-text" :style="{ color: theme.colors.buttonBlueText }">=</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="option-text">
              <text class="option-name">{{ t(`themes.${theme.id}`) || 'unknown' }}</text>
              <text class="option-description">{{ t(`themes.${theme.id}Desc`) || 'unknown' }}</text>
            </view>
          </view>
          <view class="option-check" v-if="theme.id === currentThemeId">
            <text class="check-icon">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref} from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import {useTheme} from '@/composables/useTheme.js'
import {useI18n} from '@/composables/useI18n.js'

// Emits
const emit = defineEmits(['change'])

const {
  currentThemeId,
  themes,
  setTheme
} = useTheme()

const {t} = useI18n()

// 组件状态
const isExpanded = ref(false)
const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value
}

const selectTheme = (theme) => {
  setTheme(theme)
  isExpanded.value = false
}

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