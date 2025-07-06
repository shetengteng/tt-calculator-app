import { ref } from 'vue'

// 全局Toast状态
const toastState = ref({
  visible: false,
  message: '',
  type: 'success',
  showIcon: true,
  duration: 2000
})

export function useToast() {
  // 显示Toast
  const showToast = (message, options = {}) => {
    const {
      type = 'success',
      showIcon = true,
      duration = 2000
    } = options

    toastState.value = {
      visible: true,
      message,
      type,
      showIcon,
      duration
    }
  }

  // 隐藏Toast
  const hideToast = () => {
    toastState.value.visible = false
  }

  // 快捷方法
  const success = (message, options = {}) => {
    showToast(message, { ...options, type: 'success' })
  }

  const error = (message, options = {}) => {
    showToast(message, { ...options, type: 'error' })
  }

  const warning = (message, options = {}) => {
    showToast(message, { ...options, type: 'warning' })
  }

  const info = (message, options = {}) => {
    showToast(message, { ...options, type: 'info' })
  }

  return {
    // 状态
    toastState,
    
    // 方法
    showToast,
    hideToast,
    success,
    error,
    warning,
    info
  }
} 