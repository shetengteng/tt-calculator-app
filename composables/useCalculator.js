import { ref } from 'vue'
import * as math from 'mathjs'
import { useSound } from './useSound.js'
import { useCalculatorHistory } from "@/composables/useCalculatorHistory";
const { playButtonSound, playResultSound } = useSound()
const { addHistory } = useCalculatorHistory()

const expressionParts = ref([])
const result = ref(0)
const error = ref(false)

const handleButtonClick = (buttonData) => {
    const { action } = buttonData

    switch (action) {
        case 'number':
        case 'operator':
            addExpressionPart(buttonData)
            break
        case 'clear':
            clear()
            break
        case 'toggle-sign':
            toggleSign()
            break
        case 'percentage':
            percentage()
            break
        case 'equals':
            calculate()
            break
        case 'decimal':
            addExpressionPart(buttonData)
            break
        case 'backspace':
            backspace()
            break
        default:
            console.log(`未处理的按钮动作: ${action}`)
    }
}

const expressionDisplay = (expressionParts) => {
    return expressionParts.map(part => part.text).join('')
}

const addExpressionPart = (part) => {
    expressionParts.value.push(part)
    playButtonSound()
}

const clearExpression = () => {
    expressionParts.value = []
    error.value = false
}

const clear = () => {
    clearExpression()
    result.value = 0
    playButtonSound()
}

const calculate = () => {
    const fullExpression = expressionParts.value.map(part => part.value).join('')
    try {
        result.value = math.evaluate(fullExpression)
        error.value = false
        addHistory(expressionParts.value, result.value)
        clearExpression()
    } catch (error) {
        console.error('计算错误:', error)
        result.value = 'Error'
        error.value = true
    }
    playResultSound()
}

const backspace = () => {
    if (expressionParts.value.length > 0) {
        expressionParts.value.pop()
        playButtonSound()
    }
}

const toggleSign = () => {
    try {
        const currentExpression = expressionParts.value.map(part => part.value).join('')
        if (currentExpression) {
            const evalResult = math.evaluate(currentExpression)
            clearExpression()
            addExpressionPart({ text: String(-evalResult), value: String(-evalResult), action: 'number' })
        }
    } catch (e) {
        console.error('切换符号错误:', e)
    }
    playButtonSound()
}

const percentage = () => {
    try {
        const currentExpression = expressionParts.value.map(part => part.value).join('')
        if (currentExpression) {
            const evalResult = math.evaluate(currentExpression) / 100
            clearExpression()
            addExpressionPart({ text: String(evalResult), value: String(evalResult), action: 'number' })
        }
    } catch (e) {
        console.error('百分比计算错误:', e)
    }
    playButtonSound()
}


export function useCalculator() {
    return {
        result,
        expressionParts,
        expressionDisplay,
        error,
        addExpressionPart,
        clearExpression,
        handleButtonClick
    }
} 