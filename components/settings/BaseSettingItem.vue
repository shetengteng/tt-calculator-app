<template>
  <view class="setting-item" @click="handleClick">
    <view class="setting-info">
      <text class="setting-title" :class="{ 'danger-text': isDanger }">{{ title }}</text>
      <text class="setting-description">{{ description }}</text>
    </view>
    <view class="setting-control">
      <slot name="control"></slot>
    </view>
  </view>
</template>

<script setup>
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
  isDanger: {
    type: Boolean,
    default: false
  },
  clickable: {
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
</style> 