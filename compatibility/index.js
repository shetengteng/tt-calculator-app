/**
 * 兼容性层主入口
 * 提供统一的跨平台API接口
 */

import { domAdapter } from './dom/index.js'
import { audioAdapter } from './audio/index.js'
import { storageAdapter } from './storage/index.js'
import { systemAdapter } from './system/index.js'

export const PlatformAdapter = {
  // DOM操作适配器
  dom: domAdapter,
  
  // 音频操作适配器
  audio: audioAdapter,
  
  // 存储操作适配器
  storage: storageAdapter,
  
  // 系统信息适配器
  system: systemAdapter,
  
  // 平台检测
  getPlatform() {
    // #ifdef H5
    return 'h5'
    // #endif
    
    // #ifdef MP-WEIXIN
    return 'mp-weixin'
    // #endif
    
    // #ifdef MP-ALIPAY
    return 'mp-alipay'
    // #endif
    
    // #ifdef MP-BAIDU
    return 'mp-baidu'
    // #endif
    
    // #ifdef MP-TOUTIAO
    return 'mp-toutiao'
    // #endif
    
    // #ifdef APP-PLUS
    return 'app-plus'
    // #endif
    
    return 'unknown'
  },
  
  // 是否为小程序环境
  isMiniProgram() {
    const platform = this.getPlatform()
    return platform.startsWith('mp-')
  },
  
  // 是否为H5环境
  isH5() {
    return this.getPlatform() === 'h5'
  },
  
  // 是否为App环境
  isApp() {
    return this.getPlatform() === 'app-plus'
  }
}

export default PlatformAdapter 