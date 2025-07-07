/**
 * 语言配置索引文件
 * 统一导入和管理所有语言配置
 */
import zhCN from './zh-CN.js';
import enUS from './en-US.js';
import jaJP from './ja-JP.js';
import koKR from './ko-KR.js';

// 语言配置常量
export const DEFAULT_LANGUAGE = "zh-CN";

// 支持的语言列表
export const languages = [
  "zh-CN",
  "en-US", 
  "ja-JP",
  "ko-KR"
];

// 系统语言映射
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

// 默认语言
export const defaultLanguage = DEFAULT_LANGUAGE;

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
  if (!langCode) {
    return localeMap[defaultLanguage];
  }
  return localeMap[langCode] || localeMap[defaultLanguage];
};

/**
 * 获取所有可用语言信息
 * @returns {Array} 语言信息列表
 */
export const getAvailableLanguages = () => {
  return languages.map(code => {
    const locale = localeMap[code];
    return {
      code,
      name: locale?._metadata?.name || code,
      flag: locale?._metadata?.flag || '🌐',
      region: locale?._metadata?.region || ''
    };
  });
};

/**
 * 根据系统语言获取匹配的语言代码
 * @param {string} systemLang - 系统语言代码
 * @returns {string} 匹配的语言代码
 */
export const getLanguageBySystem = (systemLang) => {
  if (!systemLang) {
    return defaultLanguage;
  }
  return systemLanguageMapping[systemLang] || defaultLanguage;
};

/**
 * 检查语言是否受支持
 * @param {string} langCode - 语言代码
 * @returns {boolean} 是否受支持
 */
export const isLanguageSupported = (langCode) => {
  return languages.includes(langCode);
};

/**
 * 获取语言的显示名称
 * @param {string} langCode - 语言代码
 * @returns {string} 语言显示名称
 */
export const getLanguageName = (langCode) => {
  const locale = getLocale(langCode);
  return locale?._metadata?.name || langCode;
};

export default {
  languages,
  systemLanguageMapping,
  defaultLanguage,
  localeMap,
  getLocale,
  getAvailableLanguages,
  getLanguageBySystem,
  isLanguageSupported,
  getLanguageName
}; 