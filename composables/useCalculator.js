import { ref, watch } from 'vue'
import { useSound } from './useSound.js'
import { useSettings } from './useSettings.js'
import { useCalculatorHistory } from './useCalculatorHistory.js'

import {
  addDependencies,
  create,
  divideDependencies,
  formatDependencies,
  fractionDependencies
} from 'mathjs'

const { playButtonSound, playResultSound } = useSound()
const { settings } = useSettings()
const { addHistory } = useCalculatorHistory()

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

// 监听器 - 当计算结果改变时自动更新显示
watch(result, (newResult) => {
  if (newResult !== displayValue.value && !waitingForOperand.value) {
    displayValue.value = newResult
  }
})

// 计算器核心方法
const appendNumber = (number) => {
  if (settings.soundType !== 'none') {
    playButtonSound(settings.soundType)
  }
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
  const fullExpression = `${firstOperand.value || 0} ${currentOperator.value || ''} ${secondOperand.value || inputValue || 0}`
  if (settings.autoSaveHistory) {
    addHistory(fullExpression, formatNumber(calcResult))
  }
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
  if (value === null || value === undefined) return '0'
  if (value === 'Error') return value
  if (value === '') return '0'
  const num = parseFloat(String(value))
  if (isNaN(num)) return '0'
  if (Math.abs(num) >= 1e10 || (Math.abs(num) < 0.0001 && Math.abs(num) > 0)) {
    return num.toExponential(5)
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

// 创建全局计算器实例
const calculator = {
  displayValue,
  calculation,
  result,
  secondaryCalculation,
  secondaryResult,
  currentOperator,
  allClear,
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

// 导出函数和实例
export function useCalculator() {
  return calculator
}

export { calculator } 