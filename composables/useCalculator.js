import { ref, computed, watch, nextTick } from 'vue'

export function useCalculator() {
  // 响应式数据
  const displayValue = ref('0')
  const calculation = ref('')
  const result = ref('0')
  const secondaryCalculation = ref('')
  const secondaryResult = ref('')
  const waitingForOperand = ref(false)
  const operatorClicked = ref(false)
  const firstOperand = ref(null)
  const secondOperand = ref(null)
  const currentOperator = ref(null)
  const history = ref([])
  const allClear = ref(true)

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
    
    // Save calculation to history
    const historyItem = {
      calculation: calculation.value + ' =',
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
    secondaryCalculation.value = calculation.value + ' ='
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
    secondaryCalculation.value = ''
    secondaryResult.value = ''
    waitingForOperand.value = false
    operatorClicked.value = false
    firstOperand.value = null
    secondOperand.value = null
    currentOperator.value = null
    allClear.value = true
  }

  const toggleSign = () => {
    const value = parseFloat(displayValue.value)
    if (!isNaN(value)) {
      displayValue.value = String(-value)
      result.value = displayValue.value
    }
  }

  const percentage = () => {
    const value = parseFloat(displayValue.value)
    if (!isNaN(value)) {
      const percentageValue = value / 100
      displayValue.value = String(percentageValue)
      result.value = displayValue.value
      updateCalculation()
    }
  }

  const backspace = () => {
    if (displayValue.value.length > 1 && displayValue.value !== 'Error') {
      displayValue.value = displayValue.value.slice(0, -1)
    } else {
      displayValue.value = '0'
    }
    result.value = displayValue.value
  }

  const updateCalculation = () => {
    if (currentOperator.value && firstOperand.value !== null) {
      calculation.value = `${firstOperand.value} ${currentOperator.value} ${operatorClicked.value ? '' : displayValue.value}`
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

  // 显示历史记录
  const showHistory = () => {
    uni.navigateTo({
      url: '/pages/calculator-history/calculator-history'
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
    showHistory,
    initializeHistory,
    formatNumber
  }
} 