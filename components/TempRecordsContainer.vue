<template>
    <view class="temp-records-container">
        <scroll-view class="temp-records" scroll-y="true" scroll-x="true" show-scrollbar="false"
            :scroll-into-view="lastItemId" :enhanced="true" :bounces="true">
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
    height: 100%;
    /* 保持100%以填满容器 */
    width: 100%;
    flex-direction: column;
}

.temp-record-item {
    padding: 6rpx 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
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

/* 底部滚动锚点 */
.scroll-anchor {
    height: 2rpx;
    width: 100%;
}
</style>