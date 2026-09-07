import { useTranslation } from 'react-i18next'
import { CarTaxiFront, Waves, Hammer, Droplets, MapPin, Bus } from 'lucide-react'
import PageHero from '@/components/PageHero'
import AnimatedSection from '@/components/AnimatedSection'
import SectionHeading from '@/components/SectionHeading'
import ImageGallery from '@/components/ImageGallery'
import { activities, attractionKeys } from '@/data/discover'
import { getImagesByCategory } from '@/data/gallery'

const icons: Record<string, typeof CarTaxiFront> = {
  CarTaxiFront,
  Waves,
  Hammer,
  Droplets,
}

export default function Discover() {
  const { t } = useTranslation()
  const discoverImages = getImagesByCategory('discover')

  return (
    <>
      <PageHero image="/images/discover/antsirabe-2.jpg" title={t('discover.heroTitle')} subtitle={t('discover.heroSubtitle')} />

      <AnimatedSection className="container-luxe py-20 md:py-24">
        <SectionHeading title={t('discover.introTitle')} text={t('discover.introText')} />
      </AnimatedSection>

      {/* Activities */}
      <section className="bg-cream py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading title={t('discover.activitiesTitle')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-14">
            {activities.map((a, idx) => {
              const Icon = icons[a.icon]
              return (
                <AnimatedSection key={a.id} delay={idx * 0.1} className="bg-white rounded-md overflow-hidden shadow-card flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 aspect-[4/3] sm:aspect-auto overflow-hidden">
                    <img src={a.image} alt={t(`discover.${a.titleKey}`)} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-6 flex-1">
                    <Icon className="text-gold-500 mb-3" size={22} />
                    <h3 className="font-serif text-lg mb-2">{t(`discover.${a.titleKey}`)}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t(`discover.${a.textKey}`)}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Nearby attractions + Transport */}
      <AnimatedSection className="container-luxe py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h3 className="font-serif text-2xl mb-6 flex items-center gap-3">
            <MapPin className="text-gold-500" size={24} /> {t('discover.attractionsTitle')}
          </h3>
          <ul className="space-y-3">
            {attractionKeys.map((key) => (
              <li key={key} className="flex items-center gap-3 text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                {t(`discover.${key}`)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-2xl mb-6 flex items-center gap-3">
            <Bus className="text-gold-500" size={24} /> {t('discover.transportTitle')}
          </h3>
          <p className="text-gray-600 leading-relaxed">{t('discover.transportText')}</p>
        </div>
      </AnimatedSection>

      {/* Gallery */}
      <section className="bg-cream py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow={t('home.galleryEyebrow')} title={t('discover.heroTitle')} />
          <div className="mt-14">
            <ImageGallery images={discoverImages} columns={4} />
          </div>
        </div>
      </section>
    </>
  )
}
