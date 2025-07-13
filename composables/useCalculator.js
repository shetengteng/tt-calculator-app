import { ref } from 'vue'
import * as math from 'mathjs'
import { useSound } from './useSound.js'
import { useCalculatorHistory } from "@/composables/useCalculatorHistory";
import { useHapticFeedback } from './useHapticFeedback.js'
import { useSettings } from './useSettings.js'
import { useDisplay } from './useDisplay.js'

const { playButtonSound, playResultSound } = useSound()
const { triggerShortVibration } = useHapticFeedback()
const { addHistory } = useCalculatorHistory()
const { settings } = useSettings()
const { shouldAllowDecimalInput } = useDisplay()

const expressionParts = ref([])
const result = ref('')

const tempRecords = ref([]) // 存储最近的10条临时记录
const error = ref(false)

const lastPart = () => {
  return expressionParts.value[expressionParts.value.length - 1]
}
const lastPartIsNumber = () => {
  return expressionParts.value.length > 0 && lastPart().action === 'number'
}

const addExpressionPart = (part) => {
  expressionParts.value.push(part)
}

// 添加临时记录，最多保存10条
const addTempRecord = (expression, result) => {
  tempRecords.value.push({
    expression,
    result
  })
  // 保持最多10条记录
  if (tempRecords.value.length > 10) {
    tempRecords.value = tempRecords.value.slice(1)
  }
}

// 清除临时记录
const clearTempRecords = () => {
  tempRecords.value = []
}

const handleButtonClick = async (buttonData) => {
  const buttonInfo = { ...buttonData }
  error.value = false
  await triggerShortVibration()
  // 播放声音
  if (buttonInfo.action === 'equals') {
    await playResultSound()
    calculate()
    return
  }

  await playButtonSound()
  // 处理按钮动作
  switch (buttonInfo.action) {
    case 'number':
      addNumber(buttonInfo)
      doCalculate()
      break
    case 'operator':
      addExpressionPart(buttonInfo)
      break
    case 'decimal':
      addNumber(buttonInfo)
      break
    case 'clear':
      clearExpression()
      result.value = ''
      break
    case 'toggle-sign':
      toggleSign()
      doCalculate()
      break
    case 'percentage':
      addExpressionPart(buttonInfo)
      doCalculate()
      break
    case 'backspace':
      backspace()
      doCalculate()
      break
    default:
      console.log(`未处理的按钮动作: ${buttonInfo.action}`)
  }
}

const calculate = () => {
  doCalculate(() => {
    // 添加到历史记录
    addHistory(expressionParts.value, result.value)
    // 添加到临时记录
    addTempRecord(expressionParts.value, result.value)
    clearExpression()
    addExpressionPart({ text: String(result.value), value: String(result.value), action: 'number' })

    // 如果开启了自动复制结果，则复制到剪贴板
    if (settings.autoCopyResult) {
      copyResultToClipboard(String(result.value))
    }
  })
}

const doCalculate = (success) => {
  const fullExpression = expressionParts.value.map(part => part.value).join('')
  try {
    result.value = math.evaluate(fullExpression)
    error.value = false
    success && success()
  } catch (err) {
    console.error('计算错误:', err)
    error.value = true
    result.value = 'error'
  }
}

// 复制结果到剪贴板
const copyResultToClipboard = (text) => {
  try {
    if (typeof uni === 'undefined' || !uni.setClipboardData) {
      console.error('当前环境不支持剪贴板API')
      return false
    }
    uni.setClipboardData({
      data: text,
      success: () => {
        console.log('结果已成功复制到剪贴板:', text)
        return true
      },
      fail: (err) => {
        console.error('复制到剪贴板失败:', err)
        return false
      },
      complete: () => {
        console.log('复制操作完成')
      }
    })
  } catch (error) {
    console.error('复制到剪贴板出错:', error)
    return false
  }
}

const addNumber = (buttonData) => {
  if (lastPartIsNumber()) {
    // 如果最后一个表达式部分也是数字，则合并
    const part = lastPart()
    // 检查是否添加小数点后的数字，如果超出小数位设置则不添加
    if (part.text.includes('.') && buttonData.text !== '.') {
      // 使用useDisplay中的方法检查是否允许输入
      if (!shouldAllowDecimalInput(part.text)) {
        return; // 不添加超过设置的小数位数
      }
    }

    part.text += buttonData.text
    part.value += buttonData.value
    return
  }
  addExpressionPart(buttonData)
}

const clearExpression = () => {
  expressionParts.value = []
  error.value = false
}

const backspace = () => {
  // backspace 中如果最后一个是数字，则需要减少数字的最后一位，当全部减少后，再减去这个part
  if (lastPartIsNumber()) {
    const part = lastPart()
    if (part.text.length > 1) {
      part.text = part.text.slice(0, -1)
      part.value = part.value.slice(0, -1)
      return
    }
  }
  expressionParts.value.pop()
}

const toggleSign = () => {
  if (lastPartIsNumber()) {
    // 如果最后一个部分是数字，切换它的符号
    const part = lastPart()
    const value = parseFloat(part.value) * -1
    part.text = String(value)
    part.value = String(value)
  }
}


export function useCalculator() {
  return {
    error,
    result,
    expressionParts,
    tempRecords, // 导出临时记录

    addExpressionPart,
    clearExpression,
    handleButtonClick,
    clearTempRecords, // 导出清除临时记录的方法
    calculate, // 导出计算方法
    copyResultToClipboard // 导出复制结果方法
  }
}