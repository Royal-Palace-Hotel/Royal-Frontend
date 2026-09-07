import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'

export type Lang = 'fr' | 'en'

/**
 * useLanguage
 * -----------
 * Small convenience wrapper around react-i18next to manage the
 * current language and expose a toggle/set function used by the
 * <LanguageSelector /> component.
 */
export function useLanguage() {
  const { i18n, t } = useTranslation()

  const currentLang = (i18n.language?.split('-')[0] || 'fr') as Lang

  const setLanguage = useCallback(
    (lang: Lang) => {
      i18n.changeLanguage(lang)
      document.documentElement.lang = lang
    },
    [i18n]
  )

  const toggleLanguage = useCallback(() => {
    setLanguage(currentLang === 'fr' ? 'en' : 'fr')
  }, [currentLang, setLanguage])

  return { lang: currentLang, setLanguage, toggleLanguage, t }
}

export default useLanguage
