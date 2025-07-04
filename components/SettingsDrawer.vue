<template>
  <view class="drawer-container">
    <!-- 设置抽屉 -->
    <view 
      class="settings-drawer" 
      :class="{ 'drawer-open': isOpen }"
      @touchstart="handleDrawerTouchStart"
      @touchmove="handleDrawerTouchMove"
      @touchend="handleDrawerTouchEnd"
    >
      <view class="drawer-content">
        <!-- 设置页面内容 -->
        <view class="drawer-header">
          <text class="drawer-title">{{ t('settings.title') }}</text>
          <CloseButton @click="closeDrawer" />
        </view>
        
        <!-- 设置选项 -->
        <scroll-view class="drawer-scroll" scroll-y="true">
          <!-- 通用设置 -->
          <view class="settings-section">
            <text class="section-title">{{ t('settings.general') }}</text>
            
            <LanguageSetting :calculator="calculator" />
            <ThemeSetting :calculator="calculator" />
            <DecimalPlacesSetting :calculator="calculator" />
            <ThousandSeparatorSetting :calculator="calculator" />
          </view>
          
          <!-- 计算设置 -->
          <view class="settings-section">
            <text class="section-title">{{ t('settings.calculation') }}</text>
            
            <HapticFeedbackSetting :calculator="calculator" />
            <SoundEffectsSetting :calculator="calculator" />
            <AutoCopyResultSetting :calculator="calculator" />
          </view>
          
          <!-- 历史记录设置 -->
          <view class="settings-section">
            <text class="section-title">{{ t('settings.history') }}</text>
            
            <AutoSaveHistorySetting :calculator="calculator" />
            <ClearHistorySetting :calculator="calculator" />
          </view>
          
          <!-- 关于 -->
          <view class="settings-section">
            <text class="section-title">{{ t('settings.about') }}</text>
            <VersionSetting version="Calculator App v1.0" />
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 遮罩层 -->
    <view 
      class="drawer-overlay" 
      :class="{ 'overlay-visible': isOpen }"
      @click="closeDrawer"
    ></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import CloseButton from './CloseButton.vue'
import LanguageSetting from './settings/LanguageSetting.vue'
import ThemeSetting from './settings/ThemeSetting.vue'
import DecimalPlacesSetting from './settings/DecimalPlacesSetting.vue'
import ThousandSeparatorSetting from './settings/ThousandSeparatorSetting.vue'
import HapticFeedbackSetting from './settings/HapticFeedbackSetting.vue'
import SoundEffectsSetting from './settings/SoundEffectsSetting.vue'
import AutoCopyResultSetting from './settings/AutoCopyResultSetting.vue'
import AutoSaveHistorySetting from './settings/AutoSaveHistorySetting.vue'
import ClearHistorySetting from './settings/ClearHistorySetting.vue'
import VersionSetting from './settings/VersionSetting.vue'
import { useI18n } from '@/composables/useI18n.js'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  calculator: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close'])

// 使用国际化系统
const { t } = useI18n()

// 触摸相关
const touchStartX = ref(0)
const touchStartY = ref(0)

// 关闭抽屉
const closeDrawer = () => {
  emit('close')
}

// 触摸手势处理
const handleDrawerTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleDrawerTouchMove = (e) => {
  // 可以在这里添加手势拖拽逻辑
}

const handleDrawerTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  
  const deltaX = touchEndX - touchStartX.value
  const deltaY = touchEndY - touchStartY.value
  
  // 如果是向左滑动且水平距离大于垂直距离，关闭抽屉
  if (deltaX < -50 && Math.abs(deltaX) > Math.abs(deltaY)) {
    closeDrawer()
  }
}
</script>

<style scoped lang="scss">  
.drawer-container {
  position: relative;
}

/* 设置抽屉 */
.settings-drawer {
  position: fixed;
  top: 0;
  left: -80%;
  width: 80%;
  height: 100vh;
  background: var(--theme-drawer-background);
  z-index: 9999;
  transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 2px 0 10px var(--theme-shadow-color, rgba(0, 0, 0, 0.1));
}

.settings-drawer.drawer-open {
  left: 0;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 40rpx;
  padding-top: calc(20rpx + var(--status-bar-height));
  background: var(--theme-drawer-header);
  border-bottom: 1px solid var(--theme-separator);
}

.drawer-title {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--theme-text-primary);
}

.drawer-scroll {
  flex: 1;
  padding: 20rpx 0;
}

/* 设置选项样式 */
.settings-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--theme-light-gray);
  text-transform: uppercase;
  letter-spacing: 0.5rpx;
  margin: 0 40rpx 20rpx 40rpx;
}

/* 遮罩层 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: var(--theme-overlay);
  z-index: 9998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.drawer-overlay.overlay-visible {
  opacity: 1;
  visibility: visible;
}

/* 小屏幕适配 */
@include small-phone {
  .settings-drawer {
    width: 85%;
    left: -85%;
  }
}

/* iPhone 4/4S 专门优化 */
@include iphone4-optimization {
  .settings-drawer {
    width: 85%;
    left: -85%;
  }
}
</style> 