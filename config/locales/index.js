/**
 * 语言配置索引文件
 * 统一导入和管理所有语言配置
 */
import zhCN from './zh-CN.js';
import enUS from './en-US.js';
import jaJP from './ja-JP.js';
import koKR from './ko-KR.js';

// 语言配置
export const languages = [
  "zh-CN",
  "en-US", 
  "ja-JP",
  "ko-KR"
];

export const systemLanguageMapping = {
  "zh": "zh-CN",
  "zh-CN": "zh-CN",
  "zh-Hans": "zh-CN",
  "en": "en-US",
  "en-US": "en-US",
  "ja": "ja-JP",
  "ja-JP": "ja-JP",
  "ko": "ko-KR",
  "ko-KR": "ko-KR"
};

export const defaultLanguage = "zh-CN";

// 语言配置映射
export const localeMap = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
  'ko-KR': koKR
};



/**
 * 获取语言配置
 * @param {string} langCode - 语言代码
 * @returns {object} 语言配置对象
 */
export const getLocale = (langCode) => {
  return localeMap[langCode] || localeMap[defaultLanguage];
};

/**
 * 获取所有可用语言
 * @returns {Array} 语言列表
 */
export const getAvailableLanguages = () => {
  return languages.map(code => ({
    code,
    ...localeMap[code]._metadata
  }));
};

/**
 * 根据系统语言获取匹配的语言代码
 * @param {string} systemLang - 系统语言代码
 * @returns {string} 匹配的语言代码
 */
export const getLanguageBySystem = (systemLang) => {
  return systemLanguageMapping[systemLang] || defaultLanguage;
};

export default {
  localeMap,
  languages,
  systemLanguageMapping,
  defaultLanguage,
  getLocale,
  getAvailableLanguages,
  getLanguageBySystem
}; 