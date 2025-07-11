import {ref} from 'vue'
import PlatformAdapter from "@/compatibility";
import {languages} from "@/config/locales";

const currentLanguageId = ref('zh-CN')
const currentLanguageValue = ref({})

const initLocale = () => {
  currentLanguageId.value = PlatformAdapter.storage.getSync('app-language', 'zh-CN')
  applyLocale()
}

const getLocale = (languageId) => {
  return languages.find(t => t.id === languageId)
}

const getCurrentLocale = ()=>{
  return getLocale(currentLanguageId.value)
}

const setLocale = (languageId) => {
  currentLanguageId.value = languageId
  PlatformAdapter.storage.setSync('app-language', languageId)
  applyLocale()
}

const applyLocale = () => {
  currentLanguageValue.value = getCurrentLocale().value
}

const t = (path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, currentLanguageValue.value)
}

export function useI18n() {
  return {
    t,
    initLocale,
    setLocale,
    getLocale,
    getCurrentLocale,

    currentLanguageId,
    currentLanguageValue,
    languages
  }
}