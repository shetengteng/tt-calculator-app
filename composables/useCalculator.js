import { ref } from 'vue'
import * as math from 'mathjs'
import { useSound } from './useSound.js'
import { useCalculatorHistory } from "@/composables/useCalculatorHistory";

const { playButtonSound, playResultSound } = useSound()
const { addHistory } = useCalculatorHistory()


const expressionParts = ref([])
const error = ref(false)

const expressionDisplay = (expressionParts) => {
    return expressionParts.map(part => part.text).join('')
}
const lastPart = () => {
    return expressionParts.value[expressionParts.value.length - 1]
}
const lastPartIsNumber = () => {
    return expressionParts.value.length > 0 && lastPart().action === 'number'
}

const addExpressionPart = (part) => {
    expressionParts.value.push(part)
}

const handleButtonClick = (buttonData) => {
    const buttonInfo = { ...buttonData }
    error.value = false
    if (buttonInfo.action === 'equals') {
        playResultSound()
        calculate()
        return
    }
    playButtonSound()
    switch (buttonInfo.action) {
        case 'number':
            addNumber(buttonInfo)
            break
        case 'operator':
            addExpressionPart(buttonInfo)
            break
        case 'decimal':
            addNumber(buttonInfo)
            break
        case 'clear':
            clearExpression()
            break
        case 'toggle-sign':
            toggleSign()
            break
        case 'percentage':
            addExpressionPart(buttonInfo)
            break
        case 'backspace':
            backspace()
            break
        default:
            console.log(`未处理的按钮动作: ${action}`)
    }
}

const calculate = () => {
    const fullExpression = expressionParts.value.map(part => part.value).join('')
    try {
        const result = math.evaluate(fullExpression)
        error.value = false
        addHistory(expressionParts.value, result)
        clearExpression()
        addExpressionPart({ text: String(result), value: String(result), action: 'number' })
    } catch (err) {
        console.error('计算错误:', err)
        error.value = true
    }
}

const addNumber = (buttonData) => {
    if (lastPartIsNumber()) {
        // 如果最后一个表达式部分也是数字，则合并
        const part = lastPart()
        if (part.value === '0') {
            part.text = ''
            part.value = ''
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
        expressionParts,

        expressionDisplay,
        addExpressionPart,
        clearExpression,
        handleButtonClick
    }
}