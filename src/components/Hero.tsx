import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import BookingBar from './BookingBar'

/**
 * Hero
 * ----
 * Full-screen hero replicating the reference photo:
 * - Full-bleed building image (dusk lighting)
 * - Centered "ROYAL PALACE" / "A N T S I R A B E" title with gold divider
 * - Tagline in italic serif
 * - Booking bar overlaps the bottom edge on desktop and sits below the hero on mobile
 *
 * IMAGE: /public/images/hero/hero-building.jpg
 * Replace this file (same name) with your own high-resolution photo
 * (recommended: 2400x1600px, dusk/twilight lighting for best contrast).
 */
export default function Hero() {
  const { t } = useTranslation()

  return (
    <div className="relative">
      <section className="relative h-[75vh] min-h-[560px] w-full">
        {/* Background image — seul ce conteneur est clipé */}
        <div className="absolute inset-0 overflow-hidden">
          {/*
            Cette image est le plus gros élément du premier affichage : c'est elle
            qui décide de la vitesse perçue du site. `fetchPriority="high"` la fait
            passer devant le reste dans la file du navigateur, `width`/`height`
            réservent sa place pour que la page ne saute pas quand elle arrive, et
            `loading="eager"` interdit tout report. Un `<link rel="preload">` dans
            index.html la lance avant même que React ne démarre.
          */}
          <img
            src="/images/hero/hero-building.jpg"
            alt="Royal Palace Antsirabe — façade de l'hôtel"
            width={1382}
            height={745}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        </div>

        {/* Centered content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="font-serif text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide">
              {t('hero.title')}
            </h1>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="h-px w-10 bg-gold-500" />
              <span className="text-white/90 text-sm md:text-base tracking-[0.4em] uppercase font-light">
                {t('hero.subtitle')}
              </span>
              <span className="h-px w-10 bg-gold-500" />
            </div>
            <p className="mt-6 text-white/85 font-serif italic text-base md:text-lg tracking-wide">
              {t('hero.tagline')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Keep positional transforms separate from the entrance animation. */}
      <div className="relative z-30 -mt-10 px-4 md:absolute md:bottom-0 md:left-0 md:right-0 md:mt-0 md:translate-y-[calc(50%-0.2cm)] md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
        >
          <div className="container-luxe">
            <div className="bg-white rounded-md shadow-soft-lg p-6 md:bg-transparent md:rounded-none md:shadow-none md:p-0">
              <h2 className="font-serif text-xl mb-1 md:hidden">{t('booking.title')}</h2>
              <p className="text-sm text-gray-500 mb-6 md:hidden">{t('booking.subtitle')}</p>
              <BookingBar floating />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}