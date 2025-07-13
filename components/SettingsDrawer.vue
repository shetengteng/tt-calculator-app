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
        <!-- 设置页面头部 -->
        <view class="drawer-header">
          <text class="drawer-title">{{ t('settings.title') }}</text>
          <view class="header-actions">
            <CloseButton @click="closeDrawer" />
          </view>
        </view>
        
        <!-- 设置页面内容 -->
        <scroll-view class="drawer-scroll" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
          <!-- 偏好设置 -->
          <view class="settings-section">
            <view class="section-title">{{ t('settings.general') || '偏好设置' }}</view>
            <view class="settings-group">
              <LanguageSetting />
              <ThemeSetting />
              <DecimalPlacesSetting />
              <ThousandSeparatorSetting />
            </view>
          </view>
          
          <!-- 计算设置 -->
          <view class="settings-section">
            <view class="section-title">{{ t('settings.calculation') || '计算设置' }}</view>
            <view class="settings-group">
              <HapticFeedbackSetting />
              <SoundEffectsSetting />
              <AutoCopyResultSetting />
            </view>
          </view>
          
          <!-- 历史记录设置 -->
          <view class="settings-section">
            <view class="section-title">{{ t('settings.history') || '历史记录' }}</view>
            <view class="settings-group">
              <AutoSaveHistorySetting />
              <ClearHistorySetting />
            </view>
          </view>
          
          <!-- 关于 -->
          <view class="settings-section">
            <view class="section-title">{{ t('settings.about') || '关于' }}</view>
            <view class="settings-group">
              <VersionSetting version="Calculator App v1.0" />
            </view>
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
import { ref, computed } from 'vue'
import CloseButton from '@/components/base/CloseButton.vue'
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
  }
})

// Emits
const emit = defineEmits(['close'])

// 使用国际化系统
const { t } = useI18n()

// 触摸相关
const touchStartX = ref(0)
const touchStartY = ref(0)

// 计算滚动区域高度
const scrollHeight = computed(() => {
  // 获取屏幕高度
  const screenHeight = uni.getSystemInfoSync().windowHeight
  // 头部高度（包含状态栏）
  const headerHeight = 50 // 约100rpx转换为px
  // 留出一些安全边距
  const safeMargin = 20
  
  return screenHeight - headerHeight - safeMargin
})

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
  background: var(--settings-background);
  z-index: 9999;
  transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.settings-drawer.drawer-open {
  left: 0;
}

.drawer-content {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

/* 头部样式 */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  background: var(--settings-card-background);
  border-bottom: none;
  box-sizing: border-box;
}

.drawer-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--settings-text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

/* 滚动内容 */
.drawer-scroll {
  padding: 24rpx 16rpx;
  /* 为底部添加额外的安全区域 */
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  /* 修复宽度问题 - 确保不超过父容器宽度 */
  width: 100%;
  box-sizing: border-box;
  /* 确保滚动平滑 */
  -webkit-overflow-scrolling: touch;
  /* 启用硬件加速 */
  transform: translateZ(0);
}

/* 设置选项样式 */
.settings-section {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 24rpx;
  font-weight: 500;
  color: var(--settings-text-secondary);
  padding: 16rpx 4rpx;
  display: block;
  line-height: 1.4;
}

.settings-group {
  background: var(--settings-card-background);
  border-radius: 16rpx;
  overflow: hidden;
}

/* 遮罩层 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.drawer-overlay.overlay-visible {
  opacity: 1;
  visibility: visible;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-drawer {
    left: -100%;
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .drawer-scroll {
    padding: 12px;
  }
  
  .profile-container {
    padding: 12px;
  }
  
  .profile-avatar {
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }
  
  .avatar-text {
    font-size: 20px;
  }
  
  .profile-name {
    font-size: 16px;
  }
}
</style> 