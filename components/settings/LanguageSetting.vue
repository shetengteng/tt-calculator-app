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
          v-for="option in languageOptions" 
          :key="option.value"
          :class="{ 'active': option.value === currentLanguage }"
          @click="selectLanguage(option.value)"
        >
          <view class="option-content">
            <text class="option-flag">{{ option.flag }}</text>
            <view class="option-text">
              <text class="option-name">{{ option.name }}</text>
              <text class="option-region">{{ option.region }}</text>
            </view>
          </view>
          <view class="option-check" v-if="option.value === currentLanguage">
            <text class="check-icon">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
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

// 使用国际化系统
const { 
  t, 
  setLanguage, 
  getLanguageOptions, 
  getCurrentLanguageIndex,
  preloadLanguages,
  currentLanguage
} = useI18n()

// 组件状态
const isExpanded = ref(false)
const languageOptions = ref([])
const currentLanguageName = ref('')
const currentLanguageFlag = ref('')

// 切换折叠状态
const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value
}

// 选择语言
const selectLanguage = async (languageCode) => {
  await setLanguage(languageCode)
  await updateCurrentLanguageInfo()
  
  // 触发变更事件
  emit('change', {
    type: 'language',
    value: languageCode
  })
  
  // 选择后自动收起
  isExpanded.value = false
}

// 更新当前语言信息
const updateCurrentLanguageInfo = async () => {
  const options = await getLanguageOptions()
  const currentOption = options.find(opt => opt.value === currentLanguage.value)
  if (currentOption) {
    currentLanguageName.value = currentOption.name
    currentLanguageFlag.value = currentOption.flag || '🌐'
  }
}

// 初始化语言选项
const initializeLanguageOptions = async () => {
  try {
    // 先预加载语言列表和文件
    await preloadLanguages()
    
    const options = await getLanguageOptions()
    
    // 获取完整的语言信息（包括国旗）
    const enhancedOptions = []
    for (const option of options) {
      try {
        const response = await new Promise((resolve, reject) => {
          uni.request({
            url: `/static/locales/${option.value}.json`,
            method: 'GET',
            success: (res) => {
              if (res.statusCode === 200) {
                resolve(res.data)
              } else {
                reject(new Error(`Failed to load language file: ${res.statusCode}`))
              }
            },
            fail: (err) => {
              reject(err)
            }
          })
        })
        
        enhancedOptions.push({
          ...option,
          flag: response._metadata?.flag || '🌐',
          region: response._metadata?.region || ''
        })
      } catch (error) {
        console.error(`Failed to load metadata for ${option.value}:`, error)
        enhancedOptions.push({
          ...option,
          flag: '🌐',
          region: ''
        })
      }
    }
    
    languageOptions.value = enhancedOptions
    await updateCurrentLanguageInfo()
  } catch (error) {
    console.error('Failed to initialize language options:', error)
    throw error
  }
}

// 初始化
onMounted(async () => {
  await initializeLanguageOptions()
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
  font-size: 28rpx;
  color: var(--settings-text-secondary);
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