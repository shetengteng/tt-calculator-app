/**
 * 音频操作适配器
 * 提供跨平台的音频操作接口
 */

class AudioAdapter {
  constructor() {
    this.audioContext = null
    this.audioInstances = {}
    this.audioBuffers = {}
  }
  
  /**
   * 初始化音频系统
   * @returns {Promise<void>}
   */
  async initializeAudioSystem() {
    try {
      // #ifdef H5
      // H5环境初始化AudioContext
      if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const AudioContextClass = AudioContext || webkitAudioContext
        this.audioContext = new AudioContextClass()
      }
      // #endif
      
      // #ifdef MP
      // 小程序环境无需特殊初始化
      console.log('Audio system initialized for mini-program')
      // #endif
      
      console.log('Audio system initialized successfully')
    } catch (error) {
      console.error('Failed to initialize audio system:', error)
      throw error
    }
  }
  
  /**
   * 创建音频实例
   * @param {string} src - 音频源路径
   * @param {string} key - 缓存键
   * @returns {Promise<any>} 音频实例
   */
  async createAudioInstance(src, key) {
    try {
      // #ifdef MP
      // 小程序环境使用 uni.createInnerAudioContext
      if (typeof uni !== 'undefined' && uni.createInnerAudioContext) {
        const audio = uni.createInnerAudioContext()
        audio.src = src
        this.audioInstances[key] = audio
        return audio
      }
      // #endif
      
      // #ifdef H5
      // H5环境使用HTML5 Audio
      if (typeof Audio !== 'undefined') {
        const audio = new Audio(src)
        audio.preload = 'auto'
        this.audioInstances[key] = audio
        return audio
      }
      // #endif
      
      throw new Error('Audio not supported in current environment')
    } catch (error) {
      console.warn(`Failed to create audio instance for ${src}:`, error)
      throw error
    }
  }
  
  /**
   * 预加载音频文件
   * @param {string} src - 音频源路径
   * @param {string} key - 缓存键
   * @returns {Promise<void>}
   */
  async preloadAudio(src, key) {
    try {
      if (!this.audioInstances[key]) {
        await this.createAudioInstance(src, key)
      }
    } catch (error) {
      console.warn(`Failed to preload audio ${src}:`, error)
    }
  }
  
  /**
   * 播放音频
   * @param {string} key - 缓存键
   * @param {number} volume - 音量 (0-1)
   * @returns {Promise<void>}
   */
  async playAudio(key, volume = 1.0) {
    try {
      const audio = this.audioInstances[key]
      if (!audio) {
        throw new Error(`Audio instance not found for key: ${key}`)
      }
      
      // #ifdef MP
      // 小程序环境播放
      if (audio.play) {
        audio.volume = volume
        audio.currentTime = 0
        audio.play()
        return
      }
      // #endif
      
      // #ifdef H5
      // H5环境播放
      if (audio.play) {
        audio.volume = volume
        audio.currentTime = 0
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          await playPromise
        }
        return
      }
      // #endif
      
      throw new Error('Audio playback not supported')
    } catch (error) {
      console.warn(`Failed to play audio ${key}:`, error)
    }
  }
  
  /**
   * 停止音频播放
   * @param {string} key - 缓存键
   */
  stopAudio(key) {
    try {
      const audio = this.audioInstances[key]
      if (audio && audio.stop) {
        audio.stop()
      }
    } catch (error) {
      console.warn(`Failed to stop audio ${key}:`, error)
    }
  }
  
  /**
   * 停止所有音频播放
   */
  stopAllAudio() {
    Object.values(this.audioInstances).forEach(audio => {
      if (audio && audio.stop) {
        audio.stop()
      }
    })
    
    // #ifdef H5
    // 停止AudioContext
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.suspend()
    }
    // #endif
  }
  
  /**
   * 设置音频音量
   * @param {string} key - 缓存键
   * @param {number} volume - 音量 (0-1)
   */
  setVolume(key, volume) {
    try {
      const audio = this.audioInstances[key]
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, volume))
      }
    } catch (error) {
      console.warn(`Failed to set volume for audio ${key}:`, error)
    }
  }
  
  /**
   * 检查音频是否支持
   * @returns {boolean} 是否支持音频
   */
  isAudioSupported() {
    // #ifdef H5
    return typeof Audio !== 'undefined' || (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined')
    // #endif
    
    // #ifdef MP
    return typeof uni !== 'undefined' && uni.createInnerAudioContext
    // #endif
    
    return false
  }
  
  /**
   * 获取音频实例
   * @param {string} key - 缓存键
   * @returns {any|null} 音频实例
   */
  getAudioInstance(key) {
    return this.audioInstances[key] || null
  }
  
  /**
   * 检查音频是否可用
   * @param {string} key - 缓存键
   * @returns {boolean} 音频是否可用
   */
  isAudioAvailable(key) {
    return !!this.audioInstances[key]
  }
  
  /**
   * 清理音频资源
   */
  cleanup() {
    // 停止所有音频
    this.stopAllAudio()
    
    // 清理音频实例
    Object.values(this.audioInstances).forEach(audio => {
      if (audio && audio.destroy) {
        audio.destroy()
      }
    })
    
    // #ifdef H5
    // 清理AudioContext
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
    }
    // #endif
    
    // 清理缓存
    this.audioInstances = {}
    this.audioBuffers = {}
    this.audioContext = null
  }
}

export const audioAdapter = new AudioAdapter()
export default audioAdapter 