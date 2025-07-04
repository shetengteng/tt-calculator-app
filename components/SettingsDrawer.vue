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
          <text class="drawer-title">Settings</text>
          <CloseButton @click="closeDrawer" />
        </view>
        
        <!-- 设置选项 -->
        <scroll-view class="drawer-scroll" scroll-y="true">
          <view class="settings-section">
            <text class="section-title">Display</text>
            
            <view class="setting-item">
              <view class="setting-info">
                <text class="setting-title">Theme</text>
                <text class="setting-description">Choose app appearance</text>
              </view>
              <view class="setting-control">
                <picker @change="onThemeChange" :value="themeIndex" :range="themeOptions">
                  <view class="picker-display">
                    <text class="picker-text">{{ themeOptions[themeIndex] }}</text>
                    <text class="picker-arrow">›</text>
                  </view>
                </picker>
              </view>
            </view>
            
            <view class="setting-item">
              <view class="setting-info">
                <text class="setting-title">Decimal Places</text>
                <text class="setting-description">Number of decimal places</text>
              </view>
              <view class="setting-control">
                <picker @change="onDecimalChange" :value="decimalIndex" :range="decimalOptions">
                  <view class="picker-display">
                    <text class="picker-text">{{ decimalOptions[decimalIndex] }}</text>
                    <text class="picker-arrow">›</text>
                  </view>
                </picker>
              </view>
            </view>
            
            <view class="setting-item">
              <view class="setting-info">
                <text class="setting-title">Thousand Separator</text>
                <text class="setting-description">Show commas in large numbers</text>
              </view>
              <view class="setting-control">
                <switch @change="onSeparatorChange" :checked="thousandSeparator" color="#007AFF"/>
              </view>
            </view>
          </view>
          
          <view class="settings-section">
            <text class="section-title">Calculation</text>
            
            <view class="setting-item">
              <view class="setting-info">
                <text class="setting-title">Haptic Feedback</text>
                <text class="setting-description">Vibrate on button press</text>
              </view>
              <view class="setting-control">
                <switch @change="onHapticChange" :checked="hapticFeedback" color="#007AFF"/>
              </view>
            </view>
            
            <view class="setting-item">
              <view class="setting-info">
                <text class="setting-title">Sound Effects</text>
                <text class="setting-description">Play sounds on button press</text>
              </view>
              <view class="setting-control">
                <switch @change="onSoundChange" :checked="soundEffects" color="#007AFF"/>
              </view>
            </view>
            
            <view class="setting-item">
              <view class="setting-info">
                <text class="setting-title">Auto Copy Result</text>
                <text class="setting-description">Copy results to clipboard</text>
              </view>
              <view class="setting-control">
                <switch @change="onAutoCopyChange" :checked="autoCopyResult" color="#007AFF"/>
              </view>
            </view>
          </view>
          
          <view class="settings-section">
            <text class="section-title">History</text>
            
            <view class="setting-item">
              <view class="setting-info">
                <text class="setting-title">Auto Save History</text>
                <text class="setting-description">Automatically save calculations</text>
              </view>
              <view class="setting-control">
                <switch @change="onAutoSaveChange" :checked="autoSaveHistory" color="#007AFF"/>
              </view>
            </view>
            
            <view class="setting-item" @click="clearHistory">
              <view class="setting-info">
                <text class="setting-title danger-text">Clear History</text>
                <text class="setting-description">Delete all saved calculations</text>
              </view>
              <view class="setting-control">
                <text class="picker-arrow">›</text>
              </view>
            </view>
          </view>
          
          <view class="settings-section">
            <text class="section-title">About</text>
            <view class="setting-item">
              <view class="setting-info">
                <text class="setting-title">Version</text>
                <text class="setting-description">Calculator App v1.0</text>
              </view>
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
import { ref, watch } from 'vue'
import CloseButton from './CloseButton.vue'
import { useTheme } from '@/composables/useTheme.js'

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

// 使用主题系统
const { 
  currentTheme, 
  setTheme, 
  getThemeOptions, 
  getCurrentThemeIndex,
  themeVars 
} = useTheme()

// 设置选项数据
const themeOptions = getThemeOptions()
const themeIndex = ref(getCurrentThemeIndex())

const decimalOptions = ['0', '1', '2', '3', '4', '5']
const decimalIndex = ref(2) // 默认2位小数

const thousandSeparator = ref(true)
const hapticFeedback = ref(true)
const soundEffects = ref(false)
const autoCopyResult = ref(false)
const autoSaveHistory = ref(true)

// 触摸相关
const touchStartX = ref(0)
const touchStartY = ref(0)

// 关闭抽屉
const closeDrawer = () => {
  emit('close')
}

// 设置选项处理函数
const onThemeChange = (e) => {
  themeIndex.value = e.detail.value
  const selectedTheme = themeOptions[e.detail.value]
  setTheme(selectedTheme)
  applySettings()
}

const onDecimalChange = (e) => {
  decimalIndex.value = e.detail.value
  applySettings()
}

const onSeparatorChange = (e) => {
  thousandSeparator.value = e.detail.value
  applySettings()
}

const onHapticChange = (e) => {
  hapticFeedback.value = e.detail.value
  applySettings()
}

const onSoundChange = (e) => {
  soundEffects.value = e.detail.value
  applySettings()
}

const onAutoCopyChange = (e) => {
  autoCopyResult.value = e.detail.value
  applySettings()
}

const onAutoSaveChange = (e) => {
  autoSaveHistory.value = e.detail.value
  applySettings()
}

const clearHistory = () => {
  uni.showModal({
    title: '确认清除',
    content: '确定要清除所有计算历史吗？',
    success: (res) => {
      if (res.confirm) {
        // 直接调用计算器实例的清除历史方法
        if (props.calculator && typeof props.calculator.clearHistory === 'function') {
          props.calculator.clearHistory()
        }
        uni.showToast({
          title: '历史记录已清除',
          icon: 'success'
        })
      }
    }
  })
}

// 应用设置到计算器实例和本地存储
const applySettings = () => {
  const settings = {
    theme: themeOptions[themeIndex.value],
    decimalPlaces: parseInt(decimalOptions[decimalIndex.value]),
    thousandSeparator: thousandSeparator.value,
    hapticFeedback: hapticFeedback.value,
    soundEffects: soundEffects.value,
    autoCopyResult: autoCopyResult.value,
    autoSaveHistory: autoSaveHistory.value
  }
  
  // 保存到本地存储
  uni.setStorageSync('calculator-settings', settings)
  
  // 应用到计算器实例（如果有相应的方法）
  if (props.calculator) {
    if (typeof props.calculator.updateSettings === 'function') {
      props.calculator.updateSettings(settings)
    }
  }
  
  console.log('Applied settings:', settings)
}

// 从本地存储加载设置
const loadSettings = () => {
  try {
    // 同步主题索引
    themeIndex.value = getCurrentThemeIndex()
    
    const savedSettings = uni.getStorageSync('calculator-settings')
    if (savedSettings) {
      // 应用保存的设置（主题已通过useTheme管理，这里不需要重复设置）
      
      const decimalIndex_found = decimalOptions.indexOf(savedSettings.decimalPlaces?.toString())
      if (decimalIndex_found !== -1) {
        decimalIndex.value = decimalIndex_found
      }
      
      thousandSeparator.value = savedSettings.thousandSeparator ?? true
      hapticFeedback.value = savedSettings.hapticFeedback ?? true
      soundEffects.value = savedSettings.soundEffects ?? false
      autoCopyResult.value = savedSettings.autoCopyResult ?? false
      autoSaveHistory.value = savedSettings.autoSaveHistory ?? true
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
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

// 监听当前主题变化，同步索引
watch(currentTheme, () => {
  themeIndex.value = getCurrentThemeIndex()
})

// 监听组件挂载，加载设置
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadSettings()
  }
}, { immediate: true })
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
  z-index: 1000;
  transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
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

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  background: var(--theme-drawer-item-background);
  border-bottom: 1px solid var(--theme-separator);
  transition: background-color 0.2s ease;
}

.setting-item:active {
  background: var(--theme-drawer-item-hover);
}

.setting-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.setting-title {
  font-size: 32rpx;
  color: var(--theme-text-primary);
  margin-bottom: 6rpx;
}

.setting-description {
  font-size: 26rpx;
  color: var(--theme-light-gray);
}

.danger-text {
  color: #FF3B30 !important;
}

.setting-control {
  display: flex;
  align-items: center;
}

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

/* 遮罩层 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
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