/**
 * 声音配置
 * 计算器音效配置管理
 */
export const soundConfig = {
  version: "1.0.0",
  description: "Calculator Sound Effects Configuration - Simplified",
  soundTypes: {
    classic: {
      name: "经典音效",
      nameEn: "Classic Sounds",
      description: "传统计算器音效",
      descriptionEn: "Traditional calculator sounds",
      files: {
        buttonPress: "classic/button-press.wav",
        result: "classic/result.wav"
      }
    },
    modern: {
      name: "现代音效",
      nameEn: "Modern Sounds",
      description: "现代化UI音效",
      descriptionEn: "Modern UI sound effects",
      files: {
        buttonPress: "modern/button-press.wav",
        result: "modern/result.wav"
      }
    },
    natural: {
      name: "自然音效",
      nameEn: "Natural Sounds",
      description: "自然声音效果",
      descriptionEn: "Natural sound effects",
      files: {
        buttonPress: "natural/button-press.wav",
        result: "natural/result.wav"
      }
    },
    tech: {
      name: "科技音效",
      nameEn: "Tech Sounds",
      description: "科技感音效",
      descriptionEn: "Futuristic tech sounds",
      files: {
        buttonPress: "tech/button-press.wav",
        result: "tech/result.wav"
      }
    }
  },
  audioFormat: "wav",
  sampleRate: 44100,
  bitRate: 128,
  maxDuration: 2000,
  recommendedVolume: {
    buttonPress: 0.6,
    result: 0.9
  }
};

/**
 * 获取音效类型配置
 * @param {string} type - 音效类型
 * @returns {object} 音效配置对象
 */
export const getSoundType = (type) => {
  return soundConfig.soundTypes[type] || soundConfig.soundTypes.classic;
};

/**
 * 获取所有可用音效类型
 * @returns {Array} 音效类型列表
 */
export const getAvailableSoundTypes = () => {
  return Object.keys(soundConfig.soundTypes).map(key => ({
    id: key,
    ...soundConfig.soundTypes[key]
  }));
};

/**
 * 获取音效文件路径
 * @param {string} type - 音效类型
 * @param {string} action - 动作类型 (buttonPress, result)
 * @returns {string} 音效文件路径
 */
export const getSoundFilePath = (type, action) => {
  const soundType = getSoundType(type);
  return soundType.files[action] ? `/static/sounds/${soundType.files[action]}` : null;
};

/**
 * 获取推荐音量
 * @param {string} action - 动作类型
 * @returns {number} 推荐音量值
 */
export const getRecommendedVolume = (action) => {
  return soundConfig.recommendedVolume[action] || 0.5;
};

export default {
  soundConfig,
  getSoundType,
  getAvailableSoundTypes,
  getSoundFilePath,
  getRecommendedVolume
}; 