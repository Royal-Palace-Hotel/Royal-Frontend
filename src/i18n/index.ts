import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import fr from './locales/fr'
import en from './locales/en'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'royalpalace_lang',
    },
  })

/**
 * `<html lang>` doit suivre la langue affichée.
 *
 * Il était figé à `fr` dans index.html : un visiteur lisant la version anglaise
 * recevait une page déclarée française, ce que les lecteurs d'écran prennent au
 * mot (mauvaise prononciation) et que les moteurs de recherche indexent de
 * travers.
 */
const syncDocumentLanguage = (language: string) => {
  document.documentElement.lang = language.startsWith('en') ? 'en' : 'fr'
}

syncDocumentLanguage(i18n.resolvedLanguage || 'fr')
i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
