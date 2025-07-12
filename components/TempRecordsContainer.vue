<template>
    <view class="temp-records-container">
        <scroll-view 
            class="temp-records" 
            scroll-y="true"
            scroll-x="true"
            show-scrollbar="true"
            :scroll-into-view="lastItemId"
            enable-passive="true"
            scroll-anchoring="true"
            enable-back-to-top="false"
            scroll-with-animation="true"
            upper-threshold="50"
            lower-threshold="50"
            bounces="true"
            fast-deceleration="false"
            @touchmove="onTouchMove"
        >
            <view v-for="(record, index) in tempRecords" :key="index" class="temp-record-item"
                :id="'temp-record-' + index">
                <text class="temp-record-expression">{{ expressionDisplay(record.expression) }}</text>
                <text class="temp-record-result">= {{ record.result }}</text>
            </view>
            <!-- 底部空白元素用于滚动定位 -->
            <view :id="'temp-record-' + (tempRecords.length)" class="scroll-anchor"></view>
        </scroll-view>
    </view>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useCalculator } from '@/composables/useCalculator.js'

const { tempRecords, expressionDisplay } = useCalculator()

// 监听tempRecords变化，自动滚动到底部
const lastItemId = ref('')
watch(() => tempRecords.value.length, (newLength) => {
    // 使用 scroll-into-view 功能滚动到最后一个元素
    if (newLength == 0) return
    nextTick(() => {
        lastItemId.value = 'temp-record-' + (newLength - 1)
    })
}, { immediate: true })


const onTouchMove = (e) => {
    // 处理触摸移动
    // console.log('触摸移动', e)
    // 防止事件冒泡导致页面滚动
    e.stopPropagation && e.stopPropagation()
}
</script>

<style scoped lang="scss">
.temp-records-container {
    padding: 0 40rpx;
    height: 100%; /* 使用100%高度填满父容器 */
    overflow: hidden;
    margin-bottom: 10rpx;
    display: flex;
    flex-direction: column;
    box-sizing: border-box; /* 确保内边距不会增加总高度 */
}

.temp-records {
    /* 为微信小程序设置固定高度 */
    height: 100%; /* 使用视口高度单位 */
    width: 100%;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y; /* 明确指定支持垂直滚动触摸操作 */
}

.temp-record-item {
    padding: 0;
    height: 80rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 100%; /* 改为min-width而不是width */
    width: max-content; /* 允许内容扩展宽度 */
}

.temp-record-expression {
    color: var(--theme-text-secondary);
    font-size: 24rpx;
    display: inline-block;
    width: max-content;
    text-align: right;
}

.temp-record-result {
    color: var(--theme-text-primary);
    font-size: 32rpx;
    font-weight: 500;
    display: inline-block;
    width: max-content;
    text-align: right;
}

.temp-record-expression, .temp-record-result {
    white-space: nowrap; /* 防止文本换行 */
    overflow: visible; /* 允许内容溢出 */
}

/* 底部滚动锚点 */
.scroll-anchor {
    height: 2rpx;
    width: 100%;
}
</style>