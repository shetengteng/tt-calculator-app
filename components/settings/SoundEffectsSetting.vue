<template>
  <view class="sound-effects-setting">
    <!-- 音效设置头部 -->
    <BaseSettingItem 
      :title="t('settings.soundEffects')" 
      icon="ri-volume-up-line"
      :clickable="true"
      :showChevron="true"
      @click="toggleCollapse"
    >
      <template #control>
        <view class="current-sound">
          <text class="sound-type">{{ currentSoundTypeName }}</text>
        </view>
      </template>
    </BaseSettingItem>
    
    <!-- 折叠面板内容 -->
    <view class="sound-collapse" :class="{ 'collapsed': !isExpanded }">
      
      <!-- 音效类型选择 -->
      <view class="sound-options">
        <view 
          class="sound-option" 
          v-for="option in soundTypeOptions" 
          :key="option.value"
          :class="{ 'active': option.value === settings.soundType }"
          @click="selectSoundType(option.value)"
        >
          <view class="option-content">
            <view class="option-icon">
              <SvgIcon :name="option.icon" size="32rpx" color="var(--settings-text-secondary)" />
            </view>
            <view class="option-text">
              <text class="option-name">{{ option.name }}</text>
              <text class="option-description">{{ option.description }}</text>
            </view>
          </view>
          <view class="option-check" v-if="option.value === settings.soundType">
            <text class="check-icon">✓</text>
          </view>
        </view>
      </view>

      
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'
import { useSettings } from '@/composables/useSettings.js'
import { useI18n } from '@/composables/useI18n.js'
import { useSound } from '@/composables/useSound.js'

// Props
const props = defineProps({
  calculator: {
    type: Object,
    default: null
  }
})

// 使用设置管理和国际化
const { settings, updateSetting, applySettingsToCalculator } = useSettings()
const { t } = useI18n()
const { playSound, initializeSound, preloadSounds } = useSound()

// 组件状态
const isExpanded = ref(false)
const isPlayingTest = ref(false)

// 音效类型选项
const soundTypeOptions = computed(() => [
  {
    value: 'none',
    name: t('settings.soundTypeNone'),
    description: t('settings.soundTypeNoneDesc'),
    icon: 'ri-volume-mute-line'
  },
  {
    value: 'classic',
    name: t('settings.soundTypeClassic'),
    description: t('settings.soundTypeClassicDesc'),
    icon: 'ri-volume-up-line'
  },
  {
    value: 'modern',
    name: t('settings.soundTypeModern'),
    description: t('settings.soundTypeModernDesc'),
    icon: 'ri-music-line'
  },
  {
    value: 'natural',
    name: t('settings.soundTypeNatural'),
    description: t('settings.soundTypeNaturalDesc'),
    icon: 'ri-sound-module-line'
  },
  {
    value: 'tech',
    name: t('settings.soundTypeTech'),
    description: t('settings.soundTypeTechDesc'),
    icon: 'ri-speaker-line'
  }
])

// 当前音效类型名称
const currentSoundTypeName = computed(() => {
  const option = soundTypeOptions.value.find(opt => opt.value === settings.soundType)
  return option ? option.name : t('settings.soundTypeNone')
})

// 切换折叠状态
const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value
}

// 选择音效类型
const selectSoundType = async (type) => {
  updateSetting('soundType', type)
  
  // 应用到计算器实例
  if (props.calculator) {
    applySettingsToCalculator(props.calculator)
  }
  
  // 如果选择了音效类型（非"关闭"），播放测试音效
  if (type !== 'none') {
    await playTestSound()
  }
  
  // 选择后自动收起
  isExpanded.value = false
}



// 播放测试音效
const playTestSound = async () => {
  if (isPlayingTest.value || settings.soundType === 'none') return
  
  isPlayingTest.value = true
  
  try {
    // 初始化音效系统
    await initializeSound()
    
    // 先播放按键音效，然后播放结果音效
    await playSound(settings.soundType, 'buttonPress', 0.5)
    
    // 延迟播放结果音效，模拟实际使用场景
    setTimeout(async () => {
      await playSound(settings.soundType, 'result', 0.5)
    }, 300)
    
    console.log(`Playing test sounds: ${settings.soundType}`)
  } catch (error) {
    console.error('Failed to play test sound:', error)
  } finally {
    // 测试音效播放时间
    setTimeout(() => {
      isPlayingTest.value = false
    }, 800)
  }
}

// 监听计算器实例变化，应用设置
watch(() => props.calculator, (newCalculator) => {
  if (newCalculator) {
    applySettingsToCalculator(newCalculator)
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.sound-effects-setting {
  background: var(--settings-card-background);
  border-radius: 16rpx;
  overflow: hidden;
  
  .sound-collapse {
    max-height: 1000rpx;
    overflow: hidden;
    transition: max-height 0.3s ease;
    
    &.collapsed {
      max-height: 0;
    }
  }
  
  .current-sound {
    display: flex;
    align-items: center;
    
    .sound-type {
      font-size: 28rpx !important;
      color: var(--settings-text-secondary);
      font-weight: 400 !important;
    }
  }
  
  .sound-options {
    border-top: 1px solid var(--settings-separator);
    
    .sound-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 40rpx;
      border-bottom: 1px solid var(--settings-separator);
      transition: background-color 0.2s ease;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:active {
        background: var(--theme-overlay);
      }
      
      &.active {
        background: rgba(0, 122, 255, 0.1);
      }
      
      .option-content {
        display: flex;
        align-items: center;
        gap: 20rpx;
        flex: 1;
        
        .option-icon {
          width: 40rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .option-text {
          display: flex;
          flex-direction: column;
          gap: 2rpx;
          
          .option-name {
            font-size: 30rpx;
            color: var(--settings-text-primary);
            font-weight: 500;
          }
          
          .option-description {
            font-size: 24rpx;
            color: var(--settings-text-secondary);
          }
        }
      }
      
      .option-check {
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .check-icon {
          font-size: 28rpx;
          color: var(--settings-primary-color);
          font-weight: 600;
        }
      }
    }
  }
}
</style> 