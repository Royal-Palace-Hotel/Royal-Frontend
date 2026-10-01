import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bus, CarTaxiFront, Droplets, Hammer, Landmark, MapPin, Mountain, Sparkles, TreePine, Waves,
} from 'lucide-react'
import PageHero from '@/components/PageHero'
import AnimatedSection from '@/components/AnimatedSection'
import SectionHeading from '@/components/SectionHeading'
import ImageGallery from '@/components/ImageGallery'
import { api, resolveImageUrl } from '@/utils/api'
import { useGalleryImages } from '@/hooks/useGallery'
import type { DiscoverItem } from '@/types'

/** Icônes autorisées pour les activités, saisies par leur nom au back-office. */
const icons: Record<string, typeof CarTaxiFront> = {
  CarTaxiFront, Waves, Hammer, Droplets, MapPin, Landmark, Mountain, TreePine, Sparkles, Bus,
}

export default function Discover() {
  const { t, i18n } = useTranslation()
  const english = i18n.resolvedLanguage?.startsWith('en')
  const discoverImages = useGalleryImages('discover')

  const [activities, setActivities] = useState<DiscoverItem[]>([])
  const [attractions, setAttractions] = useState<DiscoverItem[]>([])

  useEffect(() => {
    let cancelled = false
    api.getDiscover().then((response) => {
      if (cancelled || !response.data) return
      setActivities(response.data.activities ?? [])
      setAttractions(response.data.attractions ?? [])
    })
    return () => { cancelled = true }
  }, [])

  // Libellé saisi au back-office, sinon la traduction portée par la clé.
  // Les clés diffèrent selon le type : `activity1Title` mais `attraction1`.
  const title = (item: DiscoverItem) => {
    const custom = english ? item.titleEn || item.title : item.title
    if (custom) return custom
    if (!item.key) return ''
    return t(item.type === 'attraction' ? `discover.${item.key}` : `discover.${item.key}Title`)
  }
  const text = (item: DiscoverItem) => {
    const custom = english ? item.textEn || item.text : item.text
    return custom || (item.key ? t(`discover.${item.key}Text`) : '')
  }

  return (
    <>
      <PageHero image="/images/discover/antsirabe-2.jpg" title={t('discover.heroTitle')} subtitle={t('discover.heroSubtitle')} />

      <AnimatedSection className="container-luxe py-20 md:py-24">
        <SectionHeading title={t('discover.introTitle')} text={t('discover.introText')} />
      </AnimatedSection>

      {/* Activities */}
      {activities.length > 0 && (
        <section className="bg-cream py-20 md:py-24">
          <div className="container-luxe">
            <SectionHeading title={t('discover.activitiesTitle')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-14">
              {activities.map((activity, idx) => {
                const Icon = icons[activity.icon || ''] ?? Sparkles
                return (
                  <AnimatedSection key={activity.id} delay={idx * 0.1}
                    className="bg-white rounded-md overflow-hidden shadow-card flex flex-col sm:flex-row">
                    {activity.image && (
                      <div className="sm:w-1/3 aspect-[4/3] sm:aspect-auto overflow-hidden">
                        <img src={resolveImageUrl(activity.image)} alt={title(activity)}
                          className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6 flex-1">
                      <Icon className="text-gold-500 mb-3" size={22} aria-hidden="true" />
                      <h3 className="font-serif text-lg mb-2">{title(activity)}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{text(activity)}</p>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Nearby attractions + Transport */}
      <AnimatedSection className="container-luxe py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h3 className="font-serif text-2xl mb-6 flex items-center gap-3">
            <MapPin className="text-gold-500" size={24} aria-hidden="true" /> {t('discover.attractionsTitle')}
          </h3>
          <ul className="space-y-3">
            {attractions.map((attraction) => (
              <li key={attraction.id} className="flex items-center gap-3 text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" aria-hidden="true" />
                {title(attraction)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-2xl mb-6 flex items-center gap-3">
            <Bus className="text-gold-500" size={24} aria-hidden="true" /> {t('discover.transportTitle')}
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
