import { PlatformAdapter } from '@/compatibility'
import { useSettings } from './useSettings.js'

// 获取设置
const { settings } = useSettings()

// 检查是否支持触觉反馈
const isVibrationSupported = () => {
    return PlatformAdapter.system.isSupported('vibration')
}

// 触发短振动
const triggerShortVibration = async () => {
    if (settings.hapticFeedback) {
        console.log('触发短振动，支持状态:', isVibrationSupported())
        try {
            const result = await PlatformAdapter.system.vibrate('short')
            console.log('短振动结果:', result)
            return result
        } catch (error) {
            console.error('短振动错误:', error)
            return false
        }
    }
    return false
}

// 触发长振动
const triggerLongVibration = async () => {
    if (settings.hapticFeedback) {
        console.log('触发长振动，支持状态:', isVibrationSupported())
        try {
            const result = await PlatformAdapter.system.vibrate('long')
            console.log('长振动结果:', result)
            return result
        } catch (error) {
            console.error('长振动错误:', error)
            return false
        }
    }
    return false
}

export function useHapticFeedback() {
    return {
        triggerShortVibration,
        triggerLongVibration,
        isVibrationSupported
    }
} 