# 手动迁移指南 - 一步一步安全迁移

## 概述

本指南将帮助您一步一步地手动迁移现有组件到新的样式系统，确保样式保持不变，避免出现问题。

## 迁移前准备

### 1. 备份您的代码
在开始迁移之前，请确保您的代码已经提交到版本控制系统（如Git）。

### 2. 确认新样式系统已正确设置
确认以下文件已存在并正确配置：
- `styles/variables.scss` - 样式变量
- `styles/mixins.scss` - 混合器
- `styles/global.scss` - 全局样式
- `styles/index.scss` - 样式入口
- `uni.scss` - 已更新导入新样式系统

## 迁移步骤

### 步骤 1：选择一个组件开始迁移

**建议从最简单的组件开始**，比如 `CalculatorButton` 组件。

### 步骤 2：修改样式标签

找到组件的 `<style>` 标签，将：
```vue
<style scoped>
```

改为：
```vue
<style lang="scss" scoped>
```

**⚠️ 注意**：这一步完成后，立即测试组件是否正常工作。

### 步骤 3：逐个替换颜色值

**不要一次性替换所有颜色**，而是一个一个地替换：

#### 3.1 替换主背景色
找到：
```scss
background-color: #2C2C2E;
```

替换为：
```scss
background-color: $calculator-primary-background;
```

**测试**：保存文件，检查样式是否正常。

#### 3.2 替换次要背景色
找到：
```scss
background-color: #FFFFFF;
```

替换为：
```scss
background-color: $calculator-secondary-background;
```

**测试**：保存文件，检查样式是否正常。

#### 3.3 替换蓝色主题
找到：
```scss
background-color: #00A8E6;
```

替换为：
```scss
background-color: $calculator-accent-blue;
```

**测试**：保存文件，检查样式是否正常。

#### 3.4 继续替换其他颜色
按照同样的方式，逐个替换：
- `#A6A6A6` → `$calculator-light-gray`
- `#505050` → `$calculator-dark-gray`
- `#8E8E93` → `$calculator-text-muted`
- `#000000` → `$calculator-text-secondary`

**每次替换后都要测试！**

### 步骤 4：逐个替换尺寸值

#### 4.1 替换按钮尺寸
找到：
```scss
width: 140rpx;
height: 140rpx;
```

替换为：
```scss
width: $calculator-button-size-medium;
height: $calculator-button-size-medium;
```

**测试**：保存文件，检查按钮大小是否正常。

#### 4.2 替换小尺寸按钮
找到：
```scss
width: 120rpx;
height: 120rpx;
```

替换为：
```scss
width: $calculator-button-size-small;
height: $calculator-button-size-small;
```

**测试**：保存文件，检查按钮大小是否正常。

#### 4.3 替换大尺寸按钮
找到：
```scss
width: 160rpx;
height: 160rpx;
```

替换为：
```scss
width: $calculator-button-size-large;
height: $calculator-button-size-large;
```

**测试**：保存文件，检查按钮大小是否正常。

### 步骤 5：替换间距值

#### 5.1 替换 padding 值
逐个替换：
- `padding: 8rpx` → `padding: $spacing-xs`
- `padding: 16rpx` → `padding: $spacing-sm`
- `padding: 24rpx` → `padding: $spacing-md`
- `padding: 32rpx` → `padding: $spacing-lg`
- `padding: 40rpx` → `padding: $spacing-xl`

**每次替换后都要测试！**

#### 5.2 替换 margin 值
按照同样的方式替换 margin 值。

### 步骤 6：替换圆角值

找到：
```scss
border-radius: 50%;
```

替换为：
```scss
border-radius: $border-radius-circle;
```

其他圆角值：
- `border-radius: 16rpx` → `border-radius: $border-radius-small`
- `border-radius: 25%` → `border-radius: $border-radius-medium`
- `border-radius: 45%` → `border-radius: $border-radius-large`

**每次替换后都要测试！**

### 步骤 7：替换过渡动画

找到：
```scss
transition: all 0.2s ease;
```

替换为：
```scss
transition: all $transition-medium;
```

其他过渡动画：
- `transition: all 0.1s ease-out` → `transition: all $transition-fast`
- `transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)` → `transition: all $transition-slow`

**每次替换后都要测试！**

## 实际操作示例

### 示例：迁移 CalculatorButton 组件

让我们以 `CalculatorButton.vue` 为例，展示完整的迁移过程：

#### 第1步：修改样式标签
```vue
<!-- 之前 -->
<style scoped>

<!-- 之后 -->
<style lang="scss" scoped>
```

**立即测试**：确保组件正常工作。

#### 第2步：替换第一个颜色
```scss
/* 之前 */
.theme-blue {
  background-color: #00A8E6;
  color: #FFFFFF;
}

/* 之后 */
.theme-blue {
  background-color: $calculator-accent-blue;
  color: #FFFFFF;
}
```

**立即测试**：确保蓝色主题正常显示。

#### 第3步：替换第二个颜色
```scss
/* 之前 */
.theme-blue {
  background-color: $calculator-accent-blue;
  color: #FFFFFF;
}

/* 之后 */
.theme-blue {
  background-color: $calculator-accent-blue;
  color: $calculator-text-primary;
}
```

**立即测试**：确保文字颜色正常显示。

#### 第4步：继续替换其他颜色
按照同样的方式，逐个替换 `.theme-dark` 和 `.theme-light` 中的颜色。

#### 第5步：替换尺寸
```scss
/* 之前 */
.calculator-button {
  width: 140rpx;
  height: 140rpx;
}

/* 之后 */
.calculator-button {
  width: $calculator-button-size-medium;
  height: $calculator-button-size-medium;
}
```

**立即测试**：确保按钮尺寸正常。

### 继续迁移其他部分...

按照同样的方式，逐个替换：
- 字体大小
- 圆角
- 过渡动画
- 响应式样式

## 迁移检查清单

每个组件迁移完成后，请检查：

### 功能检查
- [ ] 组件正常渲染
- [ ] 所有交互功能正常（点击、悬停等）
- [ ] 所有主题变体正常工作
- [ ] 所有尺寸变体正常工作

### 样式检查
- [ ] 颜色显示正确
- [ ] 尺寸显示正确
- [ ] 间距显示正确
- [ ] 圆角显示正确
- [ ] 动画效果正常

### 响应式检查
- [ ] 在不同屏幕尺寸下正常显示
- [ ] 在小屏幕设备上正常显示
- [ ] 在大屏幕设备上正常显示

## 如果出现问题怎么办

### 问题1：样式不生效
**解决方案**：
1. 检查变量名是否拼写正确
2. 确认 `uni.scss` 正确导入了新样式系统
3. 清除浏览器缓存并重新加载

### 问题2：颜色显示错误
**解决方案**：
1. 检查颜色变量是否正确
2. 确认 `variables.scss` 中的颜色定义正确
3. 回退到上一个工作版本，重新逐步替换

### 问题3：尺寸显示错误
**解决方案**：
1. 检查尺寸变量是否正确
2. 确认 `variables.scss` 中的尺寸定义正确
3. 测试不同设备上的显示效果

### 问题4：动画效果异常
**解决方案**：
1. 检查过渡动画变量是否正确
2. 确认 `variables.scss` 中的动画定义正确
3. 测试不同浏览器的兼容性

## 迁移顺序建议

建议按以下顺序迁移组件：

1. **CalculatorButton** - 最基础的组件
2. **CalculatorDisplay** - 显示组件
3. **CalculatorHeader** - 头部组件
4. **CalculatorButtonGrid** - 按钮网格组件
5. **HistoryButton** - 历史按钮
6. **SettingButton** - 设置按钮
7. **HistoryDrawer** - 历史抽屉
8. **SettingsDrawer** - 设置抽屉
9. **页面组件** - 最后迁移页面级组件

## 最佳实践

1. **一次只迁移一个组件**
2. **每次修改后立即测试**
3. **保持小步快跑的节奏**
4. **遇到问题立即回退**
5. **详细记录每次修改**
6. **在不同设备上测试**

## 完成迁移后

当所有组件都迁移完成后：

1. **全面测试应用**
2. **检查所有功能**
3. **验证响应式设计**
4. **清理不需要的旧代码**
5. **更新文档**

## 需要帮助？

如果在迁移过程中遇到任何问题，请：
1. 检查本指南的问题解决部分
2. 参考 `styles/README.md` 中的详细文档
3. 查看 `components/CalculatorButton-migrated.vue` 示例
4. 回退到上一个工作版本重新开始 