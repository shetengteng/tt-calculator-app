# Calculator Components

## CalculatorButton 计算器按钮组件

### 简介
`CalculatorButton` 是一个可复用的按钮组件，支持多种主题样式、尺寸和形状，适用于计算器和其他应用场景。

### 基本使用

```vue
<template>
  <CalculatorButton 
    text="7" 
    theme="dark" 
    action="number"
    @click="handleButtonClick"
  />
</template>

<script setup>
import CalculatorButton from '@/components/CalculatorButton.vue'

const handleButtonClick = (buttonData) => {
  console.log('按钮被点击:', buttonData)
  // buttonData: { text: "7", theme: "dark", action: "number" }
}
</script>
```

### 属性 (Props)

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `text` | String | - | 是 | 按钮显示的文本 |
| `theme` | String | 'dark' | 否 | 按钮主题，见下方主题说明 |
| `size` | String | 'medium' | 否 | 按钮尺寸：small, medium, large |
| `shape` | String | 'circle' | 否 | 按钮形状：circle, rounded, square |
| `active` | Boolean | false | 否 | 是否激活状态 |
| `disabled` | Boolean | false | 否 | 是否禁用按钮 |
| `action` | String | 'default' | 否 | 按钮功能类型（用于事件处理） |
| `customStyle` | Object | {} | 否 | 自定义样式对象 |

### 按钮主题 (theme)

| 主题 | 说明 | 样式 | 适用场景 |
|------|------|------|----------|
| `blue` | 蓝色主题 | 蓝色背景，白色文字 | 主要操作按钮（如等号） |
| `gray` | 灰色主题 | 灰色背景，白色文字，激活时反色 | 操作符按钮 |
| `dark` | 深色主题 | 深灰色背景，白色文字 | 数字和功能按钮 |
| `light` | 浅色主题 | 浅灰色背景，黑色文字 | 清除、符号切换等功能按钮 |

### 按钮尺寸 (size)

| 尺寸 | 说明 | 适用场景 |
|------|------|----------|
| `small` | 小尺寸 | 紧凑布局或辅助功能 |
| `medium` | 中等尺寸 | 标准计算器按钮 |
| `large` | 大尺寸 | 强调重要操作 |

### 按钮形状 (shape)

| 形状 | 说明 | 视觉效果 |
|------|------|----------|
| `circle` | 圆形 | 现代、简洁的圆形按钮 |
| `rounded` | 圆角矩形 | 柔和的圆角效果 |
| `square` | 方形 | 简洁的直角设计 |

### 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `click` | 按钮点击事件 | `{ text: String, theme: String, action: String }` |

### 使用示例

#### 1. 数字按钮
```vue
<CalculatorButton 
  text="5" 
  theme="dark" 
  action="number"
  @click="handleNumberClick"
/>
```

#### 2. 操作符按钮（带激活状态）
```vue
<CalculatorButton 
  text="+" 
  theme="gray" 
  action="operator"
  :active="currentOperator === '+'" 
  @click="handleOperatorClick"
/>
```

#### 3. 功能按钮
```vue
<CalculatorButton 
  text="AC" 
  theme="light" 
  action="clear"
  @click="handleClearClick"
/>
```

#### 4. 主要操作按钮
```vue
<CalculatorButton 
  text="=" 
  theme="blue" 
  action="equals"
  @click="handleEqualsClick"
/>
```

#### 5. 不同尺寸和形状
```vue
<!-- 小尺寸圆角按钮 -->
<CalculatorButton 
  text="%" 
  theme="light" 
  size="small"
  shape="rounded"
  action="percentage"
  @click="handlePercentageClick"
/>

<!-- 大尺寸方形按钮 -->
<CalculatorButton 
  text="0" 
  theme="dark" 
  size="large"
  shape="square"
  action="number"
  @click="handleNumberClick"
/>
```

#### 6. 自定义样式
```vue
<CalculatorButton 
  text="Custom" 
  theme="blue" 
  :custom-style="{ 
    backgroundColor: '#FF6B6B', 
    color: '#FFFFFF',
    fontSize: '20px'
  }"
  action="custom"
  @click="handleCustomClick"
/>
```

### 完整的计算器示例

```vue
<template>
  <view class="calculator">
    <!-- 显示区域 -->
    <view class="display">
      <text class="result">{{ result }}</text>
    </view>
    
    <!-- 按钮区域 -->
    <view class="button-grid">
      <!-- 第一行：功能按钮 -->
      <CalculatorButton 
        text="AC" 
        theme="light" 
        action="clear"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="+/-" 
        theme="light" 
        action="toggle-sign"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="%" 
        theme="light" 
        action="percentage"
        @click="handleButtonClick"
      />
      <CalculatorButton 
        text="÷" 
        theme="gray" 
        action="operator"
        :active="currentOperator === '÷'"
        @click="handleButtonClick"
      />
      
      <!-- 数字和操作符按钮 -->
      <template v-for="row in buttonLayout" :key="row.id">
        <CalculatorButton 
          v-for="button in row.buttons" 
          :key="button.text"
          :text="button.text" 
          :theme="button.theme" 
          :action="button.action"
          :active="button.action === 'operator' && currentOperator === button.text"
          @click="handleButtonClick"
        />
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import CalculatorButton from '@/components/CalculatorButton.vue'

const result = ref('0')
const currentOperator = ref(null)

// 按钮布局配置
const buttonLayout = [
  {
    id: 'row1',
    buttons: [
      { text: '7', theme: 'dark', action: 'number' },
      { text: '8', theme: 'dark', action: 'number' },
      { text: '9', theme: 'dark', action: 'number' },
      { text: '×', theme: 'gray', action: 'operator' }
    ]
  },
  {
    id: 'row2',
    buttons: [
      { text: '4', theme: 'dark', action: 'number' },
      { text: '5', theme: 'dark', action: 'number' },
      { text: '6', theme: 'dark', action: 'number' },
      { text: '−', theme: 'gray', action: 'operator' }
    ]
  },
  {
    id: 'row3',
    buttons: [
      { text: '1', theme: 'dark', action: 'number' },
      { text: '2', theme: 'dark', action: 'number' },
      { text: '3', theme: 'dark', action: 'number' },
      { text: '+', theme: 'gray', action: 'operator' }
    ]
  },
  {
    id: 'row4',
    buttons: [
      { text: '0', theme: 'dark', action: 'number' },
      { text: '.', theme: 'dark', action: 'decimal' },
      { text: '←', theme: 'dark', action: 'backspace' },
      { text: '=', theme: 'blue', action: 'equals' }
    ]
  }
]

const handleButtonClick = (buttonData) => {
  const { text, action } = buttonData
  
  switch (action) {
    case 'number':
      handleNumber(text)
      break
    case 'operator':
      handleOperator(text)
      break
    case 'clear':
      handleClear()
      break
    case 'toggle-sign':
      handleToggleSign()
      break
    case 'percentage':
      handlePercentage()
      break
    case 'equals':
      handleEquals()
      break
    case 'decimal':
      handleDecimal()
      break
    case 'backspace':
      handleBackspace()
      break
  }
}

// 具体的处理函数...
const handleNumber = (number) => {
  console.log(`输入数字: ${number}`)
}

const handleOperator = (operator) => {
  currentOperator.value = operator
  console.log(`选择操作符: ${operator}`)
}

// ... 其他处理函数
</script>

<style>
.calculator {
  background: #000;
  padding: 20px;
}

.display {
  background: #000;
  padding: 20px;
  text-align: right;
}

.result {
  color: white;
  font-size: 48px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 20px;
}
</style>
```

### 特性

1. **主题系统**: 基于颜色的主题分类，更直观和灵活
2. **响应式设计**: 自动适配不同屏幕尺寸
3. **多种尺寸**: 支持小、中、大三种尺寸
4. **多种形状**: 支持圆形、圆角、方形三种形状
5. **状态管理**: 支持激活、禁用等状态
6. **事件处理**: 统一的点击事件处理，包含动作类型
7. **样式定制**: 支持自定义样式覆盖
8. **Vue 3 优化**: 使用 Composition API 和 script setup

### 设计理念

- **主题优先**: 使用直观的颜色主题而非功能类型
- **灵活配置**: 支持多种尺寸、形状和样式组合
- **语义化动作**: action 属性明确按钮的功能用途
- **可复用性**: 不仅限于计算器，可用于其他应用场景

### 注意事项

1. 组件使用了 `scoped` 样式，避免样式冲突
2. 响应式字体大小会根据屏幕尺寸和按钮尺寸自动调整
3. 点击效果包含了缩放动画，提供良好的用户体验
4. 禁用状态的按钮不会触发点击事件和hover效果
5. 主题颜色遵循现代设计规范，支持深色模式 