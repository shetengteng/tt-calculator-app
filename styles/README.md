# 样式管理文档

## 文件结构

```
styles/
├── index.scss          # 样式入口文件
├── variables.scss      # 设计变量
├── mixins.scss        # 混合器
├── global.scss        # 全局样式
└── README.md          # 本文档
```

## 文件说明

### 1. variables.scss
定义了所有的设计变量，包括：
- 颜色系统
- 尺寸系统
- 字体尺寸
- 间距系统
- 圆角系统
- 阴影系统
- 过渡动画
- 媒体查询断点

### 2. mixins.scss
定义了可重用的样式混合器，包括：
- 安全区域适配
- 按钮样式
- 抽屉样式
- 响应式断点
- 文本处理
- 居中对齐

### 3. global.scss
定义了全局样式和工具类，包括：
- 页面基础样式
- 通用工具类
- 间距工具类
- 颜色工具类
- 圆角工具类
- 阴影工具类
- 过渡动画工具类

### 4. index.scss
样式入口文件，按顺序导入所有样式文件。

## 使用方法

### 在组件中使用变量和混合器

```scss
<style lang="scss" scoped>
.my-button {
  @include button-base;
  @include button-size(medium);
  @include button-theme(blue);
  @include button-interactions;
  
  // 使用变量
  margin: $spacing-md;
  border-radius: $border-radius-large;
  transition: all $transition-medium;
}

// 响应式设计
@include small-screen {
  .my-button {
    @include button-size(small);
  }
}
</style>
```

### 使用工具类

```html
<template>
  <view class="center-flex p-md bg-primary text-white rounded-lg shadow-medium">
    <text class="text-ellipsis">这是一个示例文本</text>
  </view>
</template>
```

## 样式变量参考

### 颜色变量
- `$calculator-primary-background`: #2C2C2E
- `$calculator-secondary-background`: #FFFFFF
- `$calculator-accent-blue`: #00A8E6
- `$calculator-light-gray`: #A6A6A6
- `$calculator-dark-gray`: #505050
- `$calculator-text-primary`: #FFFFFF
- `$calculator-text-secondary`: #000000
- `$calculator-text-muted`: #8E8E93

### 尺寸变量
- `$calculator-button-size-small`: 120rpx
- `$calculator-button-size-medium`: 140rpx
- `$calculator-button-size-large`: 160rpx

### 间距变量
- `$spacing-xs`: 8rpx
- `$spacing-sm`: 16rpx
- `$spacing-md`: 24rpx
- `$spacing-lg`: 32rpx
- `$spacing-xl`: 40rpx
- `$spacing-xxl`: 60rpx

### 圆角变量
- `$border-radius-small`: 16rpx
- `$border-radius-medium`: 25%
- `$border-radius-large`: 45%
- `$border-radius-circle`: 50%

### 过渡动画变量
- `$transition-fast`: 0.1s ease-out
- `$transition-medium`: 0.2s ease
- `$transition-slow`: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)

## 混合器参考

### 按钮混合器
```scss
@include button-base;                    // 按钮基础样式
@include button-size(small|medium|large); // 按钮尺寸
@include button-theme(blue|dark|light);   // 按钮主题
@include button-active;                   // 按钮激活状态
@include button-interactions;             // 按钮交互效果
```

### 响应式混合器
```scss
@include small-screen { ... }           // 小屏幕适配
@include extra-small-screen { ... }     // 超小屏幕适配
@include low-height-screen { ... }      // 低高度屏幕适配
@include iphone4-optimization { ... }   // iPhone 4/4S 优化
@include respond-to(small|medium|large|xlarge) { ... } // 响应式断点
```

### 工具混合器
```scss
@include safe-area-top;                 // 安全区域顶部
@include safe-area-bottom;              // 安全区域底部
@include center-flex;                   // Flexbox 居中
@include center-absolute;               // 绝对定位居中
@include text-ellipsis;                 // 文本截断
@include text-ellipsis-multiline(2);    // 多行文本截断
```

## 工具类参考

### 间距工具类
```
.m-xs, .m-sm, .m-md, .m-lg, .m-xl, .m-xxl     // margin
.mt-xs, .mt-sm, .mt-md, .mt-lg, .mt-xl, .mt-xxl // margin-top
.mb-xs, .mb-sm, .mb-md, .mb-lg, .mb-xl, .mb-xxl // margin-bottom
.ml-xs, .ml-sm, .ml-md, .ml-lg, .ml-xl, .ml-xxl // margin-left
.mr-xs, .mr-sm, .mr-md, .mr-lg, .mr-xl, .mr-xxl // margin-right
.p-xs, .p-sm, .p-md, .p-lg, .p-xl, .p-xxl       // padding
.pt-xs, .pt-sm, .pt-md, .pt-lg, .pt-xl, .pt-xxl // padding-top
.pb-xs, .pb-sm, .pb-md, .pb-lg, .pb-xl, .pb-xxl // padding-bottom
.pl-xs, .pl-sm, .pl-md, .pl-lg, .pl-xl, .pl-xxl // padding-left
.pr-xs, .pr-sm, .pr-md, .pr-lg, .pr-xl, .pr-xxl // padding-right
```

### 颜色工具类
```
.text-primary, .text-secondary, .text-muted, .text-blue
.bg-primary, .bg-secondary, .bg-blue, .bg-light-gray, .bg-dark-gray
```

### 圆角工具类
```
.rounded-sm, .rounded-md, .rounded-lg, .rounded-circle
```

### 阴影工具类
```
.shadow-light, .shadow-medium, .shadow-heavy
```

### 过渡动画工具类
```
.transition-fast, .transition-medium, .transition-slow
```

### 通用工具类
```
.center-flex           // Flexbox 居中
.center-absolute       // 绝对定位居中
.text-ellipsis         // 文本截断
.text-ellipsis-2       // 2行文本截断
.text-ellipsis-3       // 3行文本截断
.safe-area-inset-top   // 安全区域顶部
.safe-area-inset-bottom // 安全区域底部
.button-press          // 按钮按压动画
```

## 最佳实践

1. **优先使用变量和混合器**：避免硬编码数值，使用预定义的变量和混合器
2. **响应式设计**：使用响应式混合器确保在不同设备上的良好表现
3. **工具类优先**：对于简单的样式，优先使用工具类
4. **保持一致性**：遵循设计系统，确保整个应用的视觉一致性
5. **性能优化**：合理使用 scoped 样式，避免样式污染

## 迁移指南

如果要将现有组件迁移到新的样式系统：

1. 将硬编码的颜色值替换为变量
2. 将重复的样式抽取为混合器
3. 使用工具类替换简单的样式声明
4. 使用响应式混合器替换媒体查询
5. 确保样式标签添加 `lang="scss"` 