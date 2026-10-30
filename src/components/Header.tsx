import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/utils/helpers'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentLang = (i18n.resolvedLanguage || i18n.language || 'fr').toLowerCase().startsWith('en')
    ? 'en'
    : 'fr'

  const switchLang = (lang: 'fr' | 'en') => {
    i18n.changeLanguage(lang)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isWhiteHeader = scrolled || mobileOpen

  const navItems = [
    {
      to: '/chambres-suites',
      label: currentLang === 'en' ? 'ROOMS & SUITES' : 'CHAMBRES & SUITES',
    },
    {
      to: '/restaurant',
      label: 'RESTAURANT',
    },
    {
      to: '/piscine-bien-etre',
      label: currentLang === 'en' ? 'POOL & WELLNESS' : 'PISCINE & BIEN-ÊTRE',
    },
    {
      to: '/offre-sur-mesure',
      label: currentLang === 'en' ? 'MEETINGS & EVENTS' : 'RÉUNIONS & ÉVÉNEMENTS',
      altMatch: '/reunions-evenements',
    },
    {
      to: '/decouvrir-antsirabe',
      label: currentLang === 'en' ? 'DISCOVER ANTSIRABE' : 'DÉCOUVRIR ANTSIRABE',
    },
    {
      to: '/contact',
      label: 'CONTACT',
    },
  ]

  return (
    <header
      className={classNames(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isWhiteHeader
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 border-b border-black/5 text-[#2B2B2B]'
          : 'bg-gradient-to-b from-black/70 via-black/35 to-transparent py-4 text-white'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo - Navigates to Home / Accueil */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={isWhiteHeader ? '/images/logo-dark.png' : '/images/logo.png'}
            alt="Royal Palace Antsirabe"
            className="h-11 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 text-[11px] tracking-wider uppercase font-medium">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.altMatch && location.pathname === item.altMatch)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={classNames(
                  'relative py-1 text-center leading-tight transition-all duration-200',
                  isWhiteHeader
                    ? isActive
                      ? 'text-[#2B2B2B] border-b-2 border-[#C6A87D] font-semibold'
                      : 'text-[#2B2B2B]/80 hover:text-[#C6A87D] border-b-2 border-transparent'
                    : isActive
                      ? 'text-white border-b-2 border-white font-semibold'
                      : 'text-white/85 hover:text-white border-b-2 border-transparent'
                )}
              >
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Right Actions: FR | EN language switch + Reserve button */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Language Switcher: FR | EN */}
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider">
            <button
              type="button"
              onClick={() => switchLang('fr')}
              className={classNames(
                'transition-colors duration-200 cursor-pointer px-1 py-0.5 rounded',
                currentLang === 'fr'
                  ? isWhiteHeader
                    ? 'text-black font-bold border-b border-black'
                    : 'text-white font-bold border-b border-white'
                  : isWhiteHeader
                    ? 'text-black/45 hover:text-black font-normal'
                    : 'text-white/60 hover:text-white font-normal'
              )}
              aria-label="Passer en Français"
            >
              FR
            </button>
            <span className={isWhiteHeader ? 'text-black/25' : 'text-white/30'}>|</span>
            <button
              type="button"
              onClick={() => switchLang('en')}
              className={classNames(
                'transition-colors duration-200 cursor-pointer px-1 py-0.5 rounded',
                currentLang === 'en'
                  ? isWhiteHeader
                    ? 'text-black font-bold border-b border-black'
                    : 'text-white font-bold border-b border-white'
                  : isWhiteHeader
                    ? 'text-black/45 hover:text-black font-normal'
                    : 'text-white/60 hover:text-white font-normal'
              )}
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Reserve Button matching mockup gold style */}
          <Link
            to="/contact#booking"
            className="bg-[#C6A87D] hover:bg-[#B5966B] text-white px-5 py-2 uppercase text-[11px] tracking-widest font-semibold rounded-sm transition-all duration-300 shadow-sm hover:shadow"
          >
            {currentLang === 'en' ? 'BOOK NOW' : 'RÉSERVER'}
          </Link>
        </div>

        {/* Mobile menu trigger + mobile lang switcher */}
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex items-center gap-1 text-xs font-semibold tracking-wider mr-1">
            <button
              type="button"
              onClick={() => switchLang('fr')}
              className={classNames(
                'px-1 py-0.5',
                currentLang === 'fr'
                  ? isWhiteHeader ? 'text-black font-bold' : 'text-white font-bold'
                  : isWhiteHeader ? 'text-black/40' : 'text-white/60'
              )}
            >
              FR
            </button>
            <span className={isWhiteHeader ? 'text-black/25' : 'text-white/30'}>|</span>
            <button
              type="button"
              onClick={() => switchLang('en')}
              className={classNames(
                'px-1 py-0.5',
                currentLang === 'en'
                  ? isWhiteHeader ? 'text-black font-bold' : 'text-white font-bold'
                  : isWhiteHeader ? 'text-black/40' : 'text-white/60'
              )}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            className={classNames('p-2 rounded-md', isWhiteHeader ? 'text-[#2B2B2B]' : 'text-white')}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -8 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="lg:hidden bg-[#181818] shadow-2xl border-t border-white/10 mt-2 mx-3 rounded-xl overflow-hidden text-white"
        >
          <nav className="flex flex-col divide-y divide-white/5">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.altMatch && location.pathname === item.altMatch)

              return (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: navItems.indexOf(item) * 0.04 }}
                >
                  <NavLink
                  to={item.to}
                  className={classNames(
                    'px-6 py-3.5 text-xs tracking-widest uppercase transition-colors',
                    isActive
                      ? 'bg-white/10 text-gold-400 font-semibold'
                      : 'hover:bg-white/5 text-white/90'
                  )}
                >
                  {item.label}
                  </NavLink>
                </motion.div>
              )
            })}
          </nav>

          <div className="p-5 bg-black/40 flex flex-col gap-3">
            <Link
              to="/contact#booking"
              className="w-full text-center bg-[#C6A87D] hover:bg-[#B5966B] text-white py-3 uppercase text-xs tracking-widest font-semibold rounded-sm transition-all"
            >
              {currentLang === 'en' ? 'BOOK NOW' : 'RÉSERVER'}
            </Link>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
