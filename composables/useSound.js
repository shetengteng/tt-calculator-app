import { ref } from 'vue'

// 音效配置
let soundConfig = null
const audioContext = ref(null)
const audioBuffers = {}

// 音效实例缓存
const audioInstances = {}

export function useSound() {
  
  // 初始化音效系统
  const initializeSound = async () => {
    // 清理现有资源
    cleanupSounds()
    console.log('Sound cache cleared, reinitializing...')
    
    try {
      // 加载音效配置
      await loadSoundConfig()
      
      // 初始化音频上下文（如果支持）
      if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const AudioContextClass = AudioContext || webkitAudioContext
        audioContext.value = new AudioContextClass()
      }
      
      console.log('Sound system initialized successfully')
    } catch (error) {
      console.error('Failed to refresh sound cache:', error)
    }
  }
  
  // 加载音效配置
  const loadSoundConfig = async () => {
    try {
      const response = await fetch('/static/sounds/index.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      soundConfig = await response.json()
      console.log('Sound config loaded successfully from index.json')
    } catch (error) {
      console.error('Failed to load sound config from index.json:', error)
      // 配置文件是必需的，不提供后备方案
      throw new Error('Sound configuration file is required but not found')
    }
  }
  
  // 预加载音效文件
  const preloadSounds = async (soundType) => {
    if (!soundConfig || !soundConfig.soundTypes[soundType]) return
    
    const soundFiles = soundConfig.soundTypes[soundType].files
    const promises = []
    
    for (const [scenario, filePath] of Object.entries(soundFiles)) {
      const cacheKey = `${soundType}_${scenario}`
      if (!audioBuffers[cacheKey]) {
        promises.push(loadSoundFile(filePath, cacheKey))
      }
    }
    
    await Promise.all(promises)
  }
  
  // 加载单个音效文件
  const loadSoundFile = async (filePath, cacheKey) => {
    try {
      const fullPath = `/static/sounds/${filePath}`
      
      // 对于小程序环境，使用 uni.createInnerAudioContext
      if (typeof uni !== 'undefined' && uni.createInnerAudioContext) {
        const audio = uni.createInnerAudioContext()
        audio.src = fullPath
        audioInstances[cacheKey] = audio
        return
      }
      
      // 对于H5环境，使用HTML5 Audio
      if (typeof Audio !== 'undefined') {
        const audio = new Audio(fullPath)
        audio.preload = 'auto'
        audioInstances[cacheKey] = audio
        return
      }
      
      // 对于支持AudioContext的环境
      if (audioContext.value) {
        const response = await fetch(fullPath)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContext.value.decodeAudioData(arrayBuffer)
        audioBuffers[cacheKey] = audioBuffer
      }
      
    } catch (error) {
      console.warn(`Failed to load sound file: ${filePath}`, error)
    }
  }
  
  // 播放音效
  const playSound = async (soundType, scenario, volume = 1.0) => {
    // 每次播放前都重新初始化
    await initializeSound()
    
    if (soundType === 'none' || !soundConfig) return
    
    const cacheKey = `${soundType}_${scenario}`
    
    try {
      // 确保音效已加载
      if (!audioInstances[cacheKey] && !audioBuffers[cacheKey]) {
        await preloadSounds(soundType)
      }
      
      // 获取推荐音量
      const recommendedVolume = soundConfig.recommendedVolume[scenario] || 1.0
      const finalVolume = volume * recommendedVolume
      
      // 使用uni音频实例播放
      if (audioInstances[cacheKey]) {
        const audio = audioInstances[cacheKey]
        audio.volume = finalVolume
        audio.currentTime = 0
        audio.play()
        return
      }
      
      // 使用AudioContext播放
      if (audioBuffers[cacheKey] && audioContext.value) {
        const source = audioContext.value.createBufferSource()
        const gainNode = audioContext.value.createGain()
        
        source.buffer = audioBuffers[cacheKey]
        gainNode.gain.value = finalVolume
        
        source.connect(gainNode)
        gainNode.connect(audioContext.value.destination)
        
        source.start(0)
      }
      
    } catch (error) {
      console.warn(`Failed to play sound: ${soundType}/${scenario}`, error)
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
    // 停止uni音频实例
    Object.values(audioInstances).forEach(audio => {
      if (audio && typeof audio.stop === 'function') {
        audio.stop()
      }
    })
    
    // 停止AudioContext
    if (audioContext.value && audioContext.value.state !== 'closed') {
      audioContext.value.suspend()
    }
  }
  
  // 清理音效资源
  const cleanupSounds = () => {
    stopAllSounds()
    
    // 清理音频实例
    Object.values(audioInstances).forEach(audio => {
      if (audio && typeof audio.destroy === 'function') {
        audio.destroy()
      }
    })
    
    // 清理AudioContext
    if (audioContext.value && audioContext.value.state !== 'closed') {
      audioContext.value.close()
    }
    
    // 清理缓存
    Object.keys(audioBuffers).forEach(key => {
      delete audioBuffers[key]
    })
    Object.keys(audioInstances).forEach(key => {
      delete audioInstances[key]
    })
  }
  
  // 获取音效配置
  const getSoundConfig = () => {
    return soundConfig
  }
  
  // 检查音效是否可用
  const isSoundAvailable = (soundType, scenario) => {
    const cacheKey = `${soundType}_${scenario}`
    return !!(audioInstances[cacheKey] || audioBuffers[cacheKey])
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