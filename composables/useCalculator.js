import { ref, watch, nextTick } from 'vue'
import { useSound } from './useSound.js'
import { useSettings } from './useSettings.js'


export function useCalculator() {
  // 响应式数据
  const displayValue = ref('0')
  const calculation = ref('')
  const result = ref('0')
  const secondaryCalculation = ref(null)
  const secondaryResult = ref(null)
  const waitingForOperand = ref(false)
  const operatorClicked = ref(false)
  const firstOperand = ref(null)
  const secondOperand = ref(null)
  const currentOperator = ref(null)
  const history = ref([])
  const allClear = ref(true)

  // 音效系统
  const { playButtonSound, playResultSound } = useSound()
  const { settings } = useSettings()

  // 监听器 - 当计算结果改变时自动更新显示
  watch(result, (newResult) => {
    if (newResult !== displayValue.value && !waitingForOperand.value) {
      displayValue.value = newResult
    }
  })

  // 监听器 - 当操作符改变时提供视觉反馈
  watch(currentOperator, (newOperator, oldOperator) => {
    if (newOperator !== oldOperator) {
      nextTick(() => {
        console.log(`操作符从 ${oldOperator} 切换到 ${newOperator}`)
      })
    }
  })

  // 计算器核心方法
  const appendNumber = (number) => {
    // 播放按键音效
    if (settings.soundType !== 'none') {
      playButtonSound(settings.soundType)
    }
    
    if (waitingForOperand.value || displayValue.value === '0') {
      displayValue.value = number
      waitingForOperand.value = false
    } else {
      displayValue.value += number
    }
    
    result.value = displayValue.value
    updateCalculation()
    allClear.value = false
  }

  const appendDecimal = () => {
    // 播放按键音效
    if (settings.soundType !== 'none') {
      playButtonSound(settings.soundType)
    }
    
    if (waitingForOperand.value) {
      displayValue.value = '0.'
      waitingForOperand.value = false
    } else if (displayValue.value.indexOf('.') === -1) {
      displayValue.value += '.'
    }
    
    result.value = displayValue.value
    updateCalculation()
    allClear.value = false
  }

  const setOperator = (operator) => {
    // 播放按键音效
    if (settings.soundType !== 'none') {
      playButtonSound(settings.soundType)
    }
    
    const inputValue = parseFloat(displayValue.value)
    
    if (firstOperand.value === null) {
      firstOperand.value = inputValue
    } else if (!operatorClicked.value) {
      const calcResult = performCalculation(firstOperand.value, inputValue)
      firstOperand.value = calcResult
      result.value = String(calcResult)
    }
    
    waitingForOperand.value = true
    currentOperator.value = operator
    operatorClicked.value = true
    updateCalculation()
  }

  const calculate = () => {
    // 播放结果音效
    if (settings.soundType !== 'none') {
      playResultSound(settings.soundType)
    }
    
    const inputValue = parseFloat(displayValue.value)
    
    if (firstOperand.value === null) {
      return
    }
    
    if (operatorClicked.value) {
      secondOperand.value = inputValue
    }
    
    const calcResult = performCalculation(firstOperand.value, secondOperand.value || inputValue)
    
    if (calcResult === 'Error' || isNaN(calcResult)) {
      result.value = 'Error'
      displayValue.value = 'Error'
      resetCalculator()
      return
    }
    // 构造完整表达式
    const fullExpression = `${firstOperand.value} ${currentOperator.value} ${secondOperand.value || inputValue}`
    // Save calculation to history
    const historyItem = {
      calculation: fullExpression + ' =',
      result: formatNumber(calcResult),
      timestamp: new Date()
    }
    history.value.unshift(historyItem)
    
    if (history.value.length > 100) {
      history.value = history.value.slice(0, 100)
    }
    
    // 保存到本地存储
    try {
      uni.setStorageSync('calculatorHistory', JSON.stringify(history.value))
    } catch (error) {
      console.error('保存历史记录失败:', error)
    }
    
    // Update secondary calculation
    secondaryCalculation.value = fullExpression + ' ='
    secondaryResult.value = formatNumber(calcResult)
    
    result.value = String(calcResult)
    calculation.value = ''
    waitingForOperand.value = true
    operatorClicked.value = false
    firstOperand.value = calcResult
    currentOperator.value = null
  }

  const performCalculation = (firstOp, secondOp) => {
    switch (currentOperator.value) {
      case '+':
        return firstOp + secondOp
      case '−':
        return firstOp - secondOp
      case '×':
        return firstOp * secondOp
      case '÷':
        return secondOp !== 0 ? firstOp / secondOp : 'Error'
      default:
        return secondOp
    }
  }

  const clear = () => {
    // 播放按键音效
    if (settings.soundType !== 'none') {
      playButtonSound(settings.soundType)
    }
    
    if (allClear.value) {
      resetCalculator()
    } else {
      displayValue.value = '0'
      result.value = '0'
      allClear.value = true
    }
  }

  const resetCalculator = () => {
    displayValue.value = '0'
    calculation.value = ''
    result.value = '0'
    secondaryCalculation.value = null
    secondaryResult.value = null
    waitingForOperand.value = false
    operatorClicked.value = false
    firstOperand.value = null
    secondOperand.value = null
    currentOperator.value = null
    allClear.value = true
  }

  const toggleSign = () => {
    // 播放按键音效
    if (settings.soundType !== 'none') {
      playButtonSound(settings.soundType)
    }
    
    const value = parseFloat(displayValue.value)
    if (!isNaN(value)) {
      displayValue.value = String(-value)
      result.value = displayValue.value
    }
  }

  const percentage = () => {
    // 播放按键音效
    if (settings.soundType !== 'none') {
      playButtonSound(settings.soundType)
    }
    
    const value = parseFloat(displayValue.value)
    if (!isNaN(value)) {
      const percentageValue = value / 100
      displayValue.value = String(percentageValue)
      result.value = displayValue.value
      updateCalculation()
    }
  }

  const backspace = () => {
    // 播放按键音效
    if (settings.soundType !== 'none') {
      playButtonSound(settings.soundType)
    }
    
    if (displayValue.value.length > 1 && displayValue.value !== 'Error') {
      displayValue.value = displayValue.value.slice(0, -1)
    } else {
      displayValue.value = '0'
    }
    result.value = displayValue.value
  }

  const updateCalculation = () => {
    if (currentOperator.value && firstOperand.value !== null) {
      calculation.value = `${firstOperand.value} ${currentOperator.value} ${displayValue.value}`
    } else {
      calculation.value = displayValue.value
    }
  }

  const formatNumber = (value) => {
    if (value === 'Error') return value
    
    const num = parseFloat(String(value))
    if (isNaN(num)) return '0'
    
    if (Math.abs(num) >= 1e10 || (Math.abs(num) < 0.0001 && Math.abs(num) > 0)) {
      return num.toExponential(5)
    }
    
    const parts = num.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  // 初始化历史记录
  const initializeHistory = () => {
    try {
      const historyStr = uni.getStorageSync('calculatorHistory')
      if (historyStr) {
        const parsedHistory = JSON.parse(historyStr)
        if (Array.isArray(parsedHistory)) {
          history.value = parsedHistory.map((item) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }))
        }
      }
    } catch (error) {
      console.error('Failed to load calculator history:', error)
      uni.removeStorageSync('calculatorHistory')
    }
  }

  // 复制结果到剪贴板
  const copyResult = () => {
    return new Promise((resolve, reject) => {
      uni.setClipboardData({
        data: result.value,
        success: () => {
          uni.showToast({
            title: 'Copied to clipboard',
            icon: 'none',
            duration: 1500
          })
          resolve(result.value)
        },
        fail: (error) => {
          uni.showToast({
            title: 'Copy failed',
            icon: 'none',
            duration: 1500
          })
          reject(error)
        }
      })
    })
  }


  // 返回所有需要的状态和方法
  return {
    // 状态
    displayValue,
    calculation,
    result,
    secondaryCalculation,
    secondaryResult,
    currentOperator,
    allClear,
    history,
    
    // 方法
    appendNumber,
    appendDecimal,
    setOperator,
    calculate,
    clear,
    toggleSign,
    percentage,
    backspace,
    copyResult,
    initializeHistory,
    formatNumber
  }
} 