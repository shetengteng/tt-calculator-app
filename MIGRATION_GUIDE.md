# 样式系统迁移指南

## 概述

本指南将帮助您将现有的Vue组件迁移到新的统一样式系统，同时保持样式不变。新的样式系统提供了更好的可维护性、一致性和可扩展性。

## 迁移步骤

### 1. 更新样式标签

**之前：**
```vue
<style scoped>
```

**之后：**
```vue
<style lang="scss" scoped>
```

### 2. 替换硬编码值为变量

**之前：**
```scss
.my-button {
  background-color: #00A8E6;
  color: #FFFFFF;
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  transition: all 0.2s ease;
}
```

**之后：**
```scss
.my-button {
  background-color: $button-theme-blue;
  color: $button-theme-blue-text;
  width: $calculator-button-size-medium;
  height: $calculator-button-size-medium;
  border-radius: $border-radius-circle;
  transition: all $transition-medium;
}
```

### 3. 使用混合器替换重复样式

**之前：**
```scss
.calculator-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}
```

**之后：**
```scss
.calculator-button {
  @include button-base;
  @include button-interactions;
}
```

### 4. 使用主题混合器

**之前：**
```scss
.theme-blue {
  background-color: #00A8E6;
  color: #FFFFFF;
}

.theme-dark {
  background-color: #505050;
  color: #FFFFFF;
}

.theme-light {
  background-color: #A6A6A6;
  color: #000000;
}
```

**之后：**
```scss
.theme-blue {
  @include button-theme(blue);
}

.theme-dark {
  @include button-theme(dark);
}

.theme-light {
  @include button-theme(light);
}
```

### 5. 使用尺寸混合器

**之前：**
```scss
.size-small {
  width: 120rpx;
  height: 120rpx;
  font-size: 38rpx;
}

.size-medium {
  width: 140rpx;
  height: 140rpx;
  font-size: 42rpx;
}

.size-large {
  width: 160rpx;
  height: 160rpx;
  font-size: 46rpx;
}
```

**之后：**
```scss
.size-small {
  @include button-size(small);
}

.size-medium {
  @include button-size(medium);
}

.size-large {
  @include button-size(large);
}
```

### 6. 使用响应式混合器

**之前：**
```scss
@media screen and (max-width: 750rpx) {
  .calculator-button {
    width: 120rpx;
    height: 120rpx;
    font-size: 38rpx;
  }
}

@media screen and (max-width: 320px) and (max-height: 480px) {
  .calculator-button {
    width: 110rpx;
    height: 110rpx;
    font-size: 36rpx;
  }
}
```

**之后：**
```scss
@include small-screen {
  .calculator-button {
    @include button-size(small);
  }
}

@include iphone4-optimization {
  .calculator-button {
    width: 110rpx;
    height: 110rpx;
    font-size: 36rpx;
  }
}
```

### 7. 使用工具类替换简单样式

**之前：**
```scss
.my-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  margin: 16rpx;
  border-radius: 16rpx;
  background-color: #FFFFFF;
  color: #000000;
}
```

**之后：**
```vue
<template>
  <view class="center-flex p-md m-sm rounded-sm bg-secondary text-secondary">
    <!-- 内容 -->
  </view>
</template>

<style lang="scss" scoped>
// 如果需要额外的自定义样式
.my-container {
  // 其他特定样式
}
</style>
```

## 实际迁移示例

### 示例1：CalculatorButton 组件

查看 `components/CalculatorButton-migrated.vue` 文件，这是一个完整的迁移示例，展示了如何将原始的 `CalculatorButton` 组件迁移到新的样式系统。

**主要改进：**
- 使用 `@include button-base` 替换基础样式
- 使用 `@include button-theme()` 替换主题样式
- 使用 `@include button-size()` 替换尺寸样式
- 使用响应式混合器替换媒体查询
- 使用变量替换硬编码值

### 示例2：迁移抽屉组件

**之前：**
```scss
.settings-drawer {
  position: fixed;
  top: 0;
  left: -80%;
  width: 80%;
  height: 100vh;
  background: #F2F2F7;
  z-index: 1000;
  transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

**之后：**
```scss
.settings-drawer {
  @include drawer-base;
  left: -$drawer-width;
  width: $drawer-width;
}

.drawer-overlay {
  @include drawer-overlay;
}
```

## 迁移检查清单

### 必须完成的步骤：
- [ ] 将 `<style scoped>` 改为 `<style lang="scss" scoped>`
- [ ] 替换硬编码颜色值为变量
- [ ] 替换硬编码尺寸值为变量
- [ ] 使用混合器替换重复的样式模式

### 推荐完成的步骤：
- [ ] 使用工具类替换简单的样式声明
- [ ] 使用响应式混合器替换媒体查询
- [ ] 使用预定义的过渡动画变量
- [ ] 使用阴影变量替换硬编码阴影

### 验证步骤：
- [ ] 确保样式在各种设备上正常显示
- [ ] 确保交互效果（悬停、点击等）正常工作
- [ ] 确保响应式设计正常工作
- [ ] 确保没有样式冲突

## 常见问题和解决方案

### Q1: 迁移后样式不生效怎么办？
**A:** 检查以下几点：
1. 确保 `uni.scss` 文件正确导入了新的样式系统
2. 确保组件的 `<style>` 标签添加了 `lang="scss"`
3. 确保变量名和混合器名称拼写正确

### Q2: 如何处理组件特有的样式？
**A:** 保留组件特有的样式，只迁移通用的样式：
```scss
<style lang="scss" scoped>
// 使用系统样式
.my-button {
  @include button-base;
  @include button-theme(blue);
}

// 保留特有样式
.my-special-style {
  // 组件特有的样式
  animation: special-animation 1s ease-in-out;
}
</style>
```

### Q3: 如何处理第三方组件的样式？
**A:** 对于第三方组件，可以：
1. 使用工具类在模板中添加样式
2. 创建包装组件并应用新的样式系统
3. 使用 `:deep()` 选择器覆盖第三方组件样式

### Q4: 迁移后性能有影响吗？
**A:** 新的样式系统实际上会提升性能：
- 减少重复的CSS代码
- 更好的缓存利用
- 更小的最终打包体积

## 渐进式迁移策略

您不需要一次性迁移所有组件。可以采用渐进式迁移：

1. **第一阶段**：迁移最常用的组件（如按钮、输入框等）
2. **第二阶段**：迁移页面级组件
3. **第三阶段**：迁移其他组件
4. **第四阶段**：优化和清理

每个阶段都可以独立进行，不会影响其他组件的正常工作。

## 迁移后的好处

1. **更好的可维护性**：统一的变量和混合器
2. **更高的一致性**：所有组件使用相同的设计系统
3. **更强的可扩展性**：易于添加新的主题和样式
4. **更好的性能**：减少重复代码，优化打包体积
5. **更强的类型安全**：SCSS提供更好的错误检查

## 获取帮助

如果在迁移过程中遇到问题，请参考：
1. `styles/README.md` - 样式系统文档
2. `components/CalculatorButton-migrated.vue` - 完整迁移示例
3. 本文档的常见问题部分 