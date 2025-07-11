import soundConfigModule from '../config/sounds/index.js'
import { PlatformAdapter } from '@/compatibility/index'

// 音效配置
const soundConfig = soundConfigModule.soundConfig

// 清理音效资源
const cleanupSounds = () => {
  PlatformAdapter.audio.cleanup()
}

// 预加载音效文件
const preloadSounds = async (soundType) => {
  if (!soundConfig || !soundConfig.soundTypes[soundType]) return

  const soundFiles = soundConfig.soundTypes[soundType].files
  const promises = []

  for (const [scenario, filePath] of Object.entries(soundFiles)) {
    const cacheKey = `${soundType}_${scenario}`
    if (!PlatformAdapter.audio.isAudioAvailable(cacheKey)) {
      const fullPath = `/static/sounds/${filePath}`
      promises.push(PlatformAdapter.audio.preloadAudio(fullPath, cacheKey))
    }
  }

  await Promise.all(promises)
}

// 停止所有音效
const stopAllSounds = () => {
  PlatformAdapter.audio.stopAllAudio()
}

// 检查音效是否可用
const isSoundAvailable = (soundType, scenario) => {
  const cacheKey = `${soundType}_${scenario}`
  return PlatformAdapter.audio.isAudioAvailable(cacheKey)
}

// 初始化音效系统
const initializeSound = async () => {
  // 清理现有资源
  cleanupSounds()
  console.log('Sound cache cleared, reinitializing...')

  try {
    // 使用兼容性适配器初始化音频系统
    await PlatformAdapter.audio.initializeAudioSystem()
    console.log('Sound system initialized successfully')
  } catch (error) {
    console.error('[error] Failed to refresh sound cache:', error)
  }
}

// 播放音效
const playSound = async (soundType, scenario, volume = 1.0) => {

  if (soundType === 'none' || !soundConfig) return

  const cacheKey = `${soundType}_${scenario}`

  try {
    // 确保音效已加载
    if (!PlatformAdapter.audio.isAudioAvailable(cacheKey)) {
      await preloadSounds(soundType)
    }

    // 获取推荐音量
    const recommendedVolume = soundConfig.recommendedVolume[scenario] || 1.0
    const finalVolume = volume * recommendedVolume

    // 使用兼容性适配器播放音效
    await PlatformAdapter.audio.playAudio(cacheKey, finalVolume)

  } catch (error) {
    console.warn(`[warn] Failed to play sound: ${soundType}/${scenario}`, error)
  }
}

// 播放按键音效
const playButtonSound = (soundType, volume = 1.0) => {
  return playSound(soundType, 'buttonPress', volume)
}

// 播放结果音效
const playResultSound = (soundType, volume = 1.0) => {
  return playSound(soundType, 'result', volume)
}

export function useSound() {
  
  return {
    // 方法
    initializeSound,
    preloadSounds,
    playSound,
    playButtonSound,
    playResultSound,
    stopAllSounds,
    cleanupSounds,
    isSoundAvailable
  }
} 