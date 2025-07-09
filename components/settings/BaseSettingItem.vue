<template>
  <view class="setting-item" :class="{ 'clickable': clickable, 'danger': isDanger }" @click="handleClick">
    <view class="setting-icon" v-if="icon">
      <SvgIcon 
        size="30"
        :name="icon" 
        color="var(--settings-text-secondary)"
      />
    </view>
    <view class="setting-info">
      <text class="setting-title" :class="{ 'danger-text': isDanger }">{{ title }}</text>
      <text class="setting-description" v-if="description">{{ description }}</text>
    </view>
    <view class="setting-control">
      <slot name="control"></slot>
      <view class="chevron" v-if="showChevron">
        <text class="chevron-icon">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import SvgIcon from '@/components/base/SvgIcon.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  isDanger: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  showChevron: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['click'])

// 处理点击事件
const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped lang="scss">
.setting-item {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: var(--settings-card-background);
  border-bottom: 1px solid var(--settings-separator);
  min-height: 60rpx;
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.clickable {
    cursor: pointer;
    
    &:active {
      background: var(--settings-separator);
    }
  }
}

.setting-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}



.setting-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.setting-title {
  font-size: 28rpx;
  font-weight: 400;
  color: var(--settings-text-primary);
  line-height: 1.4;
  
  &.danger-text {
    color: var(--settings-danger-color);
  }
}

.setting-description {
  font-size: 24rpx;
  color: var(--settings-text-secondary);
  line-height: 1.3;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.chevron {
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chevron-icon {
  font-size: 24rpx;
  color: var(--settings-text-secondary);
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .setting-item {
    padding: 14rpx 20rpx;
  }
  
  .setting-title {
    font-size: 26rpx;
  }
  
  .setting-description {
    font-size: 22rpx;
  }
}
</style> 