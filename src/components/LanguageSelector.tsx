import { useLanguage } from '@/hooks/useLanguage'
import { classNames } from '@/utils/helpers'

interface LanguageSelectorProps {
  light?: boolean // when true, renders white text (for use over dark hero)
}

export default function LanguageSelector({ light = false }: LanguageSelectorProps) {
  const { lang, setLanguage } = useLanguage()

  const baseColor = light ? 'text-white' : 'text-charcoal'
  const inactiveOpacity = light ? 'opacity-60' : 'opacity-50'

  return (
    <div className={classNames('flex items-center gap-1 text-sm font-medium tracking-wide', baseColor)} aria-label="Language selector">
      <button
        type="button"
        onClick={() => setLanguage('fr')}
        className={classNames('px-1 transition-opacity hover:opacity-100', lang === 'fr' ? '' : inactiveOpacity)}
        aria-current={lang === 'fr'}
      >
        FR
      </button>
      <span className="opacity-40">|</span>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={classNames('px-1 transition-opacity hover:opacity-100', lang === 'en' ? '' : inactiveOpacity)}
        aria-current={lang === 'en'}
      >
        EN
      </button>
    </div>
  )
}
