# 兼容性适配层使用指南

## 📚 概述

兼容性适配层提供了统一的跨平台API接口，自动处理H5、小程序、App等不同平台的差异，让你编写一次代码即可在所有平台运行。

## 🏗️ 架构设计

```
compatibility/
├── index.js          # 主入口，导出PlatformAdapter
├── dom/
│   └── index.js      # DOM操作适配器
├── audio/
│   └── index.js      # 音频操作适配器
├── storage/
│   └── index.js      # 存储操作适配器
└── system/
    └── index.js      # 系统信息适配器
```

## 🚀 快速开始

### 1. 导入适配器

```javascript
import { PlatformAdapter } from '@/compatibility/index.js'

// 或者导入特定适配器
import { domAdapter } from '@/compatibility/dom/index.js'
import { audioAdapter } from '@/compatibility/audio/index.js'
```

### 2. 平台检测

```javascript
// 获取当前平台
const platform = PlatformAdapter.getPlatform()
console.log(platform) // 'h5', 'mp-weixin', 'app-plus' 等

// 平台类型判断
if (PlatformAdapter.isMiniProgram()) {
  console.log('运行在小程序环境')
}

if (PlatformAdapter.isH5()) {
  console.log('运行在H5环境')
}
```

## 📱 DOM操作适配器

### 设置CSS自定义属性

```javascript
// 设置单个属性
PlatformAdapter.dom.setCustomProperty('--primary-color', '#007aff')

// 批量设置属性
const themeVars = {
  '--primary-color': '#007aff',
  '--secondary-color': '#5ac8fa',
  '--background-color': '#ffffff'
}
PlatformAdapter.dom.setCustomProperties(themeVars)
```

### 设置页面样式

```javascript
// 设置页面背景
PlatformAdapter.dom.setPageBackground('#ffffff', '#000000')

// 设置元素样式
const element = PlatformAdapter.dom.getRootElement()
PlatformAdapter.dom.setElementStyles(element, {
  backgroundColor: '#ffffff',
  color: '#000000'
})
```

### 检查DOM可用性

```javascript
if (PlatformAdapter.dom.isDomAvailable()) {
  // 执行DOM操作
}
```

## 🔊 音频操作适配器

### 初始化音频系统

```javascript
await PlatformAdapter.audio.initializeAudioSystem()
```

### 创建和播放音频

```javascript
// 创建音频实例
await PlatformAdapter.audio.createAudioInstance('/static/sounds/click.wav', 'button-click')

// 预加载音频
await PlatformAdapter.audio.preloadAudio('/static/sounds/success.wav', 'success')

// 播放音频
await PlatformAdapter.audio.playAudio('button-click', 0.8) // 音量80%

// 停止音频
PlatformAdapter.audio.stopAudio('button-click')
```

### 音频管理

```javascript
// 检查音频是否支持
if (PlatformAdapter.audio.isAudioSupported()) {
  // 初始化音频
}

// 检查音频是否可用
if (PlatformAdapter.audio.isAudioAvailable('button-click')) {
  // 播放音频
}

// 清理音频资源
PlatformAdapter.audio.cleanup()
```

## 💾 存储操作适配器

### 同步存储操作

```javascript
// 存储数据
PlatformAdapter.storage.setSync('user-settings', { theme: 'dark', lang: 'zh' })

// 获取数据
const settings = PlatformAdapter.storage.getSync('user-settings', {})

// 删除数据
PlatformAdapter.storage.remove('user-settings')
```

### 异步存储操作

```javascript
// 异步存储
await PlatformAdapter.storage.set('user-data', userData)

// 异步获取
const userData = await PlatformAdapter.storage.get('user-data', null)

// 异步删除
await PlatformAdapter.storage.removeAsync('user-data')
```

### 存储管理

```javascript
// 获取所有存储键
const keys = PlatformAdapter.storage.getKeys()

// 获取存储信息
const info = PlatformAdapter.storage.getInfo()
console.log(info.currentSize, info.limitSize)

// 清空所有存储
PlatformAdapter.storage.clear()
```

## 🖥️ 系统信息适配器

### 获取系统信息

```javascript
// 同步获取
const systemInfo = PlatformAdapter.system.getSystemInfo()

// 异步获取
const systemInfo = await PlatformAdapter.system.getSystemInfoAsync()

// 获取设备信息
const deviceInfo = PlatformAdapter.system.getDeviceInfo()
```

### 主题相关

```javascript
// 获取系统主题
const theme = PlatformAdapter.system.getSystemTheme() // 'light' | 'dark'

// 监听主题变化
const unwatch = PlatformAdapter.system.watchSystemTheme((res) => {
  console.log('主题变化:', res.theme)
})

// 取消监听
unwatch()
```

### 系统功能

```javascript
// 设置导航栏颜色
await PlatformAdapter.system.setNavigationBarColor({
  frontColor: '#000000',
  backgroundColor: '#ffffff',
  animation: { duration: 300, timingFunc: 'easeInOut' }
})

// 触发震动
await PlatformAdapter.system.vibrate('short') // 'short' | 'long'

// 检查功能支持
if (PlatformAdapter.system.isSupported('audio')) {
  // 支持音频
}
```

## 🎯 实际应用示例

### 主题系统

```javascript
// 之前的代码（平台特定）
// #ifdef H5
document.documentElement.style.setProperty('--primary-color', color)
// #endif
// #ifdef MP
const pages = getCurrentPages()
pages[0].$el.style.setProperty('--primary-color', color)
// #endif

// 使用适配器（跨平台）
PlatformAdapter.dom.setCustomProperty('--primary-color', color)
```

### 音频播放

```javascript
// 之前的代码（平台特定）
// #ifdef H5
const audio = new Audio('/static/sounds/click.wav')
audio.play()
// #endif
// #ifdef MP
const audio = uni.createInnerAudioContext()
audio.src = '/static/sounds/click.wav'
audio.play()
// #endif

// 使用适配器（跨平台）
await PlatformAdapter.audio.createAudioInstance('/static/sounds/click.wav', 'click')
await PlatformAdapter.audio.playAudio('click')
```

### 数据存储

```javascript
// 之前的代码（平台特定）
// #ifdef H5
localStorage.setItem('settings', JSON.stringify(data))
// #endif
// #ifdef MP
uni.setStorageSync('settings', data)
// #endif

// 使用适配器（跨平台）
PlatformAdapter.storage.setSync('settings', data)
```

## ⚡ 性能优化

### 1. 延迟初始化
只在需要时初始化相应的适配器

### 2. 缓存机制
适配器内部使用缓存减少重复操作

### 3. 错误处理
所有方法都包含完善的错误处理机制

## 🐛 故障排除

### 常见问题

#### 1. 条件编译不生效
确保使用正确的条件编译标记：
- H5: `#ifdef H5`
- 微信小程序: `#ifdef MP-WEIXIN`
- App: `#ifdef APP-PLUS`

#### 2. 音频播放失败
```javascript
// 检查音频支持
if (!PlatformAdapter.audio.isAudioSupported()) {
  console.warn('当前平台不支持音频')
}

// 确保初始化
await PlatformAdapter.audio.initializeAudioSystem()
```

#### 3. 存储操作失败
```javascript
// 检查存储支持
if (!PlatformAdapter.storage.isStorageAvailable()) {
  console.warn('当前平台不支持存储')
}
```

## 🔧 扩展开发

### 添加新的适配器

1. 在 `compatibility/` 目录创建新文件夹
2. 实现适配器类
3. 在 `index.js` 中导出

```javascript
// compatibility/network/index.js
class NetworkAdapter {
  async request(options) {
    // #ifdef H5
    return fetch(options.url, options)
    // #endif
    
    // #ifdef MP
    return uni.request(options)
    // #endif
  }
}

export const networkAdapter = new NetworkAdapter()
```

### 添加新的平台支持

在各适配器中添加新的条件编译块：

```javascript
// #ifdef MP-ALIPAY
// 支付宝小程序特有代码
// #endif
```

## 📄 许可证

MIT License - 可自由使用和修改

---

**通过使用兼容性适配层，你的代码将更加清晰、可维护，并且能够无缝运行在所有支持的平台上！** 🎉 