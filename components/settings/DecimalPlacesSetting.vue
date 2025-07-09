<template>
  <view class="decimal-places-setting">
    <!-- 小数位数设置头部 -->
    <BaseSettingItem
        :title="t('settings.decimalPlaces')"
        icon="ri-hashtag"
        :clickable="true"
        :showChevron="true"
        @click="toggleCollapse"
    >
      <template #control>
        <view class="current-decimal">
          <text class="decimal-text">{{ currentDecimalText }}</text>
        </view>
      </template>
    </BaseSettingItem>

    <!-- 折叠面板内容 -->
    <view class="decimal-collapse" :class="{ 'collapsed': !isExpanded }">
      <view class="decimal-options">
        <view
            class="decimal-option"
            v-for="option in decimalOptionsDetailed"
            :key="option.value"
            :class="{ 'active': option.value === currentDecimalPlaces }"
            @click="selectDecimalPlaces(option.value)"
        >
          <view class="option-content">
            <view class="option-icon">
              <SvgIcon :name="option.icon"
                       size="32"
                       :color="getCurrentPracticalTheme().colors.settingsTextSecondary"/>
            </view>
            <view class="option-text">
              <text class="option-name">{{ option.name }}</text>
              <text class="option-description">{{ option.description }}</text>
            </view>
          </view>
          <view class="option-check" v-if="option.value === currentDecimalPlaces">
            <text class="check-icon">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {computed, ref} from 'vue'
import BaseSettingItem from './BaseSettingItem.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'
import {useSettings} from '@/composables/useSettings.js'
import {useI18n} from '@/composables/useI18n.js'
import {useTheme} from "@/composables/useTheme";


// Emits
const emit = defineEmits(['change'])

// 使用设置管理和国际化
const {settings, updateSetting} = useSettings()
const {getCurrentPracticalTheme} = useTheme()
const {t} = useI18n()
// 组件状态
const isExpanded = ref(false)

// 小数位数选项详情
const decimalOptionsDetailed = computed(() => [
  {
    value: 0,
    name: t('settings.decimalPlacesOptions_0') || '整数',
    description: t('settings.decimalPlacesOptions_0_desc') || '不显示小数位',
    icon: 'ri-hashtag'
  },
  {
    value: 1,
    name: t('settings.decimalPlacesOptions_1') || '1位小数',
    description: t('settings.decimalPlacesOptions_1_desc') || '显示1位小数',
    icon: 'ri-number-1'
  },
  {
    value: 2,
    name: t('settings.decimalPlacesOptions_2') || '2位小数',
    description: t('settings.decimalPlacesOptions_2_desc') || '显示2位小数',
    icon: 'ri-number-2'
  },
  {
    value: 3,
    name: t('settings.decimalPlacesOptions_3') || '3位小数',
    description: t('settings.decimalPlacesOptions_3_desc') || '显示3位小数',
    icon: 'ri-number-3'
  },
  {
    value: 4,
    name: t('settings.decimalPlacesOptions_4') || '4位小数',
    description: t('settings.decimalPlacesOptions_4_desc') || '显示4位小数',
    icon: 'ri-number-4'
  },
  {
    value: 5,
    name: t('settings.decimalPlacesOptions_5') || '5位小数',
    description: t('settings.decimalPlacesOptions_5_desc') || '显示5位小数',
    icon: 'ri-number-5'
  }
])

// 当前小数位数
const currentDecimalPlaces = computed(() => settings.decimalPlaces)

// 当前显示文本
const currentDecimalText = computed(() => {
  const option = decimalOptionsDetailed.value.find(opt => opt.value === currentDecimalPlaces.value)
  return option ? option.name : '2位小数'
})

// 切换折叠状态
const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value
}

// 选择小数位数
const selectDecimalPlaces = (decimalPlaces) => {
  // 更新设置（会自动通过事件通知系统）
  updateSetting('decimalPlaces', decimalPlaces)

  // 触发变更事件
  emit('change', {
    type: 'decimalPlaces',
    value: decimalPlaces
  })

  // 选择后自动收起
  isExpanded.value = false
}

// 无需监听计算器实例变化，设置通过事件系统自动应用
</script>

<style scoped lang="scss">
.decimal-places-setting {
  background: var(--settings-card-background);
  border-radius: 16rpx;
  overflow: hidden;
}

.current-decimal {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.decimal-text {
  font-size: 28rpx !important;
  color: var(--settings-text-secondary);
  font-weight: 400 !important;
}

.decimal-collapse {
  max-height: 1000rpx;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.decimal-collapse.collapsed {
  max-height: 0;
}

.decimal-options {
  border-top: 1px solid var(--settings-separator);
}

.decimal-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 40rpx;
  border-bottom: 1px solid var(--settings-separator);
  transition: background-color 0.2s ease;
}

.decimal-option:last-child {
  border-bottom: none;
}

.decimal-option:active {
  background: var(--theme-overlay);
}

.decimal-option.active {
  background: rgba(0, 122, 255, 0.1);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.option-icon {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
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
  .decimal-option {
    padding: 16rpx 32rpx;
  }

  .option-icon {
    width: 48rpx;
    height: 48rpx;
  }

  .option-name {
    font-size: 28rpx;
  }

  .option-description {
    font-size: 22rpx;
  }

  .decimal-text {
    font-size: 24rpx;
  }
}
</style>