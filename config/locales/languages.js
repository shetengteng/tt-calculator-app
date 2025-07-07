/**
 * 语言配置
 * 支持的语言列表和系统语言映射
 */
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

export default {
  languages,
  systemLanguageMapping,
  defaultLanguage
}; 