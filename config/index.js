/**
 * 统一配置索引文件
 * 导出所有配置模块
 */

// 导入语言配置
import * as localeConfig from './locales/index.js';

// 导入主题配置
import * as themeConfig from './themes/index.js';

// 导入声音配置
import * as soundConfig from './sounds/index.js';

// 导出所有配置
export {
  localeConfig,
  themeConfig,
  soundConfig
};

// 默认导出
export default {
  locales: localeConfig,
  themes: themeConfig,
  sounds: soundConfig
}; 