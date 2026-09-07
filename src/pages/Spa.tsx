import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import PageHero from '@/components/PageHero'
import AnimatedSection from '@/components/AnimatedSection'
import SectionHeading from '@/components/SectionHeading'
import ImageGallery from '@/components/ImageGallery'
import { spaTreatments } from '@/data/spa'
import { getImagesByCategory } from '@/data/gallery'
import { formatAriary } from '@/utils/helpers'

export default function Spa() {
  const { t } = useTranslation()
  const poolImages = getImagesByCategory('pool')
  const spaImages = getImagesByCategory('spa')

  return (
    <>
      <PageHero image="/images/pool/pool-1.jpg" title={t('spa.heroTitle')} subtitle={t('spa.heroSubtitle')} />

      {/* Pool section */}
      <AnimatedSection className="container-luxe py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="section-eyebrow">{t('spa.poolEyebrow')}</div>
          <h2 className="section-title mb-5">{t('spa.poolTitle')}</h2>
          <p className="text-gray-600 leading-relaxed">{t('spa.poolText')}</p>
          <div className="mt-6 flex items-center gap-3 text-sm text-charcoal">
            <Clock size={16} className="text-gold-500" /> {t('spa.poolHours')}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="/images/pool/pool-1.jpg" alt="Piscine" className="rounded-md aspect-square object-cover" loading="lazy" />
          <img src="/images/pool/pool-2.jpg" alt="Piscine et jardin" className="rounded-md aspect-square object-cover mt-8" loading="lazy" />
        </div>
      </AnimatedSection>

      {/* Spa section */}
      <section className="bg-cream py-20 md:py-24">
        <div className="container-luxe grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
            <img src="/images/spa/spa-1.jpg" alt="Spa" className="rounded-md aspect-square object-cover" loading="lazy" />
            <img src="/images/spa/spa-2.jpg" alt="Ambiance spa" className="rounded-md aspect-square object-cover mt-8" loading="lazy" />
          </div>
          <div className="order-1 lg:order-2">
            <div className="section-eyebrow">{t('spa.spaEyebrow')}</div>
            <h2 className="section-title mb-5">{t('spa.spaTitle')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('spa.spaText')}</p>
            <div className="mt-6 flex items-center gap-3 text-sm text-charcoal">
              <Clock size={16} className="text-gold-500" /> {t('spa.spaHours')}
            </div>
          </div>
        </div>
      </section>

      {/* Treatments menu */}
      <AnimatedSection className="container-luxe py-20 md:py-24">
        <SectionHeading title={t('spa.treatmentsTitle')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-14 max-w-4xl mx-auto">
          {spaTreatments.map((tr) => (
            <div key={tr.id} className="flex justify-between items-center border border-gray-200 rounded-md p-5 hover:border-gold-500 transition-colors">
              <div>
                <div className="font-medium text-charcoal">{t(`spa.${tr.key}`)}</div>
                <div className="text-xs text-gray-500 mt-1">{t(`spa.${tr.durationKey}`)}</div>
              </div>
              <div className="text-right">
                <div className="text-gold-600 font-serif text-lg">{formatAriary(tr.price)}</div>
                <Link to="/contact#booking" className="text-xs text-gold-600 hover:text-gold-700 underline">
                  {t('spa.bookTreatment')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Gallery */}
      <section className="bg-cream py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow={t('home.galleryEyebrow')} title={t('spa.heroTitle')} />
          <div className="mt-14">
            <ImageGallery images={[...poolImages, ...spaImages]} columns={4} />
          </div>
        </div>
      </section>
    </>
  )
}
