import { ref, watch, nextTick } from 'vue'
import { useSound } from './useSound.js'
import { useSettings } from './useSettings.js'
import { useCalculatorHistory } from './useCalculatorHistory.js'


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
  const allClear = ref(true)

  // 音效系统
  const { playButtonSound, playResultSound } = useSound()
  const { settings } = useSettings()
  
  // 历史记录系统
  const { addHistory } = useCalculatorHistory()

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
        // 可以在这里添加视觉反馈逻辑
      })
    }
  })

  // 计算器核心方法
  const appendNumber = (number) => {
    // 播放按键音效
    if (settings.soundType !== 'none') {
      playButtonSound(settings.soundType)
    }
    
    // 确保number是字符串
    const numStr = String(number || '0')
    
    if (waitingForOperand.value || displayValue.value === '0' || displayValue.value === 'Error') {
      displayValue.value = numStr
      waitingForOperand.value = false
    } else {
      displayValue.value = (displayValue.value || '0') + numStr
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
    
    if (waitingForOperand.value || displayValue.value === 'Error') {
      displayValue.value = '0.'
      waitingForOperand.value = false
    } else if ((displayValue.value || '0').indexOf('.') === -1) {
      displayValue.value = (displayValue.value || '0') + '.'
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
    const fullExpression = `${firstOperand.value || 0} ${currentOperator.value || ''} ${secondOperand.value || inputValue || 0}`
    // Save calculation to history if auto-save is enabled
    if (settings.autoSaveHistory) {
      addHistory(fullExpression, formatNumber(calcResult))
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
    
    const value = parseFloat(displayValue.value || '0')
    if (!isNaN(value) && displayValue.value !== 'Error') {
      displayValue.value = String(-value)
      result.value = displayValue.value
      updateCalculation()
    }
  }

  const percentage = () => {
    // 播放按键音效
    if (settings.soundType !== 'none') {
      playButtonSound(settings.soundType)
    }
    
    const value = parseFloat(displayValue.value || '0')
    if (!isNaN(value) && displayValue.value !== 'Error') {
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
    
    const currentValue = displayValue.value || '0'
    if (currentValue.length > 1 && currentValue !== 'Error') {
      displayValue.value = currentValue.slice(0, -1)
    } else {
      displayValue.value = '0'
    }
    result.value = displayValue.value
    updateCalculation()
  }

  const updateCalculation = () => {
    if (currentOperator.value && firstOperand.value !== null && displayValue.value) {
      calculation.value = `${firstOperand.value} ${currentOperator.value} ${displayValue.value}`
    } else {
      calculation.value = displayValue.value || '0'
    }
  }

  const formatNumber = (value) => {
    // 处理特殊情况
    if (value === null || value === undefined) return '0'
    if (value === 'Error') return value
    if (value === '') return '0'
    
    const num = parseFloat(String(value))
    if (isNaN(num)) return '0'
    
    // 处理超大或超小数字
    if (Math.abs(num) >= 1e10 || (Math.abs(num) < 0.0001 && Math.abs(num) > 0)) {
      return num.toExponential(5)
    }
    
    // 格式化数字，添加千位分隔符
    const parts = num.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
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
    
    // 方法
    appendNumber,
    appendDecimal,
    setOperator,
    calculate,
    clear,
    toggleSign,
    percentage,
    backspace,
    formatNumber
  }
} 