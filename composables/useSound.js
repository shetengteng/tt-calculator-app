import { ref } from 'vue'
import soundConfigModule from '../config/sounds/index.js'
import { audioAdapter } from '../compatibility/audio/index.js'

// 音效配置
const soundConfig = soundConfigModule.soundConfig

export function useSound() {
  
  // 初始化音效系统
  const initializeSound = async () => {
    // 清理现有资源
    cleanupSounds()
    console.log('Sound cache cleared, reinitializing...')
    
    try {
      // 使用兼容性适配器初始化音频系统
      await audioAdapter.initializeAudioSystem()
      console.log('Sound system initialized successfully')
    } catch (error) {
      console.error('[error] Failed to refresh sound cache:', error)
    }
  }
  
  // 预加载音效文件
  const preloadSounds = async (soundType) => {
    if (!soundConfig || !soundConfig.soundTypes[soundType]) return
    
    const soundFiles = soundConfig.soundTypes[soundType].files
    const promises = []
    
    for (const [scenario, filePath] of Object.entries(soundFiles)) {
      const cacheKey = `${soundType}_${scenario}`
      if (!audioAdapter.isAudioAvailable(cacheKey)) {
        const fullPath = `/static/sounds/${filePath}`
        promises.push(audioAdapter.preloadAudio(fullPath, cacheKey))
      }
    }
    
    await Promise.all(promises)
  }
  
  // 播放音效
  const playSound = async (soundType, scenario, volume = 1.0) => {
    // 每次播放前都重新初始化
    await initializeSound()
    
    if (soundType === 'none' || !soundConfig) return
    
    const cacheKey = `${soundType}_${scenario}`
    
    try {
      // 确保音效已加载
      if (!audioAdapter.isAudioAvailable(cacheKey)) {
        await preloadSounds(soundType)
      }
      
      // 获取推荐音量
      const recommendedVolume = soundConfig.recommendedVolume[scenario] || 1.0
      const finalVolume = volume * recommendedVolume
      
      // 使用兼容性适配器播放音效
      await audioAdapter.playAudio(cacheKey, finalVolume)
      
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
  
  // 停止所有音效
  const stopAllSounds = () => {
    audioAdapter.stopAllAudio()
  }
  
  // 清理音效资源
  const cleanupSounds = () => {
    audioAdapter.cleanup()
  }
  
  // 获取音效配置
  const getSoundConfig = () => {
    return soundConfig
  }
  
  // 检查音效是否可用
  const isSoundAvailable = (soundType, scenario) => {
    const cacheKey = `${soundType}_${scenario}`
    return audioAdapter.isAudioAvailable(cacheKey)
  }
  
  return {
    // 方法
    initializeSound,
    preloadSounds,
    playSound,
    playButtonSound,
    playResultSound,
    stopAllSounds,
    cleanupSounds,
    getSoundConfig,
    isSoundAvailable
  }
} 