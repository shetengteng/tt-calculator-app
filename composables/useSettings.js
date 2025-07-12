import { ref, reactive } from 'vue'
import { PlatformAdapter } from "@/compatibility"

// 设置默认值
const DEFAULT_SETTINGS = {
  decimalPlaces: 2,
  thousandSeparator: true,
  hapticFeedback: true,
  soundType: 'none',
  soundVolume: 50,
  soundScenarios: {
    buttonPress: true,
    calculation: true,
    result: true,
    error: true
  },
  autoCopyResult: false,
  autoSaveHistory: true
}

// 全局设置状态
const settings = reactive({
  decimalPlaces: DEFAULT_SETTINGS.decimalPlaces,
  thousandSeparator: DEFAULT_SETTINGS.thousandSeparator,
  hapticFeedback: DEFAULT_SETTINGS.hapticFeedback,
  soundType: DEFAULT_SETTINGS.soundType,
  soundVolume: DEFAULT_SETTINGS.soundVolume,
  soundScenarios: DEFAULT_SETTINGS.soundScenarios,
  autoCopyResult: DEFAULT_SETTINGS.autoCopyResult,
  autoSaveHistory: DEFAULT_SETTINGS.autoSaveHistory
})

// 设置是否已初始化
const isInitialized = ref(false)

export function useSettings() {
  // 从本地存储加载设置
  const loadSettings = () => {
    try {
      const savedSettings = PlatformAdapter.storage.getSync('calculator-settings')
      if (savedSettings) {
        Object.keys(DEFAULT_SETTINGS).forEach(key => {
          if (savedSettings[key] !== undefined) {
            settings[key] = savedSettings[key]
          }
        })
      }

      // 迁移旧的音效设置
      if (savedSettings && savedSettings.soundEffects !== undefined && !savedSettings.soundType) {
        // 将旧的布尔值转换为新的字符串值
        settings.soundType = savedSettings.soundEffects ? 'classic' : 'none'
      }

      // 确保新的音效设置字段存在
      if (!settings.soundType) {
        settings.soundType = DEFAULT_SETTINGS.soundType
      }
      if (!settings.soundVolume) {
        settings.soundVolume = DEFAULT_SETTINGS.soundVolume
      }
      if (!settings.soundScenarios) {
        settings.soundScenarios = { ...DEFAULT_SETTINGS.soundScenarios }
      }

      isInitialized.value = true
    } catch (error) {
      console.error('[error] Failed to load settings:', error)
      isInitialized.value = true
    }
  }

  // 保存设置到本地存储
  const saveSettings = () => {
    try {
      PlatformAdapter.storage.setSync('calculator-settings', { ...settings })
    } catch (error) {
      console.error('[error] Failed to save settings:', error)
    }
  }

  // 更新单个设置
  const updateSetting = (key, value) => {
    if (settings.hasOwnProperty(key)) {
      settings[key] = value
      saveSettings()
      // 通知设置变更
      notifySettingsChanged(key, value)
    }
  }

  // 设置变更通知
  const notifySettingsChanged = (key, value) => {
    // 发送自定义事件通知设置变更
    uni.$emit('settingsChanged', { key, value, settings: { ...settings } })
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
    notifySettingsChanged,
    resetSettings,
    getSetting,
    isInitialized
  }
} 