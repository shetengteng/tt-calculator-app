import { ref, reactive } from 'vue'

// 设置默认值
const DEFAULT_SETTINGS = {
  decimalPlaces: 2,
  thousandSeparator: true,
  hapticFeedback: true,
  soundEffects: false,
  autoCopyResult: false,
  autoSaveHistory: true
}

// 全局设置状态
const settings = reactive({
  decimalPlaces: DEFAULT_SETTINGS.decimalPlaces,
  thousandSeparator: DEFAULT_SETTINGS.thousandSeparator,
  hapticFeedback: DEFAULT_SETTINGS.hapticFeedback,
  soundEffects: DEFAULT_SETTINGS.soundEffects,
  autoCopyResult: DEFAULT_SETTINGS.autoCopyResult,
  autoSaveHistory: DEFAULT_SETTINGS.autoSaveHistory
})

// 设置是否已初始化
const isInitialized = ref(false)

export function useSettings() {
  // 从本地存储加载设置
  const loadSettings = () => {
    try {
      const savedSettings = uni.getStorageSync('calculator-settings')
      if (savedSettings) {
        Object.keys(DEFAULT_SETTINGS).forEach(key => {
          if (savedSettings[key] !== undefined) {
            settings[key] = savedSettings[key]
          }
        })
      }
      isInitialized.value = true
    } catch (error) {
      console.error('Failed to load settings:', error)
      isInitialized.value = true
    }
  }

  // 保存设置到本地存储
  const saveSettings = () => {
    try {
      uni.setStorageSync('calculator-settings', { ...settings })
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  // 更新单个设置
  const updateSetting = (key, value) => {
    if (settings.hasOwnProperty(key)) {
      settings[key] = value
      saveSettings()
    }
  }

  // 应用设置到计算器实例
  const applySettingsToCalculator = (calculator) => {
    if (calculator && typeof calculator.updateSettings === 'function') {
      calculator.updateSettings({ ...settings })
    }
  }

  // 重置设置为默认值
  const resetSettings = () => {
    Object.keys(DEFAULT_SETTINGS).forEach(key => {
      settings[key] = DEFAULT_SETTINGS[key]
    })
    saveSettings()
  }

  // 获取特定设置的值
  const getSetting = (key) => {
    return settings[key]
  }

  // 初始化设置（如果还未初始化）
  if (!isInitialized.value) {
    loadSettings()
  }

  return {
    settings,
    loadSettings,
    saveSettings,
    updateSetting,
    applySettingsToCalculator,
    resetSettings,
    getSetting,
    isInitialized
  }
} 