<template>
  <view class="drawer-container">
    <!-- 历史记录抽屉 -->
    <view
        class="history-drawer"
        :class="{ 'drawer-open': isOpen }"
        @touchstart="handleDrawerTouchStart"
        @touchend="handleDrawerTouchEnd"
    >
      <view class="drawer-content">
        <!-- 历史记录页面内容 -->
        <view class="drawer-header">
          <text class="drawer-title">{{ t('history.title') }}</text>
          <view class="header-actions">
            <CloseButton @click="closeDrawer"/>
          </view>
        </view>

        <!-- 历史记录列表 -->
        <scroll-view class="drawer-scroll" scroll-y="true">
          <view class="history-list">
            <!-- 按时间分组显示 -->
            <view v-for="group in groupedHistory" :key="group.date" class="history-group">
              <view class="group-header">
                <text class="group-title">{{ group.title }}</text>
              </view>
              <view class="group-items">
                <view class="history-item" v-for="(item) in group.items" :key="item.id">
                  <view class="history-info">
                    <text class="history-title">{{ expression(item) }} = {{ item.result }}</text>
                    <view class="history-description-with-icon">
                      <SvgIcon name="ri-time-line" size="24"
                          :color="getCurrentPracticalTheme().colors.settingsTextSecondary"/>
                      <text class="history-description">{{ item.formattedTimestamp }}</text>
                    </view>
                  </view>
                  <view class="history-control">
                    <CopyButton :text="String(item.result)"/>
                  </view>
                </view>
              </view>
            </view>

            <view class="empty-history" v-if="!hasHistory">
              <text class="empty-text">{{ t('history.empty') }}</text>
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
    />

  </view>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import CloseButton from '@/components/base/CloseButton.vue'
import CopyButton from '@/components/base/CopyButton.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'
import {useI18n} from '@/composables/useI18n.js'
import {useCalculatorHistory} from '@/composables/useCalculatorHistory.js'
import {formatTimestamp, getDateKey, getDateTitle} from '@/utils/dateUtils.js'
import {useCalculator} from "@/composables/useCalculator";
import {useTheme} from "@/composables/useTheme";

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const {t} = useI18n()
const {history, loadHistory} = useCalculatorHistory()
const { expressionDisplay } = useCalculator()
const {getCurrentPracticalTheme} = useTheme()

const emit = defineEmits(['close'])


const expression = (item) => {
  return expressionDisplay(item.expression)
}

// 触摸相关
const touchStartX = ref(0)
const touchStartY = ref(0)

// 计算属性 - 检查是否有历史记录
const hasHistory = computed(() => {
  return history.value && history.value.length > 0
})

// 格式化时间戳的辅助函数
const formatHistoryTimestamp = (timestamp) => {
  return formatTimestamp(timestamp)
}

// 计算属性 - 按时间分组的历史记录
const groupedHistory = computed(() => {
  if (!history.value || !Array.isArray(history.value)) {
    return []
  }

  const groups = {}
  const now = new Date()

  history.value.forEach((item, index) => {
    const date = new Date(item.timestamp)
    const dateKey = getDateKey(date, now)

    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dateKey,
        title: getDateTitle(date, now, t),
        items: [],
        sortDate: date
      }
    }

    groups[dateKey].items.push({
      ...item,
      formattedTimestamp: formatHistoryTimestamp(item.timestamp),
      id: `history-${index}`
    })
  })

  // 按日期排序，最新的在前面
  const sortedGroups = Object.values(groups).sort((a, b) => {
    // 今天和昨天的特殊处理
    if (a.date === 'today') return -1
    if (b.date === 'today') return 1
    if (a.date === 'yesterday') return -1
    if (b.date === 'yesterday') return 1

    // 其他日期按时间排序
    return new Date(b.sortDate) - new Date(a.sortDate)
  })

  // 对每个分组内的项目按时间排序（最新的在前面）
  sortedGroups.forEach(group => {
    group.items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  })

  return sortedGroups
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

const handleDrawerTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY

  const deltaX = touchEndX - touchStartX.value
  const deltaY = touchEndY - touchStartY.value

  // 如果是向右滑动且水平距离大于垂直距离，关闭抽屉
  if (deltaX > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
    closeDrawer()
  }
}

// 监听抽屉打开状态，每次打开时加载历史记录
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // 每次打开抽屉都加载历史记录，确保数据是最新的
    loadHistory()
  }
})

onMounted(() => {
  // 组件挂载时加载历史记录
  loadHistory()
})
</script>

<style scoped lang="scss">
.drawer-container {
  position: relative;
}

/* 历史记录抽屉 */
.history-drawer {
  position: fixed;
  top: 0;
  right: -80%;
  width: 80%;
  height: 100vh;
  background: var(--theme-drawer-background);
  z-index: 1000;
  transition: right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: -2px 0 10px var(--theme-shadow-color, rgba(0, 0, 0, 0.1));
}

.history-drawer.drawer-open {
  right: 0;
}

.drawer-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

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
  gap: 20rpx;
}

.drawer-scroll {
  flex: 1;
  /* 修复宽度问题 - 确保不超过父容器宽度 */
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  /* 添加iOS流畅滚动支持 */
  -webkit-overflow-scrolling: touch;
}

.history-list {
  padding: 20rpx 0;
}

/* 分组样式 */
.history-group {
  margin-bottom: 32rpx;
}

.group-header {
  padding: 16rpx 40rpx;
  background: var(--theme-drawer-background);
}

.group-title {
  font-size: 26rpx;
  font-weight: 500;
  color: var(--settings-text-secondary);
}

.group-items {
  background: var(--theme-drawer-item-background);
  border-radius: 12rpx;
  margin: 0 20rpx;
  overflow: hidden;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: var(--settings-card-background);
  border-bottom: none;
  min-height: 60rpx;
  transition: background-color 0.2s ease;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.history-title {
  font-size: 28rpx;
  font-weight: 400;
  color: var(--settings-text-primary);
  line-height: 1.4;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
}

.history-description-with-icon {
  display: flex;
  align-items: center;
  gap: 8rpx;
  line-height: 1.3;
}

.history-description-with-icon svg {
  height: 1em;
  width: auto;
}

.history-description {
  font-size: 24rpx;
  color: var(--settings-text-secondary);
  line-height: 1.3;
  font-weight: 400;
}

.history-control {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.empty-history {
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-text {
  color: var(--theme-light-gray);
  font-size: 32rpx;
}

/* 遮罩层 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: var(--theme-overlay);
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
  .history-drawer {
    width: 85%;
    right: -85%;
  }
}

/* iPhone 4/4S 专门优化 */
@include iphone4-optimization {
  .history-drawer {
    width: 85%;
    right: -85%;
  }
}

/* 超小高度屏幕 */
@include extra-low-height-screen {
  .history-drawer {
    width: 50rpx !important;
    height: 50rpx !important;
    padding: 10rpx !important;
  }

  .icon-svg {
    width: 32rpx !important;
    height: 32rpx !important;
  }
}


</style>