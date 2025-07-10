/**
 * 语言配置索引文件
 * 统一导入和管理所有语言配置
 */
import zhCN from './zh-CN.js';
import enUS from './en-US.js';
import jaJP from './ja-JP.js';
import koKR from './ko-KR.js';

// 支持的语言列表
export const languages = [
  {id: "zh-CN", value: zhCN},
  {id: "en-US", value: enUS},
  {id: "ja-JP", value: jaJP},
  {id: "ko-KR", value: koKR}
]