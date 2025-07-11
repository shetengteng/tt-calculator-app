import {ref} from 'vue'
import {themes} from '@/config/themes'
import {PlatformAdapter} from '@/compatibility/index.js'

const currentThemeId = ref('auto')

const initTheme = () => {
    currentThemeId.value = PlatformAdapter.storage.getSync('app-theme', 'auto')
    applyTheme()
}

const applyTheme = () => {
    const rootElement = PlatformAdapter.dom.getRootElement()
    // 移除所有主题类
    themes.forEach(theme => {
        PlatformAdapter.dom.removeClass(rootElement, theme.class)
    })
    // 添加当前主题类
    PlatformAdapter.dom.addClass(rootElement, getCurrentPracticalTheme().class)
    // 设置主题数据属性 - 使用原始主题ID用于识别
    PlatformAdapter.dom.setAttribute(rootElement, 'data-theme', getCurrentTheme().id)
}

const getCurrentPracticalTheme = () => {
    return currentThemeId.value === 'auto' ?
        getTheme(PlatformAdapter.system.getSystemTheme()) :
        getCurrentTheme()
}

const getCurrentTheme = () => {
    return getTheme(currentThemeId.value)
}

const getTheme = (themeId) => {
    return themes.find(t => t.id === themeId)
}

const setTheme = (themeId) => {
    currentThemeId.value = themeId
    PlatformAdapter.storage.setSync('app-theme', themeId)
    applyTheme()
}

export function useTheme() {
    return {
        initTheme,
        setTheme,
        getCurrentTheme,
        getCurrentPracticalTheme,

        themes,
        currentThemeId
    }
}