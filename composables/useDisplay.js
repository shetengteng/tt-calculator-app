import { useSettings } from './useSettings.js'
import { onMounted, onUnmounted } from 'vue'

const { settings } = useSettings()

/**
 * 限制输入的小数位数
 * @param {string} inputValue - 输入的字符串值
 * @returns {boolean} 是否允许输入
 */
const shouldAllowDecimalInput = (inputValue) => {
    if (!inputValue.includes('.')) return true

    const decimalPart = inputValue.split('.')[1] || ''
    return decimalPart.length < settings.decimalPlaces
}

/**
 * 格式化数字，应用小数位设置和千位分隔符
 * @param {number} value - 要格式化的数值
 * @returns {string} 格式化后的字符串
 */
const formatNumber = (value) => {
    // 如果不是数字，直接返回原值的字符串表示
    if (value === null || value === undefined || isNaN(Number(value))) {
        return String(value)
    }

    const num = Number(value)

    // 如果结果是整数，不需要格式化小数位，但可能需要千位分隔符
    let formattedResult = Number.isInteger(num) ? String(num) : num.toFixed(settings.decimalPlaces)

    // 如果启用了千位分隔符，添加千位分隔符
    if (settings.thousandSeparator) {
        // 分离整数部分和小数部分
        const parts = formattedResult.split('.')
        const integerPart = parts[0]
        const decimalPart = parts.length > 1 ? '.' + parts[1] : ''

        // 添加千位分隔符到整数部分
        formattedResult = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + decimalPart
    }

    return formattedResult
}

/**
 * 格式化表达式部分
 * @param {Object} part - 表达式部分对象
 * @returns {string} 格式化后的表达式部分
 */
const formatExpressionPart = (part) => {
    // 如果是数字类型，并且包含小数点，应用小数位设置
    if (part.action === 'number') {
        return formatNumber(part.value)
    }
    return part.text
}


/**
 * 格式化完整表达式
 * @param {Array} expressionParts - 表达式部分数组
 * @returns {string} 格式化后的完整表达式
 */
const formatExpression = (expressionParts) => {
    return expressionParts.map(part => formatExpressionPart(part)).join('')
}

/**
 * 显示表达式
 * @param {Array} expressionParts - 表达式部分数组
 * @returns {string} 格式化后的表达式字符串
 */
const expressionDisplay = (expressionParts) => {
    return expressionParts.map(part => part.text).join('')
}

// 设置变化事件处理函数
const handleSettingsChanged = ({ key }) => {
    // 触发自定义事件，通知其他组件设置已更改
    if (key === 'decimalPlaces' || key === 'thousandSeparator') {
        uni.$emit('displaySettingsChanged', { key, settings })
    }
}
/**
 * 用于处理显示格式化的组合式函数
 * 提供数字格式化、表达式显示等功能
 */
export function useDisplay() {
    // 监听设置变化
    onMounted(() => {
        uni.$on('settingsChanged', handleSettingsChanged)
    })

    // 组件卸载时移除事件监听器
    onUnmounted(() => {
        uni.$off('settingsChanged', handleSettingsChanged)
    })

    return {
        formatNumber,
        shouldAllowDecimalInput,
        formatExpressionPart,
        formatExpression,
        expressionDisplay
    }
} 