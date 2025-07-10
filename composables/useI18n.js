import {ref} from 'vue'
import PlatformAdapter from "@/compatibility";
import {languages} from "@/config/locales/index";

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
  currentLanguageValue.value = getLocale(currentLanguageId.value).value
}
//
// const refreshUI = () => {
//   const currentLang = currentLanguageId.value
//   currentLanguageId.value = ''
//   setTimeout(() => {
//     currentLanguageId.value = currentLang
//     applyLocale()
//   }, 0)
// }

const t = (key) => {
  return getNestedValue(currentLanguageValue.value, key)
}

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
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