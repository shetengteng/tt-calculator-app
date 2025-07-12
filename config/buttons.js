// 计算器按钮配置
export default function createButtonsConfig() {
  return [
    // Row 1: Function buttons
    { text: 'C', theme: 'light', action: 'clear', value: 'clear' },
    { text: '+/-', theme: 'light', action: 'toggle-sign', value: 'toggle-sign' },
    { text: '%', theme: 'light', action: 'percentage', value: '%' },
    { text: '÷', theme: 'light', action: 'operator', value: '/' },
    
    // Row 2: Numbers 7-9 and multiply
    { text: '7', theme: 'dark', action: 'number', value: '7' },
    { text: '8', theme: 'dark', action: 'number', value: '8' },
    { text: '9', theme: 'dark', action: 'number', value: '9' },
    { text: '×', theme: 'light', action: 'operator', value: '*' },
    
    // Row 3: Numbers 4-6 and subtract
    { text: '4', theme: 'dark', action: 'number', value: '4' },
    { text: '5', theme: 'dark', action: 'number', value: '5' },
    { text: '6', theme: 'dark', action: 'number', value: '6' },
    { text: '−', theme: 'light', action: 'operator', value: '-' },
    
    // Row 4: Numbers 1-3 and add
    { text: '1', theme: 'dark', action: 'number', value: '1' },
    { text: '2', theme: 'dark', action: 'number', value: '2' },
    { text: '3', theme: 'dark', action: 'number', value: '3' },
    { text: '+', theme: 'light', action: 'operator', value: '+' },
    
    // Row 5: Zero, decimal, backspace and equals
    { text: '←', theme: 'dark', action: 'backspace', value: 'backspace' },
    { text: '0', theme: 'dark', action: 'number', value: '0' },
    { text: '.', theme: 'dark', action: 'decimal', value: '.' },
    { text: '=', theme: 'blue', action: 'equals', value: '=' }
  ]
} 