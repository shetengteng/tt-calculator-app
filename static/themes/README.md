# 主题系统

## 概述

计算器应用的主题系统现已完全配置化，支持通过JSON文件定义主题，包含丰富的元数据信息。

## 文件结构

```
static/themes/
├── index.json          # 主题索引文件
├── light.json          # 浅色主题配置
├── dark.json           # 深色主题配置
├── auto.json           # 自动主题配置
└── README.md           # 说明文档
```

## 主题配置文件格式

每个主题配置文件包含以下结构：

```json
{
  "id": "主题ID",
  "name": "主题名称",
  "nameEn": "英文名称",
  "description": "主题描述",
  "descriptionEn": "英文描述",
  "version": "版本号",
  "author": "作者",
  "preview": {
    "primaryColor": "主色调",
    "backgroundColor": "背景色",
    "thumbnail": "缩略图路径"
  },
  "metadata": {
    "category": "分类",
    "tags": ["标签"],
    "recommended": true,
    "accessibility": {
      "highContrast": false,
      "colorBlindFriendly": true
    }
  },
  "colors": {
    // 完整的颜色定义
  }
}
```

## 颜色变量

所有颜色变量都通过主题配置文件定义，包括：

- `primaryBackground` - 主背景色
- `secondaryBackground` - 次背景色
- `textPrimary` - 主文字色
- `buttonBlue` - 蓝色按钮
- `buttonDark` - 深色按钮
- `buttonLight` - 浅色按钮
- 等等...

## 使用方法

1. **添加新主题**：
   - 在 `static/themes/` 目录下创建新的JSON文件
   - 在 `index.json` 中添加主题引用

2. **修改现有主题**：
   - 直接编辑对应的JSON文件
   - 系统会自动加载更新

3. **禁用主题**：
   - 在 `index.json` 中设置 `enabled: false`

## 技术实现

- 主题配置通过 `useTheme.js` composable 加载
- 支持主题缓存，提高性能
- 自动应用CSS自定义属性
- 兼容小程序和H5环境

## 迁移说明

原有的硬编码颜色变量已从以下文件中移除：
- `styles/variables.scss` - 移除硬编码颜色
- `composables/useTheme.js` - 从配置文件读取
- `components/settings/ThemeSetting.vue` - 使用配置数据 